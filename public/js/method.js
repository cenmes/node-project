/**
 * Created by zz on 2017/6/6.
 */
var db=require('mysql');
function query(sql,values=[]) {
    let connect=db.createConnection({
        host: 'localhost',
        port:"3306",
        user: 'root',
        password: 'root',
        database:'interfacesystem'
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
let m={
    query:query,
    getParams:getParams
};
module.exports=m;