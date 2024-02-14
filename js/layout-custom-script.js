var currentVersion;
var currentRole;
var publicationTitle;
var mainElement;
var siteSideBar;
var publicationDataHolder;
var versionDataHolder;
var publishedDate;
var indexContent;
var leastRecentVersion = 81;
var mostRecentVersion = 102;
var topicName;
var dataModel;
var dataModelVersions = ["2.0", "2.1"];
var jaVersionStartingFrom = 101;
var currentLanguage;
var currentProduct;

removeCludoStrings();

function checkXmcForEarlyAccess() {
    var eaUserName = "xmc-user";

    if (window.location.pathname.includes("/xmc/")) {

        var authToken = "eG1jLXVzZXI6ZG9jLWFjY2Vzcw==";

        var eaUser = localStorage.getItem("xmcUser");

        if (eaUser == null) {
            let userName = prompt("Please enter the Username:", '');

            if (userName == eaUserName) {
                let pass = prompt('Password:', '');

                var token = btoa(eaUserName + ":" + pass);

                if (token == authToken) {
                    localStorage.setItem("xmcUser", "xmc-user");
                } else {
                    localStorage.removeItem("xmcUser");
                    redirectToHomePage();
                }
            }
            else {
                redirectToHomePage();
            }
        }
    }

}

function redirectToHomePage() {
    window.location = "/";
    alert("Access denied because of incorrect username or password.");
}

checkXmcForEarlyAccess();


$(document).ready(function () {
    $(".panel-body").removeClass("panel-body collapse").addClass("panel-body collapse in");
    $(".panel-heading").addClass("active");
    resetToc();

    displayDocType();
});

function resetToc() {
    //$('.site-sidebar').scrollTop($(".nav-site-sidebar li.active").offset().top);

    $('.site-sidebar').animate({
        scrollTop: $(".nav-site-sidebar li.active").offset().top
    }, 500);
}

window.onload = function () {

    grabMetaValues();

    setCurrentProductLanguage();

    assignTopicName();

    generatePublicationAndVersionList();

    generateFooter();

    if (publicationTitle != "print-experience-manager" &&
        publicationTitle != "Sitecore Connect for Salesforce Marketing Cloud" &&
        publicationTitle != "Cloud" &&
        publicationTitle != "Sitecore Send") {
        generateHeader();
    }

    extendCopyright();

    // if (window.location.href.includes("doc.sitecore.com")) {
    //     extendBreadcrumb();
    // }
    extendBreadcrumb();

    reArrangeMvpElement();

    enableCopyCode();

    makeSectionLinksReadable();

    checkVersionSwitchProperty();

}

function checkVersionSwitchProperty() {
    localStorage.setItem("versionSwitch", false);
}

function setCurrentProductLanguage() {
    // if(window.location.pathname.startsWith("/cdp/")){
    //     currentLanguage = window.location.pathname.split("/")[2];
    // }else{
    //     currentLanguage = window.location.pathname.split("/")[1];
    // } 
    currentProduct = window.location.pathname.split("/")[1];
    currentLanguage = window.location.pathname.split("/")[2];
}

function makeSectionLinksReadable() {
    var sectionLinks = document.getElementsByClassName("section-nav")[0]?.getElementsByTagName("li");

    if (sectionLinks != null) {
        for (var el = sectionLinks.length - 1; el > 0; el--) {
            replaceRandomIdWithSectionName(sectionLinks[el].firstChild);
        }
    }
}

