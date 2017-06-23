var express = require('express');
var router = express.Router();
var fs=require("fs");
var util=require("util");
var text=fs.readFileSync("config/test.txt");
router.all("/test",function (req,res,next) {
   res.json({
       query:req.query
   })
});
router.all('/index',function (req,res,next) {
    if(req.query.username){
        next();
    }else {
        res.json({error:true,errorMsg:"没有用户信息"});
    }
});
router.get("/index",function (req,res,next) {
   res.render("index",{title:"index",username:req.query.username});
});
module.exports = router;
