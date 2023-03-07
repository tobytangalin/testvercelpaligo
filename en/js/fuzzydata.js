$(document).ready(function () {indexDict['en'] = [{ "title" : "Managing XM Cloud client credentials ", 
"url" : "index-en.html", 
"breadcrumbs" : "Managing XM Cloud client credentials ", 
"snippet" : "Describes how to manage client credentials in XM Cloud Deploy. If you want your application to access XM Cloud APIs, you must issue client credentials for your app. XM Cloud uses the Client Credentials Flow to authenticate and authorize continuous integration (CI) and continuous deployment (CD) pipe...", 
"body" : "Describes how to manage client credentials in XM Cloud Deploy. If you want your application to access XM Cloud APIs, you must issue client credentials for your app. XM Cloud uses the Client Credentials Flow to authenticate and authorize continuous integration (CI) and continuous deployment (CD) pipelines, custom tools, integrations, and other back-end services. When you create credentials, the Deploy App creates a client ID and a client secret for your app. The client ID and client secret are essentially equivalent to a username and password. From the Deploy App, you can create and manage the client credentials of your organization and its environments. How it works: Create credentials for your app. Use the credentials (client ID + client secret) to authenticate your app with the Auth0 Authorization Server https:\/\/auth.sitecorecloud.io\/oauth\/token and receive an access token. When you call the XM Cloud API, pass the access token as a Bearer token in the Authorization header of your HTTP request. You can create the following types of credentials: Client credentials type Description Available APIs Organization automation client Grants access to the XM Cloud Deploy API and the CM instance APIs of all environments in an organization. XM Cloud Deploy APISitecore Authoring and Management GraphQL APIEnvironment automation client Grants access to the CM instance APIs of a specific environment. Sitecore Authoring and Management GraphQL APIEdge administration client Grants access to the Experience Edge APIs of a specific environment. Experience Edge APIs You can also revoke an XM Cloud authentication client . " }
]
$(document).trigger('search.ready');
});