function replaceRandomIdWithSectionName(sectionLink) {
    var randomStringId = sectionLink.getAttribute("href").slice(1);
    var readableId = sectionLink.innerText.toLowerCase().replaceAll(" ", "-").replaceAll("/", "").replaceAll("?", "").replaceAll(",", "").replaceAll(".", "-").replaceAll("'", "-").replaceAll("[", "-").replaceAll("]", "-").replaceAll("(", "-").replaceAll(")", "-");

    sectionLink.href = "#" + readableId;

    var sectionElement = document.getElementById(randomStringId);
    sectionElement.id = readableId;

    var panelBody = document.getElementById(randomStringId + "_body");
    if (panelBody != null) {
        panelBody.id = readableId + "_body";
    }


    var aToggle = sectionElement.getElementsByClassName("titlepage")[0].getElementsByTagName("a")[0];
    if (aToggle != null) {
        aToggle.href = "#" + readableId + "_body";
    }


    var itemizedListElements = document.querySelectorAll("div.itemizedlist > ul > li > p > a");
    for (var i = 0; i < itemizedListElements.length; i++) {
        if (itemizedListElements[i] != null && itemizedListElements[i].getAttribute("href").includes(randomStringId)) {
            itemizedListElements[i].href = itemizedListElements[i].getAttribute("href").replace(randomStringId, readableId);
        }
    }

    var otherLinks = document.getElementsByClassName("link");
    for (var j = 0; j < otherLinks.length; j++) {
        if (otherLinks[j].href.includes(randomStringId)) {
            otherLinks[j].href = otherLinks[j].getAttribute("href").replace(randomStringId, readableId);
        }
    }

}


function enableCopyCode() {
    var preElements = document.getElementsByClassName("programlisting");

    for (var i = 0; i < preElements.length; i++) {
        var preElement = preElements[i];

        var copyButton = generateCopyButton();

        preElement.insertBefore(copyButton, preElement.childNodes[0]);
    }
}

function generateCopyButton() {
    var copyBtn = document.createElement("button");
    copyBtn.setAttribute("class", "copy-button");
    copyBtn.addEventListener("click", copyToClipboard);
    copyBtn.innerHTML = (ifJapanese()) ? "コピー" : "Copy";

    return copyBtn;
}

function copyToClipboard() {
    var pre = this.parentNode;

    var temp = document.createElement("textarea");
    temp.setAttribute("class", "temp");
    temp.innerHTML = pre.textContent.slice(4, pre.textContent.length);
    pre.appendChild(temp);

    temp.select();
    document.execCommand("copy");
    temp.remove();

    updateButtonAsCopied(this);
}

function updateButtonAsCopied(copyBtn) {
    if (copyBtn.innerText === "Copy") {
        copyBtn.innerText = "Copied";
        setTimeout(() => {
            copyBtn.innerText = "Copy";
        }, 500);
    }
}

function reArrangeMvpElement() {
    var mvpElement = document.getElementsByClassName("mediaobject avatar")[0];
    var docTooltip = document.getElementsByClassName("doc-tooltip")[0];

    if (mvpElement != null && docTooltip != null) {
        docTooltip.remove();
        mvpElement.appendChild(docTooltip);
    }
}

function assignTopicName() {
    topicName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1).split(".")[0];

    if (topicName == "index-en") {
        topicName = publicationTitle + " home page";
    }
}

function getJapaneseRole(role) {
    if (role == 'developers') {
        return '開発者';
    } else {
        return 'ユーザー';
    }
}

function extendBreadcrumb() {
    var breadcrumb = document.getElementsByClassName("breadcrumb").item(0);
    var roleCapital = (currentLanguage == 'ja') ? getJapaneseRole(currentRole) : currentRole.charAt(0).toUpperCase() + currentRole.substr(1);
    var versionUrl = '';
    var link = '';
    var atext = '';



    if (currentVersion >= 8 && currentVersion < 19 && !(window.location.pathname.includes("/cdp/") || window.location.pathname.includes("/send/"))) {
        versionUrl = currentVersion.replace('.', '');
        link = '/' + currentProduct + '/' + currentLanguage + '/' + currentRole + '/' + versionUrl;
        atext = roleCapital + ' (' + currentVersion + ')';
    } else if (window.location.pathname.includes("/cdp/")) {
        link = '/cdp/';
        atext = "CDP Home";
    }
    else if (window.location.pathname.includes("/send/")) {
        link = '/send/';
        atext = "Send Home";

    }


    var atag = generateATag(link, atext, false);
    atag.setAttribute("target", "");


    var li = document.createElement("li");
    li.setAttribute("class", "breadcrumb-node");
    li.appendChild(atag);

    breadcrumb.insertBefore(li, breadcrumb.firstChild);
}

