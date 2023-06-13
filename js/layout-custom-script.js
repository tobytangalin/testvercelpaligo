
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
var mostRecentVersion = 93;
var topicName;

$(document).ready( function () {
    $( ".panel-body" ).removeClass("panel-body collapse").addClass("panel-body collapse in");
    $(".panel-heading").addClass("active");
} );    

window.onload = function(){
    
    grabMetaValues();

    assignTopicName();

    generatePublicationAndVersionList();

    generateFooter();

    if(publicationTitle != "print-experience-manager" 
    && publicationTitle != "Sitecore Connect Software for Salesforce Marketing Cloud"
    && publicationTitle != "managed-cloud"){
        generateHeader();
    }    

    extendCopyright();

    if(window.location.href.includes("doc.sitecore.com")){
        extendBreadcrumb();
    }
}

function assignTopicName(){
    topicName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1).split(".")[0];   

    if(topicName == "index-en"){
        topicName = publicationTitle + " home page";
    }
}

function extendBreadcrumb() {
    var breadcrumb = document.getElementsByClassName("breadcrumb").item(0);
    var roleCapital = currentRole.charAt(0).toUpperCase() +  currentRole.substr(1);
    var versionUrl = '';
    var link = '';
    var atext = '';
    if (currentVersion >= 8)
    {
        versionUrl = currentVersion.replace('.', '');
        link = '/' + currentRole + '/' + versionUrl;
        atext = roleCapital + ' (' + currentVersion + ')';
    }
    else {
        link = '/' + currentRole;
        atext = roleCapital;
    }


    var atag = generateATag(link, atext);
    atag.setAttribute("target", "");


    var li = document.createElement("li");
    li.setAttribute("class", "breadcrumb-node");
    li.appendChild(atag);
    
    breadcrumb.insertBefore(li, breadcrumb.firstChild);
}

function getVersionInteger(decimalVersion){
    return decimalVersion.replace(".", "");
}

function generatePublicationAndVersionList(){
    var publicationData = getPublicationData(publicationTitle);
    var availableVersions = publicationData.versions.split(",");

    if(currentVersion && (availableVersions.length > 1 || publicationTitle.toLowerCase() == "sitecore experience commerce"))
    {
        addPlaceHolderForPublicationData();
        var versionList = createDivElement({name:"id", value:"version-list"}, "");    
        versionDataHolder.appendChild(versionList);
        populateVersionList(versionList);
        var refinedCurrentVersion = getVersionInteger(currentVersion);
    }    

    if(refinedCurrentVersion >= leastRecentVersion && refinedCurrentVersion <= mostRecentVersion && !publicationTitle.toLowerCase().includes("speak")){
        var publicationList = createDivElement( {name:"id", value:"publication-list"}, "");
        publicationDataHolder.appendChild(publicationList);
        populatePublicationSelectList(publicationList);
    }    
}

function generateFooter(){
    var footer = document.getElementsByClassName("site-footer").item(0);
    var feedbackHolder = createDivElement({name:"id", value:"feedback-holder"}, "Send feedback about the documentation to ");
    footer.insertBefore(feedbackHolder, footer.firstChild);

    addFeedbackLink(feedbackHolder);
}

function generateHeader(){
    //var header = document.getElementsByTagName("h1")[0];
    var header = document.querySelector(".titlepage").getElementsByTagName("h1")[0];

   var strong = document.createElement("strong");
   strong.innerHTML = "Current version: ";

    var headerHolder = createDivElement({name:"id", value:"current-version"});
    headerHolder.appendChild(strong);
    var t = document.createTextNode(currentVersion);
    headerHolder.appendChild(t);
    header.parentNode.appendChild(headerHolder);
}


function extendCopyright(){
var year = (new Date()).getFullYear();
var copyright = document.getElementsByClassName("copyright").item(0);

copyright.innerHTML = '';
//copyright.appendChild(generateATag('/about/index.html', "About this site"));
//copyright.appendChild(document.createTextNode(" · "));
copyright.appendChild(generateATag('http://www.sitecore.net/Company/Contact/Privacy-Policy.aspx', "Privacy policy"));
copyright.appendChild(document.createTextNode(" · "));
copyright.appendChild(generateATag('http://www.sitecore.net/Legal/Legal-Notice.aspx', "Legal notice"));
copyright.appendChild(document.createTextNode(" · "));
copyright.appendChild(generateATag('https://profile.sitecore.net:443/dmca_notice', "DMCA Notice"));
copyright.appendChild(document.createTextNode(" · "));
copyright.appendChild(generateATag('http://www.sitecore.net/Legal/Copyright.aspx', "Copyright © 1999-" + year + " Sitecore"));
}


