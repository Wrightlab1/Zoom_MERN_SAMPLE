# Zoom MERN Sample
Use of this sample app is subject to our Terms of Use.

This is a node.js/express server and React front-end for use with the Zoom RESTful API
[Zoom API Dcumentation](https://marketplace.zoom.us/docs/api-reference/introduction)

## Installation
To get started, clone the repo:

`$ git clone linkhere`

## Setup
Once cloned, navigate to the ZOOM_MERN_SAMPLE directory:

`$ cd ZOOM_MERN_SAMPLE`

Install the dependencies

`$ npm install`

Create and environment file to store your API Key and Secret
`touch .env`

Add the following code to the `.env` file, and insert your Zoom JWT App's API Key and Secret found on the App Credentials page in the Zoom App Marketplace:

```
NODE_ENV = should be set to eith "production" OR "development"
PORT =  THe port your server will listen on OR default is 5000

ZOOM_API_KEY = Your Zoom API KEY
ZOOM_API_SECRET = Your Zoom API Secret
ZOOM_USER_TYPE = The type valude for Zoom user creation 1 = basic, 2= licensed
ZOOM_USERCREATE_ACTION = Zoom user creation action should be "custCreate"
ZOOM_DOMAIN = The email address for the created Zoom users will be id@thisDomain

MONGO_URI = Your Mongo connection String

JWT_SECRET = A secret Key used to genereate JWT's to authenticate your users
```

Save and Close `.env`

Start the Server

`npm start`

##Usage

###Making requests
Authentication: After creating a user you will recieve a JWT. You will need to pass this JWT as a Bearer token with each request

##Endpoints
###Users
| Endpoint             |Method | URL                                      | Requires Auth | Zoom Documentation                                                       |
| ---------------------|-------|------------------------------------------|---------------|--------------------------------------------------------------------------|
| Create a User        |POST   |`http://localhost:{PORT}/api/users`       |     False     |(https://marketplace.zoom.us/docs/api-reference/zoom-api/users/usercreate)|
| Delete a User        |DELETE |`http://localhost:{PORT}/api/users/me`    |     True      |(https://marketplace.zoom.us/docs/api-reference/zoom-api/users/userdelete)|
