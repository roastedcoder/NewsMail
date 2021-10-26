



const express = require("express");
const request = require("request");
const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public")); // since express doesn't load all of the html and css

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});



app.post("/", function(req, res) {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let apikey = process.env.SIB_API_KEY; // hidden key(confidential) using dotenv
    
    // auth + setup
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = apikey;

    let apiInstance = new SibApiV3Sdk.ContactsApi();

    let createContact = new SibApiV3Sdk.CreateContact();

    createContact.email = email;
    createContact.listIds = [2];
    createContact.attributes = {firstname, lastname};

    apiInstance.createContact(createContact).then(function(data) {
        // console.log('API called successfully. Returned data: ' + JSON.stringify(data));

        res.sendFile(__dirname + "/success.html");

    }, function(error) {
        let text = JSON.parse(error.response.text);
        if(text.code === "duplicate_parameter") {
            // console.log(text);

            res.sendFile(__dirname + "/used-mail.html");
        }
        else {
            // console.error(error.response);

            res.sendFile(__dirname + "/failure.html");
        }
    });

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("server live at port 3000...");
});