function getVersionInteger(decimalVersion) {
    return decimalVersion.replace(".", "");
}

function generatePublicationAndVersionList() {

    var publicationData = getPublicationData(publicationTitle);

    if (publicationData != undefined) {
        var availableVersions = publicationData.versions.split(",");
    }

    if (currentVersion && (availableVersions?.length > 1 || publicationTitle.toLowerCase() == "sitecore experience commerce")) {
        addPlaceHolderForVersionData();
        var versionList = createDivElement({
            name: "id",
            value: "version-list"
        }, "");

        if (currentLanguage != "ja") {
            versionDataHolder.appendChild(versionList);
            populateVersionList(versionList);
        }
    }

    var refinedCurrentVersion = getVersionInteger(currentVersion);

    if (refinedCurrentVersion >= leastRecentVersion && refinedCurrentVersion <= mostRecentVersion && !publicationTitle.toLowerCase().includes("speak")) {
        addPlaceHolderForPublicationData();
        var publicationList = createDivElement({
            name: "id",
            value: "publication-list"
        }, "");
        publicationDataHolder.appendChild(publicationList);
        populatePublicationList(publicationList);
    }


}

function generateFooter() {

    var feedbackText = (ifJapanese()) ? "このドキュメントに関するフィードバックを " : "Send feedback about the documentation to ";

    var footer = document.getElementsByClassName("site-footer").item(0);
    var feedbackHolder = createDivElement({
        name: "id",
        value: "feedback-holder"
    }, feedbackText);
    footer.insertBefore(feedbackHolder, footer.firstChild);

    addFeedbackLink(feedbackHolder);

    if (ifJapanese()) {

        var extraJaText = getTextNode(" に送る");
        feedbackHolder.appendChild(extraJaText);
    }
}

function generateHeader() {
    //var header = document.getElementsByTagName("h1")[0];
    var header = document.querySelector(".titlepage").getElementsByTagName("h1")[0];

    var ver;
    var strong = document.createElement("strong");
    if (window.location.pathname.startsWith("/cdp") && currentRole != "users") {
        dataModelVersions.forEach(dmVersion => {
            if (dmVersion != dataModel) {
                strong.innerHTML = "You are viewing documentation for data model " + dataModel + ". Access v" + dmVersion + " ";
                var otherLink = window.location.pathname.replace(dataModel.replace(".", "-"), dmVersion.replace(".", "-"));
                ver = generateATag(otherLink.replace(otherLink.substr(otherLink.lastIndexOf("/")), "/") + "index-en.html", "here.", false);
            }
        });

    } else {
        strong.innerHTML = (ifJapanese()) ? "現在のバージョン: " : "Current version: ";
        ver = getTextNode(currentVersion);
    }


    var headerHolder = createDivElement({
        name: "id",
        value: "current-version"
    });

    headerHolder.appendChild(strong);
    if (ver != null) {
        headerHolder.appendChild(ver);
    }
    if ((window.location.pathname.startsWith("/cdp") && currentRole != "users") || !window.location.pathname.startsWith("/cdp")) {
        header.parentNode.appendChild(headerHolder);
    }

}


