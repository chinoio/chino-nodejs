# Chino.io Node JS client
[![Build Status](https://travis-ci.org/chinoio/chino-nodejs.svg?branch=master)](https://travis-ci.org/chinoio/chino-nodejs) [![codecov](https://codecov.io/gh/danibix95/chino-nodejs/branch/master/graph/badge.svg)](https://codecov.io/gh/danibix95/chino-nodejs)

*Official* Node JS wrapper for [Chino.io](https://chino.io) APIs.

At the following links can be found:
- [Chino APIs documentation](https://docs.chino.io)
- [SDK documentation][1]

## Requirements
Before you can use Chino Node JS SDK you have to install Node JS Javascript runtime. If you haven't it yet, you can follow the [instructions](https://nodejs.org/en/download/package-manager/) provided on Node JS website.

## Installation
To install Chino SDK in your Node JS project you can run the following command

    npm install --save chinoio
    
The above command will download Chino SDK in your `node_modules` directory and will add the dependency in your `package.json file`.

## Test the SDK
Once requirements are satisfied you can test the SDK. In order to complete this task you have to follow these steps:

Clone this repository with the following command:
    
    git clone https://github.com/danibix95/chino-nodejs.git

Then go inside repository folder:
   
    cd chino-nodejs
And install project dependencies:

    npm install
After the install process, open `/test/testSettings.js` file and insert base url for calls (e.g. the one for testing if you have a free plan), your Chino customer id and customer key:

    Inside file /test/testSettings.js
    
    ...
    module.exports.baseUrl = "https://api.test.chino.io/v1";
    module.exports.customerId  = "your-Chino-Customer-ID";
    module.exports.customerKey = "your-Chino-Customer-KEY";
    ...
    
Now the project is ready to be tested. Run the following command to test it:

    npm test

## SDK Usage
### First steps
After you have installed the SDK you can import it in your project and create the main object:

    const Chino = require("chino-sdk");     // before working, SDK have to publish
                                            // on NPM and installed locally
    
    const chinoClient = new Chino("base-url", "chino-id", "chino-key");

Parameters used for construct a Chino object are:
- `base-url`  
    the url at which the client will makes requests  
    e.g.    https://api.test.chino.io/v1  
    **Please**, *notice that there is no slash at end of the URL.*
- `chino-id`  
    the Chino customer id that you own
- `chino-key`  
    one of the Chino customer key associated with your account

**Note:** creating a client in this way is meant for development or for *authentication* purpose, since this grant to client no restriction on call permissions.
    
Now we have a client object. Let's us make a call to Chino APIs. For example we create a repository on Chino, using as parameter the right object (according to Chino API docs):

    const data = {
        description: "This is a test repository"
    }
 
    chinoClient.repositories.create(data);

### Set Chino credentials for application user
OK, we created a Chino client for a developer. Now we will follow these basic steps to set up a client for an application user. This client will be limited by user Chino permissions (see docs for further information on permissions).
 
First of all we need to create a Chino Application and set its credentials (application id and application secret). These properties are kept private for security reasons.
 
    const appData = {
        grant_type: "password",
        name: "Application test"
    }
    
    chinoClient.applications.create(appData)
        .then((app) => {
            // enable chino client to authenticate application users 
            chinoClient.setAuth(app.app_id, app.app_secret);
        })
        .catch((error) => {
            // manage request error
            console.log(error);
        });
 
Then you can authenticate a user and retrieve an access token, that will be used later for accessing Chino API (*Attention*: the access token has an expiration, see docs for managing it).
      
     let token = "";
     
     chinoClient.auth.login(username, password)
        .then((auth) => {
            token = auth.access_token;
        })
        
Now that we have a token, we can create a client for an application user:
  
    const userClient = new Chino("base-url", token);
    
This time, Chino constructor parameters are:
- `base-url`  
    see above for description
- `token`
    this is the user access token we retrieved before. It is used to identify user calls.

In the end we can try to make a call as user application:
    
    userClient.users.current()
        .then((user) => {
            // show current user details
            console.log(user);
        }
        .catch((error) => {
            // manage request error
        }
        
### Notes
 Since requesting to REST service could require some time, each call is made asynchronously. As a result, each function return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object that will be resolved if client receive a 200 (`OK`) status code as response from server, otherwise it will be rejected.
 
 Moreover, if you have to make sequential calls, you have to chain returned promises from each call.

### Examples
For further information view [SDK docs][1]. You can view an example of application in the [`example`](https://github.com/chinoio/chino-nodejs/tree/example) branch.

## License

MIT

[1]: https://chinoio.github.io/chino-nodejs/