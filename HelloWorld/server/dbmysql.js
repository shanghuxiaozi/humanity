var edge = require('edge');  
var sqlPath = "Data Source=127.0.0.1;Initial Catalog=test;Persist Security Info=True;User ID=sa;Password=123456;Connect Timeout=180;Pooling=False";  
var helloWorld = edge.func(function () {/* 
 async (input) => { 
 string str = "2017-12-12 12:12:12"; 
 return str.Substring(0, 7); 
 } 
 */});  
  
helloWorld('JavaScript', function (error, result) {  
    if (error) throw error;  
    console.log(result);  
});  
  
//var edge = require('edge');  
  
  
var getInsuranceChannelType = edge.func('sql', {  
    source: function () {/* 
     select top 2 * from [InsuranceChannelType] 
     */},  
    connectionString: sqlPath  
});  
getInsuranceChannelType(null, function (error, result) {  
    if (error) throw error;  
    console.log(result);  
    //console.log(result[0].ProductName);  
    //console.log(result[1].ReorderLevel);  
});  
/*exports.findById = function (req, res, next) { 
    getEmployeeById({ Id: req.params.id }, function (error, data) { 
        if (error) { 
            console.log(error); 
            res.send(error.message); 
        } 
        if (data) { 
            res.send(data); 
        } 
        else { 
            var noData = []; 
            res.send(noData); 
        } 
    }); 
}*/  
var getTop10Products = edge.func('sql', {  
    source: function () {/* 
     select top 1 * from [InsuranceCompany] 
     */  
    },  
    connectionString: sqlPath  
});  
getTop10Products(null, function (error, result) {  
    if (error) throw error;  
    console.log(result);  
   //console.log(result[0].ProductName);  
   // console.log(result[1].ReorderLevel);  
});  