function extendCopyright() {
    var year = (new Date()).getFullYear();
    var copyright = document.getElementsByClassName("copyright").item(0);

    copyright.innerHTML = '';
    //copyright.appendChild(generateATag('/about/index.html', "About this site"));
    //copyright.appendChild(document.createTextNode(" · "));
    copyright.appendChild(generateATag((ifJapanese()) ? "https://www.sitecore.com/ja-jp/trust/privacy-policy" : 'https://www.sitecore.com/trust/privacy-policy',
        (ifJapanese()) ? "プライバシー ポリシー" : "Privacy policy"));
    copyright.appendChild(getTextNode(" · "));
    copyright.appendChild(generateATag((ifJapanese()) ? "https://www.sitecore.com/ja-jp/trust" : 'https://www.sitecore.com/trust',
        (ifJapanese()) ? "法的事項" : "Legal notice"));
    copyright.appendChild(getTextNode(" · "));

    // copyright.appendChild(generateATag('https://profile.sitecore.net:443/dmca_notice', 
    // (ifJapanese()) ? "DMCA 申請" : "DMCA Notice"));
    // copyright.appendChild(getTextNode(" · "));

    var copyrightText = (ifJapanese()) ? "Copyright " : "Copyright ";

    copyright.appendChild(generateATag((ifJapanese()) ? "https://www.sitecore.com/ja-jp/trust/terms-of-use" : 'https://www.sitecore.com/trust/terms-of-use', copyrightText + "© 1999-" + year + " Sitecore"));
}

function ifJapanese() {
    if (window.location.pathname.startsWith("/ja/")) {
        return true;
    }
}


function generateATag(link, linkText, blank = true) {
    var aTag = document.createElement("a");
    aTag.setAttribute("href", link);
    if (blank) {
        aTag.setAttribute("target", "_blank");
        aTag.setAttribute("rel", "noopener");
    }

    aTag.innerHTML = linkText;

    return aTag;
}

/*
function grabPublishedDate(){
    if(!window.location.href.endsWith("index-en.html") && window.location.href.endsWith(".html")){
        var indexUrl = window.location.href.split("en")[0] + "en/index-en.html";

        var request = new XMLHttpRequest();
        request.open('GET', indexUrl, true);
        request.responseType = 'blob';
        request.onload = function() {
            var reader = new FileReader();
            reader.readAsText(request.response);            
        };
    }        
}
*/

function addPlaceHolderForPublicationData() {
    mainElement = document.getElementsByTagName("main")[0];
    publicationDataHolder = createDivElement({
        name: "id",
        value: "publication-data"
    }, "");
    mainElement.insertBefore(publicationDataHolder, mainElement.firstChild);
}

function addPlaceHolderForVersionData() {
    siteSideBar = document.getElementsByClassName("site-sidebar")[0];
    versionDataHolder = createDivElement({
        name: "id",
        value: "version-data"
    }, "");

    siteSideBar.insertBefore(versionDataHolder, siteSideBar.lastChild);
}


function addFeedbackLink(feed) {
    var mailLink = document.createElement("a");
    mailLink.href = "mailto:docsite@sitecore.net?Subject=Title : " + topicName + "&body=Url: " + window.location.href;
    mailLink.innerHTML = "docsite@sitecore.net";

    feed.appendChild(mailLink);
}

function redirectToAnotherVersion(versionSelector) {
    localStorage.setItem("versionSwitch", true)

    var selectedVersionUrl = versionSelector.value;

    if (selectedVersionUrl.includes("/content-hub") ||
        selectedVersionUrl.includes("/api-reference") ||
        selectedVersionUrl.includes("/cloud-dev")) {
        selectedVersionUrl = "/ch" + selectedVersionUrl
    }

    window.location.href = selectedVersionUrl + window.location.pathname.substring(window.location.pathname.lastIndexOf("/"))
}

function redirectToAnotherPublication(selectedList) {
    window.location.href = selectedList.value.substr(0, selectedList.value.length);
}

