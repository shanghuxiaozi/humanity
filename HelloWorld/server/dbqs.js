var mysql  = require('mysql');  
 
/*var connection = mysql.createConnection({     
  host     : '119.23.13.107',       
  user     : 'root',              
  password : 'ath123456',       
  port: '3306',                   
  database: 'rwmap', 
}); 
 
connection.connect();*/
 
/*var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
var  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
//增
connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }        
 
       console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result);        
       console.log('-----------------------------------------------------------------\n\n');  
});*/
 
/*
 var list = function (whereSql, callback, res) {
   connection.query(whereSql, function (error, results, fields) {
  if (error) throw error;
	  //console.log('The solution is: ', results);
	  callback(results, res);
	});
};
  var insert = function (whereSql, callback, res) {
	   connection.query(whereSql, function (error, results, fields) {
  if (error) throw error;
	  //console.log('The solution is: ', results);
	  callback(results, res);
	});
 };
 var update = function (whereSql, callback, res) {
	  connection.query(whereSql, function (error, results, fields) {
	if (error) throw error;
	  //console.log('The solution is: ', results);
	  callback(results, res);
	});
 };
 var deleteById = function (whereSql, callback, res) {
	  connection.query(whereSql, function (error, results, fields) {
  if (error) throw error;
	  //console.log('The solution is: ', results);
	  callback(results, res);
	});
 };
 var initDbHelper = function (whereSql, callback, res) {
 };
  var queryBySql = function (whereSql, callback, res) {
	   connection.query(whereSql, function (error, results, fields) {
  if (error) throw error;
	  //console.log('The solution is: ', results);
	  callback(results, res);
	});
 };
 */
 
//connection.end();

/*---------------------------------------------------用连接池来进行数据库操作----------------------------------------------------------------------*/
var pool  = mysql.createPool({
  host     : '119.23.13.107',       
  user     : 'root',              
  password : 'ath123456',       
  port: '3306',                   
  database: 'rwmap'
});
/*pool.getConnection(function(err, connection) {
  // Use the connection
  connection.query('SELECT something FROM sometable', function (error, results, fields) {
    // And done with the connection.
    connection.release();

    // Handle error after the release.
    if (error) throw error;

    // Don't use the connection here, it has been returned to the pool.
  });
});*/

 var list = function (whereSql, callback, res) {
	// pool.on('connection', function (connection) {
		 pool.query(whereSql, function (error, results, fields) {
			 //connection.release();
			if (error) throw error;
			  //console.log('The solution is: ', results);
			  callback(results, res);
		});
	//});
   
};
  var insert = function (whereSql, callback, res) {
	  //pool.on('connection', function (connection) {
			pool.query(whereSql, function (error, results, fields) {
				//connection.release();
			  if (error) throw error;
				  //console.log('The solution is: ', results);
				  callback(results, res);
				});
		//});
 };
 var update = function (whereSql, callback, res) {
	 // pool.on('connection', function (connection) {
		  pool.query(whereSql, function (error, results, fields) {
			 // connection.release();
			if (error) throw error;
			  //console.log('The solution is: ', results);
			  callback(results, res);
			});
	//});
 };
 var deleteById = function (whereSql, callback, res) {
	// pool.on('connection', function (connection) {
		  pool.query(whereSql, function (error, results, fields) {
			  //connection.release();
		  if (error) throw error;
			  //console.log('The solution is: ', results);
			  callback(results, res);
			});
	//});
 };
 var initDbHelper = function (whereSql, callback, res) {
 };
  var queryBySql = function (whereSql, callback, res) {
	   //pool.on('connection', function (connection) {
			   pool.query(whereSql, function (error, results, fields) {
				  // connection.release();
		  if (error) throw error;
			  //console.log('The solution is: ', results);
			  callback(results, res);
			});
	//});
 };


exports.insert = insert;
exports.list = list;
exports.update = update;
exports.deleteById = deleteById;
exports.initDbHelper = initDbHelper;
exports.queryBySql = queryBySql;
