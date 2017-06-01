var express = require('express');
var router = express.Router();
var db=require('mysql');
function doQuery(sql,values,callback) {
    let connect=db.createConnection({
        host: 'localhost',
        port:"3306",
        user: 'root',
        password: 'root',
        database:'mydb'
    });
    connect.connect();
    connect.query(sql,values,function (error,rows) {
      callback(error,rows);
      connect.end();
    });
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// async function getUserInfoByName(res,req) {
//     let params=getParams(req);
//     let id=await query("select id from user where username=?",[params.username]);
//     let userInfo=await query("select name,email,sex,tel from userInfo where id=?",[id]);
//     res.end({
//         data:userInfo
//     });
// }
function query(sql,values=[]) {
    let connect=db.createConnection({
        host: 'localhost',
        port:"3306",
        user: 'root',
        password: 'root',
        database:'mydb'
    });
    connect.connect();
    return new Promise(function (resolve,reject) {
        connect.query(sql,values,function (error,rows) {
            if(error){
                reject(error)
            }else {
                resolve(rows);
            }
        })
    })
}
function getParams(req) {
    if(req.method==="GET"){
        return req.query;
    }else if (req.method==="POST"){
        return req.body
    }
}
router.all('/getTables',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    let params=getParams(req);
    query("SELECT table_name FROM information_schema.`TABLES` WHERE TABLE_SCHEMA='mydb'").then(function (rows) {
        res.json({
            success:true,
            data:rows
        })
    }).catch(function (error) {
        res.json({"error":true});
    });
});
router.all('/getTableData',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    let params=getParams(req);
    let tn=params.tableName;
    query("select * from "+tn).then(function (rows) {
        let columns=[];
        for(let key in rows[0]){
            columns.push(key);
        }
        res.json({
            data:{
                columns:columns,
                rows:rows,
            },
            success:"true"
        })
    }).catch(function (error) {
        res.json({"error":true});
    });
});
router.all('/userInfo',function (req,res,next) {
    // getUserInfoByName(res,req);
    let params=getParams(req);
    if(!params.username){
        res.json({"error":true,'errorMsg':"参数username必填"});
        return;
    }
    query('select id from user where username=?',[params.username]).then(function (rows) {
        return query("select name,email,sex,tel from userInfo where id=?",[rows[0].id]);
    }).then(function (rows) {
        res.json({
            "success":true,
            "userInfo":rows
        });
    }).catch(function (error) {
        res.json({"error":true});
    });
});
router.all('/menu',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.json({
        "url":req.url,
        "query":req.query,
        "cookies":req.cookies,
        "hostname":req.hostname,
        "baseUrl":req.baseUrl,
        "app":req.app,
        "ip":req.ip,
        "ips":req.ips,
        "originalUrl":req.originalUrl,
        "params":req.params,
        "path":req.path,
        "protocol":req.protocol,
        "route":req.route,
        "secure":req.secure,
        "stale":req.stale,
        "subdomains":req.subdomains,
        "xhr":req.xhr,
        "method":req.method
    });
});
router.all('/test',function (req,res,next) {
    res.json({
        data:req.body
    })
});
module.exports = router;
