/**
 * Created by zz on 2017/6/6.
 */
var express = require('express');
var router = express.Router();
var methods=require("../public/js/method");
var MongoClient=require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/cenmes';
function mongoQuery(collection,whereJson,limit,skip) {
    return new Promise(function (resolve,reject) {
        MongoClient.connect(DB_CONN_STR,function (error,db) {
            if(error){
                reject("数据库连接出错")
            }else {
                db.collection(collection).find(whereJson).toArray(function (error,rows) {
                    if(error){
                        reject("查询数据出错");
                    }else {
                        resolve(rows);
                        db.close();
                    }
                })
            }
        })
    })
}
router.all('/',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.json({
        success:true
    })
});
router.all('/user/save',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    var params=methods.getParams(req);
    let name=params.name;
    let age=params.age;
    MongoClient.connect(DB_CONN_STR,function (error,db) {
        let collection=db.collection("user");
        collection.update({name:name},{$set:{age:age}},function (error,result) {
            res.json({result:result});
        })
    })
});
router.all('/user/userInfo',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    var params=methods.getParams(req);
    let name=params.name||"";
    let age=parseInt(params.age||"");
    mongoQuery("user",{}).then(function (rows) {
        let addressArr=[];
        rows.forEach(function (item) {
            addressArr.push(mongoQuery("address",{_id:item.address}))
        });
         Promise.all(addressArr).then(function (...args) {
            let arr=args[0];
            rows.forEach(function (item,index) {
                item.address=arr[index][0].address;
            });
            res.json({
                data:rows
            })
        })
    }).catch(function (error) {
        res.json({
            error:true,
            errorMsg:error,
        })
    })
});
router.all('/user/list',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    MongoClient.connect(DB_CONN_STR,function (error,db) {
        let collection=db.collection("user");
        collection.find().toArray(function (error,row) {
            res.json({
                success:true,
                data:row
            })
        })
    })
});
module.exports=router;