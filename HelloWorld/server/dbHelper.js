/**
 * Created by Administrator on 2015/9/14.
 */
var node_mssql = require('node-mssql');

/* add configuration to query object */
var host = '119.23.13.107',
    port = 3306,
    username = 'root',
    password = 'ath123456',
    db = 'rwmap';

var queryObj = new node_mssql.Query({
    host: host,
    port: port,
    username: username,
    password: password,
    db: db
});

var initDbHelper = function (host, port, username, password, db) {
    queryObj = new node_mssql.Query({
        host: host,
        port: port,
        username: username,
        password: password,
        db: db
    });
}

var defaultConfig = function () {
    queryObj = new node_mssql.Query({
        host: host,
        port: port,
        username: username,
        password: password,
        db: db
    });
}

var insert = function (data, insertTable, callback, res) {
    queryObj.table(insertTable);
    queryObj.data(data);
    queryObj.insert(function (results) {
        //success
        callback(res, "添加成功！", results);
    }, function (err, sql) {
        if (err) {//error
            callback(res, "添加失败！", err);
            console.log(err);
        }
    });
    defaultConfig();
};

var list = function (whereSql,orderList, table, callback, res) {
    queryObj.table(table);
    queryObj.where(whereSql);
    queryObj.order(orderList);  // ['id desc',...]
    console.log('----------------------');
    queryObj.select(function (data) {
        //success
        callback(res, "查询成功!", data);
    }, function (err, sql) {
        if (err) { //error
            callback(res, "查询失败!", err);
            console.log(err);
        }
    });
    defaultConfig();
};

var update = function (data, option, upTable, callback, res) {
    queryObj.table(upTable);
    queryObj.data(data);
    queryObj.where(option);
    queryObj.update(function (results) {
        //  success callback
        callback(res, "修改成功！", results);
    }, function (err, sql) {
        if (err) {
            callback(res, "修改失败！", err);
            console.log(err);
        }
    });
    defaultConfig();
};

//参数说明：@delsql删除sql条件，举例 delsql="id=1"
var deleteById = function (delsql, table, callback, res) {
    queryObj.query("delete from " + table + " where " + delsql,
        function (delres) {
            callback(res, "删除成功!", delres);
        },
        function (err, sql) {
            if (err) {
                callback(res, "删除失败!", err);
            }
        }
    );
    defaultConfig();
};

var queryBySql = function (sql, callback, res) {
    queryObj.query(sql, function (delres) {
            callback(res, "执行成功!", delres);
        },
        function (err, sql) {
            if (err) {
                callback(res, "执行失败!", err);
            }
        }
    );
    defaultConfig();
}

exports.insert = insert;
exports.list = list;
exports.update = update;
exports.deleteById = deleteById;
exports.initDbHelper = initDbHelper;
exports.queryBySql = queryBySql;
