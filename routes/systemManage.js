/**
 * Created by zz on 2017/6/6.
 */
var express = require('express');
var router = express.Router();
let method=require("../public/js/method");
router.all('/',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.json({
        success:true
    })
});
router.all('/systemList',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    method.query("select * from system").then(function (rows) {
        res.json({
            success:true,
            data:rows
        })
    }).catch(function (error) {
        res.json({
            error:true,
            errorMsg:error
        })
    })
});
module.exports=router;