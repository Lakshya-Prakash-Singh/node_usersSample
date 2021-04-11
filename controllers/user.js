const fs = require('fs');
const globals = require("../globals.json");
const globalsFunction = require("../globalFunc");
var md5 = require('md5');
const { check, validationResult } = require('express-validator'); 
const { json } = require('body-parser');
const mongodb = require('mongodb');
const multer = require('multer');


module.exports = {
    
    registration: async (req, res, next) => {
        try {            
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) { 
                globalsFunction.logValidationErrors(validationError);
                res.json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            } 
            else {

                globals._dbs.collection("Users").find({Email: req.body.Email}).toArray(function(err, result) {
                    if (err) throw err;
                    if (result.length > 0) {
                        globalsFunction.logValidationErrors("User Email Already Exists!");
                        res.json({status: globals.responses.errorStatus, message: "User Email Already Exists!", data: globals.commonBlankData});
                        return false;
                    }
                    else {                            
                        globals._dbs.collection("Users").find({PhoneNumber: req.body.PhoneNumber}).toArray(function(err, result2) {
                            if (err) throw err;
                            if (result2.length > 0) {
                                globalsFunction.logValidationErrors("User Phone Number Already Exists!");
                                res.json({status: globals.responses.errorStatus, message: "User Phone Number Already Exists!", data: globals.commonBlankData});
                                return false;
                            }
                            else {
                                // debugger;
                                // return res.send(req.files);
                                otp = Math.floor(100000 + Math.random() * 900000);
                                isDataAddCalled = false;
                                for (i = 0;i < req.files?.length;i++) {
                                    if (req.files[i].fieldname == "ProfilePic") {
                                        if (req.files[i].size > 6000000) {                        
                                            globals._dbs.collection("Users").insertOne({FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email, PhoneNumber: req.body.PhoneNumber, Password: md5(req.body.Password), ProfilePic: '', OTP: otp, IsUserVerified: false }, function(err, result3) {  
                                                isDataAddCalled = true;
                                                if (err) throw err;  
                                                if (result3.insertedCount) {
                                                    console.log(result3);
                                                    res.json({status: globals.responses.successStatus, message: "User Created Without Image Upload!", data: res.ops});
                                                    return false;
                                                }
                                                else {
                                                    globalsFunction.logErrors(err);
                                                    res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                    return false;
                                                }
                                            }); 
                                        }
                                        else {
                                            var fileName = req.files[i].fieldname + "_" + Date.now() + "_" + req.files[i].originalname
                                            fs.writeFile('./assets/images/ProfilePic/' + fileName, req.files[i].buffer, (err) => {
                                                if (err) {
                                                    globalsFunction.logErrors(err);                        
                                                    globals._dbs.collection("Users").insertOne({FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email, PhoneNumber: req.body.PhoneNumber, Password: md5(req.body.Password), ProfilePic: '', OTP: otp, IsUserVerified: false }, function(err, result3) {  
                                                        isDataAddCalled = true;
                                                        if (err) throw err;  
                                                        if (result3.insertedCount) {
                                                            console.log(result3);
                                                            res.json({status: globals.responses.successStatus, message: "User Created Without Image Upload!", data: res.ops});
                                                            return false;
                                                        }
                                                        else {
                                                            globalsFunction.logErrors(err);
                                                            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                            return false;
                                                        }
                                                    }); 
                                                }  
                                                else   {                            
                                                    globals._dbs.collection("Users").insertOne({FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email, PhoneNumber: req.body.PhoneNumber, Password: md5(req.body.Password), ProfilePic: '/images/ProfilePic/' + fileName, OTP: otp }, function(err, result3) {  
                                                        isDataAddCalled = true;
                                                        if (err) throw err;  
                                                        if (result3.insertedCount) {
                                                            console.log(fileName);
                                                            res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result3.ops});
                                                            return false;
                                                        }
                                                        else {
                                                            globalsFunction.logErrors(err);
                                                            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                            return false;
                                                        }
                                                    }); 
                                                } 
                                            });
                                        }
                                        break;
                                    }
                                }

                                if (!isDataAddCalled) {
                                    globals._dbs.collection("Users").insertOne({FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email, PhoneNumber: req.body.PhoneNumber, Password: md5(req.body.Password), ProfilePic: '', OTP: otp, IsUserVerified: false }, function(err, result3) {  
                                        isDataAddCalled = true;
                                        if (err) throw err;  
                                        if (result3.insertedCount) {
                                            console.log(result3);
                                            res.json({status: globals.responses.successStatus, message: "User Created Without Image Upload!", data: res.ops});
                                            return false;
                                        }
                                        else {
                                            globalsFunction.logErrors(err);
                                            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                        }
                                    }); 
                                }
                            }
                        });
                    }   
                });

            }
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    
    adduser: async (req, res, next) => {
        try {            
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) { 
                globalsFunction.logValidationErrors(validationError);
                res.json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            } 
            else {

                globals._dbs.collection("Users").find({Email: req.body.Email}).toArray(function(err, result) {
                    if (err) throw err;
                    if (result.length > 0) {
                        globalsFunction.logValidationErrors("User Email Already Exists!");
                        res.json({status: globals.responses.errorStatus, message: "User Email Already Exists!", data: globals.commonBlankData});
                        return false;
                    }
                    else {                            
                        globals._dbs.collection("Users").find({PhoneNumber: req.body.PhoneNumber}).toArray(function(err, result2) {
                            if (err) throw err;
                            if (result2.length > 0) {
                                globalsFunction.logValidationErrors("User Phone Number Already Exists!");
                                res.json({status: globals.responses.errorStatus, message: "User Phone Number Already Exists!", data: globals.commonBlankData});
                                return false;
                            }
                            else {
                                var otp = Math.floor(100000 + Math.random() * 900000);
                                let isDataAddCalled = false;
                                for (i = 0;i < req.files?.length;i++) {
                                    if (req.files[i].fieldname == "ProfilePic") {
                                        if (req.files[i].size > 6000000) {                        
                                            globals._dbs.collection("Users").insertOne({FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email, PhoneNumber: req.body.PhoneNumber, Password: "", ProfilePic: '', OTP: otp, IsUserVerified: false }, function(err, result3) {  
                                                isDataAddCalled = true;
                                                if (err) throw err;  
                                                if (result3.insertedCount) {
                                                    console.log(result3);
                                                    res.json({status: globals.responses.successStatus, message: "User Created Without Image Upload!", data: res.ops});
                                                    return false;
                                                }
                                                else {
                                                    globalsFunction.logErrors(err);
                                                    res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                    return false;
                                                }
                                            }); 
                                        }
                                        else {
                                            var fileName = req.files[i].fieldname + "_" + Date.now() + "_" + req.files[i].originalname
                                            fs.writeFile('./assets/images/ProfilePic/' + fileName, req.files[i].buffer, (err) => {
                                                if (err) {
                                                    globalsFunction.logErrors(err);                        
                                                    globals._dbs.collection("Users").insertOne({FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email, PhoneNumber: req.body.PhoneNumber, Password: "", ProfilePic: '', OTP: otp, IsUserVerified: false }, function(err, result3) {  
                                                        isDataAddCalled = true;
                                                        if (err) throw err;  
                                                        if (result3.insertedCount) {
                                                            console.log(result3);
                                                            res.json({status: globals.responses.successStatus, message: "User Created Without Image Upload!", data: res.ops});
                                                            return false;
                                                        }
                                                        else {
                                                            globalsFunction.logErrors(err);
                                                            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                            return false;
                                                        }
                                                    }); 
                                                }  
                                                else   { 
                                                    globals._dbs.collection("Users").insertOne({FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email, PhoneNumber: req.body.PhoneNumber, Password: "", ProfilePic: '/images/ProfilePic/' + fileName, OTP: otp }, function(err, result3) {  
                                                        isDataAddCalled = true;
                                                        if (err) throw err;  
                                                        if (result3.insertedCount) {
                                                            console.log(fileName);
                                                            res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result3.ops});
                                                            return false;
                                                        }
                                                        else {
                                                            globalsFunction.logErrors(err);
                                                            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                            return false;
                                                        }
                                                    }); 
                                                }   
                                            });
                                        }
                                        break;
                                    }
                                    else if (!isDataAddCalled) {                                                         
                                        globals._dbs.collection("Users").insertOne({FirstName: req.body.FirstName, LastName: req.body.LastName, Email: req.body.Email, PhoneNumber: req.body.PhoneNumber, Password: "", ProfilePic: '', OTP: otp, IsUserVerified: false }, function(err, result3) {  
                                            isDataAddCalled = true;
                                            if (err) throw err;  
                                            if (result3.insertedCount) {
                                                console.log(result3);
                                                res.json({status: globals.responses.successStatus, message: "User Created Without Image Upload!", data: res.ops});
                                                return false;
                                            }
                                            else {
                                                globalsFunction.logErrors(err);
                                                res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                return false;
                                            }
                                        });   
                                    }
                                }                               

                            }
                        });
                    }   
                });

            }
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    login: async (req, res) => {
        try {
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) { 
                globalsFunction.logValidationErrors(validationError);
                res.json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            } 
            else {
                console.log(req.body);
                if (req.body.PhoneNumber.length <= 0 && req.body.Email.length <= 0) {
                    globalsFunction.logValidationErrors("PhoneNumber & Email both are null!");
                    res.json({status: globals.responses.errorStatus, message: "PhoneNumber & Email both are null!", data: globals.responses.commonBlankData, errorMessage: "PhoneNumber & Email both are null!"});
                    return false;
                }
                var data;
                if (req.body.PhoneNumber.length > 0) {
                    data = { PhoneNumber: req.body.PhoneNumber, Password: md5(req.body.Password) }
                }        
                else {                    
                    data = { Email: req.body.Email, Password: md5(req.body.Password) }
                }
                globals._dbs.collection("Users").find(data).toArray(function(err, result) {
                    if (err) throw err;
                    if (result.length <= 0) {
                        globalsFunction.logValidationErrors("Invalid Login Credentials!");
                        res.json({status: globals.responses.errorStatus, message: "Invalid Login Credentials!", data: globals.commonBlankData});
                        return false;
                    }
                    else {              
                        res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result});
                        return false;
                    } 
                })
            }
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    userlist: async (req, res) => {
        try {
            globals._dbs.collection("Users").find({}).toArray(function(err, result) {
                if (err) throw err;
                if (result.length <= 0) {
                    globalsFunction.logValidationErrors("Invalid Login Credentials!");
                    res.json({status: globals.responses.errorStatus, message: "Invalid Login Credentials!", data: globals.commonBlankData});
                    return false;
                }
                else {              
                    res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result});
                    return false;
                } 
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    deleteUser:  async (req, res) => {
        try {
            console.log(req.body);
            globals._dbs.collection('Users', function(err, user) {
                user.deleteOne({_id: new mongodb.ObjectID(req.body.ID)});          
                if (err) throw err;        
                res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: globals.commonBlankData});
                return false;
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    user:  async (req, res) => {
        try {            
            globals._dbs.collection("Users").find({_id: new mongodb.ObjectID(req.params.UserID)}).toArray(function(err, result) {
                if (err) throw err;
                if (result.length <= 0) {
                    globalsFunction.logValidationErrors("Invalid user!");
                    res.json({status: globals.responses.errorStatus, message: "Invalid User!", data: globals.commonBlankData});
                    return false;
                }
                else {              
                    res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result});
                    return false;
                } 
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    userUpdate:  async (req, res) => {
        try {
            if (req.files?.length <= 0 || !req.files?.length) {
                globals._dbs.collection("Users", function(err, user) {
                    user.updateOne({_id: new mongodb.ObjectID(req.params.UserID)},{$set: {FirstName: req.body.FirstName, LastName: req.body.LastName }});
                    if (err) throw err;
                    res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: globals.commonBlankData});
                    return false;
                });
            }
            else {
                for (i = 0;i < req.files?.length;i++) {
                    if (req.files[i].fieldname == "ProfilePic" && req.files[i].size < 6000000) {
                        var fileName = req.files[i].fieldname + "_" + Date.now() + "_" + req.files[i].originalname
                        fs.writeFile('./assets/images/ProfilePic/' + fileName, req.files[i].buffer, (err) => {
                            if (err) throw err;
                            globals._dbs.collection("Users", function(err, user) {
                                user.updateOne({_id: new mongodb.ObjectID(req.params.UserID)},{$set: {FirstName: req.body.FirstName, LastName: req.body.LastName, ProfilePic: "/images/ProfilePic/" + fileName }});
                                if (err) throw err;
                                res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: globals.commonBlankData});
                                return false;
                            });
                        });
                    }
                    else if ((i + 1) == req.files?.length) {
                        globals._dbs.collection("Users", function(err, user) {
                            user.updateOne({_id: new mongodb.ObjectID(req.params.UserID)},{$set: {FirstName: req.body.FirstName, LastName: req.body.LastName }});
                            if (err) throw err;
                            res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: globals.commonBlankData});
                            return false;
                        });
                    }
                }   
            };
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    }

}