function generateATag(link, linkText){
var aTag = document.createElement("a");
aTag.setAttribute("href", link);
aTag.setAttribute("target", "_blank");
aTag.innerHTML = linkText;

return aTag;
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

function addPlaceHolderForPublicationData(){
    mainElement = document.getElementsByTagName("main")[0];
    publicationDataHolder = createDivElement({name:"id", value:"publication-data"}, "");
    mainElement.insertBefore(publicationDataHolder, mainElement.firstChild);

    siteSideBar = document.getElementsByClassName("site-sidebar")[0];
    versionDataHolder = createDivElement({name:"id", value:"version-data"}, "");

    siteSideBar.insertBefore(versionDataHolder, siteSideBar.lastChild);
}


function addFeedbackLink(feed){
    var mailLink = document.createElement("a");
    mailLink.href = "mailto:docsite@sitecore.net?Subject=Title : " + topicName + "&body=Url: " + window.location.href;
    mailLink.innerHTML = "docsite@sitecore.net";

    feed.appendChild(mailLink);
}

function redirectToPublication(selectedList){
    window.location.href = selectedList.value;
}

function populatePublicationSelectList(pubListHolder){
    var publicationSelectList = document.createElement("SELECT");
    publicationSelectList.setAttribute("id", "select-publication");
    pubListHolder.appendChild(publicationSelectList);

    publicationSelectList.addEventListener("change", function(){
        redirectToPublication(publicationSelectList);
    });

    var promptOption = createOption("Other documentation for " + currentVersion, "");
    publicationSelectList.appendChild(promptOption);

    var lastPublicationAddedFromCurrentVersion = 1;

    for(p in publicationListArray){
        if(publicationListArray[p].role == currentRole && publicationListArray[p].name != publicationTitle){
            
            var compatibleVersionIndexArray = getCompatibleVersionArray(publicationListArray[p].compatibleVersions);  
          
            if(compatibleVersionIndexArray.length == 1){
                var targetVersion = publicationListArray[p].versions.split(",")[compatibleVersionIndexArray[0]].trim();
                var optionTargetLink = publicationListArray[p].link +  getVersionInteger(targetVersion) + "/" + getPublicationLinkName(publicationListArray[p].name);
                option = createOption(publicationListArray[p].name, optionTargetLink);
                if(currentVersion == targetVersion){
                    publicationSelectList.insertBefore(option, publicationSelectList.childNodes[lastPublicationAddedFromCurrentVersion])
                    lastPublicationAddedFromCurrentVersion = publicationSelectList.childNodes.length;
                }
                else{
                    publicationSelectList.appendChild(option);
                }
                
            }
            else{
                for(var i = 0; i < compatibleVersionIndexArray.length; i++){
                    var targetVersion = publicationListArray[p].versions.split(",")[compatibleVersionIndexArray[i]].trim();
                    var optionTargetLink = publicationListArray[p].link +  getVersionInteger(targetVersion) + "/" + getPublicationLinkName(publicationListArray[p].name);
                    option = createOption(publicationListArray[p].name + " " + targetVersion, optionTargetLink);
                    if(currentVersion == targetVersion){
                        publicationSelectList.insertBefore(option, publicationSelectList.childNodes[lastPublicationAddedFromCurrentVersion])
                        lastPublicationAddedFromCurrentVersion = publicationSelectList.childNodes.length;
                    }
                    else{
                        publicationSelectList.appendChild(option);
                    }
                }
            }        
        }        
    }    
}

function getCompatibleVersionArray(vList){
    var versionArray = vList.split(",");
    var compatibleVersionIndexArray = [];
    for(var i=0; i< versionArray.length; i++){
        if(versionArray[i].includes(currentVersion)){            
            compatibleVersionIndexArray.push(i);            
        }        
    }
    return compatibleVersionIndexArray;
}

function getPublicationLinkName(pubName){ 
    return pubName.toLowerCase().replace(/ /g, "-") + "/";
}

function populateVersionList(versionListHolder){

    var versionSelectList = document.createElement("SELECT");
    versionSelectList.setAttribute("id", "select-version");
    versionListHolder.appendChild(versionSelectList);


    versionSelectList.addEventListener("change", function(){
        redirectToPublication(versionSelectList);
    });


    var publicationData = getPublicationData(publicationTitle);

    var versionList = getVersionList(publicationData);

    var redirectPublicationTitle = "";

    if(publicationTitle.toLowerCase() == "sitecore commerce"){
        var versionListArray = getPublicationData("Sitecore Experience Commerce").versions.split(',').reverse();
        versionListArray.forEach(version => {
            versionList.unshift(version);
        });        
        redirectPublicationTitle = "sitecore-experience-commerce/";
    }

    if(publicationTitle.toLowerCase() == "sitecore experience commerce"){
        var versionListArray = getPublicationData("Sitecore Commerce").versions.split(',');
        versionListArray.forEach(version => {
            versionList.push(version);
        });
        redirectPublicationTitle = "sitecore-commerce/";
    }     

    if(publicationTitle.toLowerCase() == "sitecore experience manager" || publicationTitle.toLowerCase() == "platform administration and architecture"){
        versionList.push("8.2", "8.1");
        redirectPublicationTitle = "sitecore-experience-platform/";
    }

    var targetPublicationTitle;

    if(versionList != null && versionList.length > 0){
        for(v in versionList){
            
            if(publicationData.versions.includes(versionList[v].trim())){
                targetPublicationTitle = getPublicationLinkName(publicationTitle);
            }
            else{
                targetPublicationTitle = redirectPublicationTitle
            }

            option = createOption("Version " + versionList[v].trim(), publicationData.link +  getVersionInteger(versionList[v].trim()) + "/" + targetPublicationTitle);
            versionSelectList.appendChild(option);

            if(currentVersion == versionList[v].trim())
            {
                option.setAttribute("selected", true);
            }
        }        

        if(publicationData.oldVersion == "true"){
            option = createOption("Earlier versions", "/archive");
            versionSelectList.appendChild(option);
        }        
    }     
}


function getVersionDataElement(link, version){
    if(version == currentVersion)
        return "<span id='currentVersion'>" + version + "</span>";
    
    return "<a href='" + link + "'>" + version + "</a>";
}


function getVersionList(data){    
    if(data.versions != null){
        return data.versions.split(",");            
    }else{
        return null;
    }            
}

function getPublicationData(pub_title){
    for(data in publicationListArray){
        if(publicationListArray[data].name == pub_title && publicationListArray[data].role == currentRole){
            return publicationListArray[data];            
        }
    }   
}

function createDivElement(attribute, textContent){
    var divElement = document.createElement("div");
    divElement.setAttribute(attribute.name, attribute.value);

    if(textContent != "" && textContent != null){
        divElement.appendChild(getTextNode(textContent));
    }
    return divElement;
}

function getTextNode(txt){
    var textNode = document.createTextNode(txt);
    return textNode;
}

function createOption(displayText, val){
    var option = document.createElement("option");
    option.setAttribute("value", val);
    option.text = displayText;

    return option;
}

function grabMetaValues(){
    //publicationTitle = document.getElementsByClassName("publication-title").item(0).innerHTML;
    
    var metas = document.getElementsByTagName("meta");

    for(meta in metas){
        if(metas[meta].name == "version"){
            currentVersion = metas[meta].content;            
        }

        if(metas[meta].name == "role"){
            currentRole = metas[meta].content;            
        }

        if(metas[meta].name == "product"){
            publicationTitle = metas[meta].content;
        }
    }
}


var publicationListArray = [
    {name:"Sitecore Experience Platform", role:"users", versions:"9.3, 9.2, 9.1, 9.0, 8.2, 8.1", compatibleVersions:"9.3, 9.2, 9.1, 9.0, 8.2, 8.1", oldVersion:"true", link:"/users/"},                                                     //6 
    {name:"Email Experience Manager", role:"users", versions:"9.3, 9.2, 9.1, 9.0, 3.5, 3.4", compatibleVersions:"9.3, 9.2, 9.1, 9.0, 8.2, 8.2", oldVersion:"true", link:"/users/exm/"},                                                     //6    
    {name:"Sitecore Commerce", role:"users", versions:"8.2, 8.1", compatibleVersions:"8.2, 8.1", oldVersion:"true", link:"/users/"},                                                                                                        //2     
    {name:"Sitecore Experience Commerce", role:"users", versions:"9.3, 9.2, 9.1, 9.0", compatibleVersions:"9.3, 9.2, 9.1, 9.0", oldVersion:"true", link:"/users/"},                                                                         //4
    {name:"Print Experience Manager", role:"users", versions:"1.1", compatibleVersions:"9.2|9.1|9.0|8.2|8.1", oldVersion:"false", link:"/users/"},                                                                                          //1
    {name:"Sitecore Experience Accelerator", role:"users", versions:"9.3, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4", compatibleVersions:"9.3, 9.2, 9.1, 9.0|8.2, 9.0|8.2, 8.2|9.0, 8.2|8.1", oldVersion:"true", link:"/users/sxa/"},                    //7         -------->   26


    {name:"Sitecore Experience Platform", role:"developers", versions:"9.3, 9.2, 9.1, 9.0, 8.2, 8.1", compatibleVersions:"9.3, 9.2, 9.1, 9.0, 8.2, 8.1", oldVersion:"true", link:"/developers/"},                                           //6
    {name:"Print Experience Manager", role:"developers", versions:"1.1", compatibleVersions:"9.2|9.1|9.0|8.2|8.1", oldVersion:"false", link:"/developers/"},                                                                                //1
    {name:"Email Experience Manager", role:"developers", versions:"9.3, 9.2, 9.1, 9.0, 3.5, 3.4", compatibleVersions:"9.3, 9.2, 9.1, 9.0, 8.2, 8.2", oldVersion:"true", link:"/developers/exm/"},                                           //6
    {name:"Sitecore Commerce", role:"developers", versions:"8.2, 8.1", compatibleVersions:"8.2, 8.1", oldVersion:"true", link:"/developers/"},                                                                                              //2
    {name:"Sitecore Experience Commerce", role:"developers", versions:"9.3, 9.2, 9.1, 9.0", compatibleVersions:"9.3, 9.2, 9.1, 9.0", oldVersion:"true", link:"/developers/"},                                                               //4
    {name:"Web Forms for Marketers", role:"developers", versions:"9.0, 8.2, 8.1", compatibleVersions:"9.0, 8.2, 8.1", oldVersion:"true", link:"/developers/"},                                                                              //3
    {name:"Sitecore Experience Manager", role:"developers", versions:"9.3, 9.2, 9.1, 9.0", compatibleVersions:"9.3, 9.2, 9.1, 9.0", oldVersion:"true", link:"/developers/"},                                                                //4
    {name:"Platform Administration and Architecture", role:"developers", versions:"9.3, 9.2, 9.1, 9.0", compatibleVersions:"9.3, 9.2, 9.1, 9.0", oldVersion:"true", link:"/developers/"},                                                   //4
    {name:"Sitecore Azure", role:"developers", versions:"8.1", compatibleVersions:"8.1", oldVersion:"false", link:"/developers/sa/"},                                                                                                       //1
    {name:"Sitecore Experience Accelerator", role:"developers", versions:"9.3, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4", compatibleVersions:"9.3, 9.2, 9.1, 9.0|8.2, 9.0|8.2, 8.2|9.0, 8.2|8.1", oldVersion:"true", link:"/developers/sxa/"},          //7
    {name:"SPEAK", role:"developers", versions:"9.0, 8.0", compatibleVersions:"9.1|9.0, 8.2|8.1", oldVersion:"false", link:"/developers/speak/"},                                                                                           //2    
    {name:"xDB Cloud", role:"developers", versions:"2.0", compatibleVersions:"8.2|8.1", oldVersion:"true", link:"/developers/xdc/"},                                                                                                        //1
    {name:"Managed Cloud", role:"developers", versions:"1.0", compatibleVersions:"9.3|9.2|9.1|9.0|8.2", oldVersion:"false", link:"/developers/mc/"},                                                                                                    //1
    {name:"Sitecore Azure Toolkit", role:"developers", versions:"2.4, 2.3, 2.2, 2.1, 2.0, 1.1", compatibleVersions:"9.3, 9.2, 9.1, 9.1, 9.0|8.2, 8.2", oldVersion:"true", link:"/developers/sat/"},                                         //6
    {name:"Sitecore Connect Software for Salesforce Marketing Cloud", role:"developers", versions:"1.0", compatibleVersions:"9.1|9.0", oldVersion:"false", link:"/developers/salesforce-marketing-cloud/"},                                 //1
    {name:"Data Exchange Framework", role:"developers", versions:"4.0, 3.0, 2.1, 2.0", compatibleVersions:"9.3, 9.2, 9.1, 9.0|8.2|8.1", oldVersion:"true", link:"/developers/def/"},                                                        //4    
    {name:"xDB Data Migration Tool", role:"developers", versions:"4.0, 3.0, 2.1, 2.0", compatibleVersions:"9.3, 9.2, 9.1, 9.0|8.2|8.1", oldVersion:"false", link:"/developers/dmt/"},                                                                 //3
    {name:"Sitecore Connect for Salesforce CRM", role:"developers", versions:"4.0, 3.0, 2.1, 2.0", compatibleVersions:"9.3, 9.2, 9.1, 9.0|8.2|8.1", oldVersion:"true", link:"/developers/salesforce-connect/"},                             //4
    {name:"Sitecore Connect for Microsoft Dynamics 365 for Sales", role:"developers", versions:"4.0, 3.0, 2.1, 2.0", compatibleVersions:"9.3, 9.2, 9.1, 9.0|8.2|8.1", oldVersion:"true", link:"/developers/dynamics-crm-connect/"},         //4         -------->   64       =====>     90
    
];