function populatePublicationList(pubListHolder) {
    var publicationSelectList = document.createElement("SELECT");
    publicationSelectList.setAttribute("id", "select-publication");
    pubListHolder.appendChild(publicationSelectList);

    publicationSelectList.addEventListener("change", function () {
        redirectToAnotherPublication(publicationSelectList);
    });

    var promptText = (ifJapanese()) ? " のその他のドキュメント" : "Other documentation for ";

    var promptOption = (ifJapanese()) ? createOption(currentVersion + promptText, "") : createOption(promptText + currentVersion, "");
    publicationSelectList.appendChild(promptOption);

    var lastPublicationAddedFromCurrentVersion = 1;

    for (p in publicationListArray) {
        if (publicationListArray[p].role == currentRole && publicationListArray[p].name != publicationTitle) {

            var compatibleVersionIndexArray = getCompatibleVersionArray(publicationListArray[p].compatibleVersions);

            if (compatibleVersionIndexArray.length == 1) {
                var targetVersion = publicationListArray[p].versions.split(",")[compatibleVersionIndexArray[0]].trim();
                var optionTargetLink = "/" + currentLanguage + publicationListArray[p].link + getVersionInteger(targetVersion) + "/" + getPublicationLinkName(publicationListArray[p].name + "/" + currentLanguage + "/index-" + currentLanguage + ".html");
                option = createOption(publicationListArray[p].name, optionTargetLink);
                if (currentVersion == targetVersion) {
                    publicationSelectList.insertBefore(option, publicationSelectList.childNodes[lastPublicationAddedFromCurrentVersion])
                    lastPublicationAddedFromCurrentVersion = publicationSelectList.childNodes.length;
                } else {
                    publicationSelectList.appendChild(option);
                }

            } else {
                for (var i = 0; i < compatibleVersionIndexArray.length; i++) {
                    var targetVersion = publicationListArray[p].versions.split(",")[compatibleVersionIndexArray[i]].trim();
                    var optionTargetLink = "/" + currentLanguage + publicationListArray[p].link + getVersionInteger(targetVersion) + "/" + getPublicationLinkName(publicationListArray[p].name + "/" + currentLanguage + "/index-" + currentLanguage + ".html");
                    option = createOption(publicationListArray[p].name + " " + targetVersion, optionTargetLink);
                    if (currentVersion == targetVersion) {
                        publicationSelectList.insertBefore(option, publicationSelectList.childNodes[lastPublicationAddedFromCurrentVersion])
                        lastPublicationAddedFromCurrentVersion = publicationSelectList.childNodes.length;
                    } else {
                        publicationSelectList.appendChild(option);
                    }
                }
            }
        }
    }
}

function getCompatibleVersionArray(vList) {
    var versionArray = vList.split(",");
    var compatibleVersionIndexArray = [];
    for (var i = 0; i < versionArray.length; i++) {
        if (versionArray[i].includes(currentVersion)) {
            compatibleVersionIndexArray.push(i);
        }
    }
    return compatibleVersionIndexArray;
}

function getPublicationLinkName(pubName) {
    var publicatioName = pubName.toLowerCase().replace(/ /g, "-");

    if (publicatioName.includes("headless-development")) {
        publicatioName = publicatioName.replace("headless-development", "sitecore-headless-development");
    }

    return publicatioName;
}

