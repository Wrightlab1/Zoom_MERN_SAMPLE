const { response } = require('express')
const mongoose = require('mongoose')
const https = require('https')
const jwt = require('jsonwebtoken')
require('dotenv').config()




module.exports = {
  make_API_call : function(path,method,data) {
    
    console.log(`${method} request sent to https://api.zoom.us/v2${path}`.yellow)
    
    //Create JWT
    const payload = {
      iss: process.env.ZOOM_API_KEY,
      exp: ((new Date()).getTime() + 5000)
  };
    
    const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);
    console.log(`jwt : ${token}`.yellow)

//SEND REQUEST
  
//Configure request options
const options = {
  host: 'api.zoom.us',
  path: `/v2${path}`,
  method: `${method}`,
  headers: {
    'Content-Type': 'application/json',
     'authorization' : `Bearer ${token}`
  }

}
//send Request
return new Promise(function (resolve, reject) {
  const req = https.request(options, res => {
    // reject on bad status
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return reject(new Error('statusCode=' + res.statusCode));
  }
   

  // cumulate data
  let body = [];
  res.on('data', function(chunk) {
      body.push(chunk);
  });
  


  // resolve on end
  res.on('end', function() {
      try {
          if(res.statusCode != 204) {
          body = JSON.parse(Buffer.concat(body).toString());
          }
          
        
      } catch(e) {
          reject(e);
      }
      resolve(body);
  });
});
// reject on request error
req.on('error', function(err) {
  // This is not a "Second reject", just a different sort of failure
  reject(err);
});

//If Body is defined add body to request
if (data) {
  console.log(JSON.stringify(data))
  const postData = JSON.stringify(data);
  req.write(postData);
}


// IMPORTANT

req.end();

})}}