function populateVersionList(versionListHolder) {

    var versionSelectList = document.createElement("SELECT");
    versionSelectList.setAttribute("id", "select-version");
    versionListHolder.appendChild(versionSelectList);


    versionSelectList.addEventListener("change", function () {
        redirectToAnotherVersion(versionSelectList);
    });


    var publicationData = getPublicationData(publicationTitle);

    var versionList = getVersionList(publicationData);

    var redirectPublicationTitle = "";

    if (publicationTitle.toLowerCase() == "sitecore commerce") {
        var versionListArray = getPublicationData("Sitecore Experience Commerce").versions.split(',').reverse();
        versionListArray.forEach(version => {
            versionList.unshift(version);
        });
        redirectPublicationTitle = "sitecore-experience-commerce/";
    }

    if (publicationTitle.toLowerCase() == "sitecore experience commerce") {
        var versionListArray = getPublicationData("Sitecore Commerce").versions.split(',');
        versionListArray.forEach(version => {
            versionList.push(version);
        });
        redirectPublicationTitle = "sitecore-commerce/";
    }

    if (publicationTitle.toLowerCase() == "sitecore experience manager" || publicationTitle.toLowerCase() == "platform administration and architecture") {
        versionList.push("8.2", "8.1");
        redirectPublicationTitle = "sitecore-experience-platform/";
    }

    var targetPublicationTitle;

    if (versionList != null && versionList.length > 0) {
        for (v in versionList) {

            if (publicationData.versions.includes(versionList[v].trim())) {
                targetPublicationTitle = getPublicationLinkName(publicationTitle);
            } else {
                targetPublicationTitle = redirectPublicationTitle
            }

            var promptText = (ifJapanese()) ? "バージョン " : "Version ";

            option = createOption(promptText + versionList[v].trim(), publicationData.link + getVersionInteger(versionList[v].trim()) + "/" + targetPublicationTitle);
            versionSelectList.appendChild(option);

            if (currentVersion == versionList[v].trim()) {
                option.setAttribute("selected", true);
            }
        }

        if (publicationData.oldVersion == "true") {
            option = createOption("Earlier versions", "/archive");
            versionSelectList.appendChild(option);
        }
    }
}


function getVersionDataElement(link, version) {
    if (version == currentVersion)
        return "<span id='currentVersion'>" + version + "</span>";

    return "<a href='" + link + "'>" + version + "</a>";
}


function getVersionList(data) {
    if (data.versions != null) {
        return data.versions.split(",");
    } else {
        return null;
    }
}

function getPublicationData(pub_title) {
    for (data in publicationListArray) {
        if (publicationListArray[data].name == pub_title && publicationListArray[data].role == currentRole) {
            return publicationListArray[data];
        }
    }
}

function createDivElement(attribute, textContent) {
    var divElement = document.createElement("div");
    divElement.setAttribute(attribute.name, attribute.value);

    if (textContent != "" && textContent != null) {
        divElement.appendChild(getTextNode(textContent));
    }
    return divElement;
}

function getTextNode(txt) {
    var textNode = document.createTextNode(txt);
    return textNode;
}

function createOption(displayText, val) {
    var option = document.createElement("option");
    option.setAttribute("value", val);
    option.text = displayText;

    return option;
}

function grabMetaValues() {
    //publicationTitle = document.getElementsByClassName("publication-title").item(0).innerHTML;

    var metas = document.getElementsByTagName("meta");

    for (meta in metas) {
        if (metas[meta].name == "version") {
            currentVersion = metas[meta].content;
        }

        if (metas[meta].name == "role") {
            currentRole = metas[meta].content;
        }

        if (metas[meta].name == "product") {
            publicationTitle = metas[meta].content;
        }

        if (metas[meta].name == "data model") {
            dataModel = metas[meta].content;
        }
    }
}




var publicationListArray = [
    {
        name: "Sitecore Customer Data Platform -Data Model 2.0",
        role: "users",
        versions: "",
        compatibleVersions: "",
        oldVersion: "false",
        link: "/cdp/users/"
    },
    {
        name: "Sitecore CDP",
        role: "users",
        versions: "",
        compatibleVersions: "",
        oldVersion: "false",
        link: "/cdp/users/"
    },
    {
        name: "Sitecore Personalize",
        role: "users",
        versions: "",
        compatibleVersions: "",
        oldVersion: "false",
        link: "/cdp/users/"
    },

    {
        name: "Sitecore Experience Platform",
        role: "users",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 8.2, 8.1",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 8.2, 8.1",
        oldVersion: "true",
        link: "/users/"
    }, //7
    {
        name: "Email Experience Manager",
        role: "users",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 3.5, 3.4",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 8.2, 8.2",
        oldVersion: "true",
        link: "/users/exm/"
    }, //7
    {
        name: "Sitecore Commerce",
        role: "users",
        versions: "8.2, 8.1",
        compatibleVersions: "8.2, 8.1",
        oldVersion: "true",
        link: "/users/"
    }, //2     
    {
        name: "Sitecore Experience Commerce",
        role: "users",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0",
        oldVersion: "true",
        link: "/users/"
    }, //5
    {
        name: "Print Experience Manager",
        role: "users",
        versions: "1.1",
        compatibleVersions: "9.3|9.2|9.1|9.0|8.2|8.1",
        oldVersion: "false",
        link: "/users/"
    }, //1
    {
        name: "Sitecore Experience Accelerator",
        role: "users",
        versions: "10.2, 10.1, 10.0, 9.3, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0|8.2, 9.0|8.2, 8.2|9.0, 8.2|8.1",
        oldVersion: "true",
        link: "/users/sxa/"
    }, //8         -------->   30



    {
        name: "Sitecore Customer Data Platform -Data Model 2.0",
        role: "developers",
        versions: "",
        compatibleVersions: "",
        oldVersion: "false",
        link: "/cdp/developers/"
    },
    {
        name: "Sitecore Customer Data Platform -Data Model 2.1",
        role: "developers",
        versions: "",
        compatibleVersions: "",
        oldVersion: "false",
        link: "/cdp/developers/"
    },
    {
        name: "Headless Development",
        role: "developers",
        product: "xp",
        versions: "20.0, 19.0",
        compatibleVersions: "10.2, 10.2",
        oldVersion: "false",
        link: "/developers/hd/"
    },
    {
        name: "What's new",
        role: "developers",
        versions: "10.2, 10.1",
        compatibleVersions: "10.2, 10.1",
        oldVersion: "false",
        link: "/developers/"
    }, //1
    {
        name: "Developer Tools",
        role: "developers",
        versions: "10.2, 10.1, 10.0",
        compatibleVersions: "10.2, 10.1, 10.0",
        oldVersion: "false",
        link: "/developers/"
    }, //1
    {
        name: "Sitecore Experience Platform",
        role: "developers",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 8.2, 8.1",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 8.2, 8.1",
        oldVersion: "true",
        link: "/developers/"
    }, //7
    {
        name: "Print Experience Manager",
        role: "developers",
        versions: "1.1",
        compatibleVersions: "9.3|9.2|9.1|9.0|8.2|8.1",
        oldVersion: "false",
        link: "/developers/"
    }, //1
    {
        name: "Email Experience Manager",
        role: "developers",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 3.5, 3.4",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 8.2, 8.2",
        oldVersion: "true",
        link: "/developers/exm/"
    }, //7
    {
        name: "Sitecore Commerce",
        role: "developers",
        versions: "8.2, 8.1",
        compatibleVersions: "8.2, 8.1",
        oldVersion: "true",
        link: "/developers/"
    }, //2
    {
        name: "Sitecore Experience Commerce",
        role: "developers",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0",
        oldVersion: "true",
        link: "/developers/"
    }, //5
    {
        name: "Web Forms for Marketers",
        role: "developers",
        versions: "9.0, 8.2, 8.1",
        compatibleVersions: "9.0, 8.2, 8.1",
        oldVersion: "true",
        link: "/developers/"
    }, //3
    {
        name: "Sitecore Experience Manager",
        role: "developers",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0",
        oldVersion: "true",
        link: "/developers/"
    }, //5
    {
        name: "Platform Administration and Architecture",
        role: "developers",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0",
        oldVersion: "true",
        link: "/developers/"
    }, //5
    {
        name: "Sitecore Azure",
        role: "developers",
        versions: "8.1",
        compatibleVersions: "8.1",
        oldVersion: "false",
        link: "/developers/sa/"
    }, //1
    {
        name: "Sitecore Experience Accelerator",
        role: "developers",
        versions: "10.2, 10.1, 10.0, 9.3, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0|8.2, 9.0|8.2, 8.2|9.0, 8.2|8.1",
        oldVersion: "true",
        link: "/developers/sxa/"
    }, //8
    {
        name: "SPEAK",
        role: "developers",
        versions: "9.0, 8.0",
        compatibleVersions: "9.1|9.0, 8.2|8.1",
        oldVersion: "false",
        link: "/developers/speak/"
    }, //2    
    {
        name: "xDB Cloud",
        role: "developers",
        versions: "2.0",
        compatibleVersions: "8.2|8.1",
        oldVersion: "true",
        link: "/developers/xdc/"
    }, //1
    {
        name: "Managed Cloud",
        role: "developers",
        versions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 8.2",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0, 8.2",
        oldVersion: "false",
        link: "/developers/"
    }, //1
    {
        name: "Sitecore Azure Toolkit",
        role: "developers",
        versions: "2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.1",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.1, 9.0|8.2, 8.2",
        oldVersion: "true",
        link: "/developers/sat/"
    }, //7
    {
        name: "Sitecore Connect for Salesforce Marketing Cloud",
        role: "developers",
        versions: "7.0, 6.0, 5.0, 1.0",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3|9.2|9.1|9.0",
        oldVersion: "false",
        link: "/developers/salesforce-marketing-cloud/"
    }, //2
    {
        name: "Data Exchange Framework",
        role: "developers",
        versions: "7.0, 6.0, 5.0, 4.0, 3.0, 2.1, 2.0",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0|8.2|8.1",
        oldVersion: "true",
        link: "/developers/def/"
    }, //5
    {
        name: "xDB Data Migration Tool",
        role: "developers",
        versions: "5.0, 4.0, 3.0, 2.1, 2.0",
        compatibleVersions: "10.0, 9.3, 9.2, 9.1, 9.0|8.2|8.1",
        oldVersion: "false",
        link: "/developers/dmt/"
    }, //5
    {
        name: "Sitecore Connect for Salesforce CRM",
        role: "developers",
        versions: "7.0, 6.0, 5.0, 4.0, 3.0, 2.1, 2.0",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0|8.2|8.1",
        oldVersion: "true",
        link: "/developers/salesforce-connect/"
    }, //5
    {
        name: "Sitecore Connect for Sitecore CMP",
        role: "developers",
        versions: "3.0",
        compatibleVersions: "10.0",
        oldVersion: "false",
        link: "/developers/sitecore-cmp/"
    },
    {
        name: "Connect for Content Hub",
        role: "developers",
        versions: "5.0, 4.0",
        compatibleVersions: "10.2, 10.1",
        oldVersion: "false",
        link: "/developers/connect-for-ch/"
    },                                                                             //0
    {
        name: "Sitecore Connect for Microsoft Dynamics 365 for Sales",
        role: "developers",
        versions: "7.0, 6.0, 5.0, 4.0, 3.0, 2.1, 2.0",
        compatibleVersions: "10.2, 10.1, 10.0, 9.3, 9.2, 9.1, 9.0|8.2|8.1",
        oldVersion: "true",
        link: "/developers/dynamics-crm-connect/"
    }

];

function displayDocType() {
    const entryPoint = document.querySelector(".site-header");
    console.log("displayDocType()", entryPoint);
    entryPoint.insertAdjacentHTML("beforebegin", `<div id="doc-type-container"><p>For internal review only</p></div>`);
}

function removeCludoStrings() {
    let html = document.documentElement.innerHTML;
    html = html
        .replace(`<link href="//customer.cludo.com/assets/2063/10039/cludo-search.min.css" type="text/css" rel="stylesheet"></link>`, "AKOS")
        .replace(`<script type="text/javascript" src="//customer.cludo.com/scripts/bundles/search-script.min.js"></script>`, "AKOS")
    document.documentElement.innerHTML = html;

    console.log(document.documentElement.innerHTML);
}
