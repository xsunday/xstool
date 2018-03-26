var inquirer = require('inquirer');
var fuzzy = require('fuzzy');
var Promise = require('promise');
var ejs = require('ejs');
var mysql = require('mysql');
var shelljs = require('shelljs');
var fs = require("fs")
var path = require("path")

var tableName, tableNameNoPre, tbFieldsJson = {}, tbFields = [], PREFIX = '';
var dbNameList=[], tbNameList = []

/* program
  .version(version)
  .option('-s, --server', '设置服务器 默认localhost, 远程=r remote 192.168.19.218')
  .option('-d, --database', '设置数据库')
  .option('-p, --prefix', '表前缀')
  .option('-t, --table', '表格')
  .option('-c, --cheese [type]', '返回类型', 'marble')
  .parse(process.argv); */


function validRequired(value) {
  return value != '' ? true : '不为空'
}
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

function searchDatabase(answers, input) {
  input = input || '';
  return new Promise(function (resolve) {
    getDbList(answers.host)
    var fuzzyResult = fuzzy.filter(input, dbNameList);
    resolve(fuzzyResult.map(function (el) {
      return el.original;
    }));
  });
}
function searchTables(answers, input) {
  input = input || '';
  //console.log('answers', answers);
  return new Promise(function (resolve) {

    getDbList(answers.host, answers.dbName)

    var fuzzyResult = fuzzy.filter(input, tbNameList);
    resolve(fuzzyResult.map(function (el) {
      return el.original;
    }));

  });
}
var questions = [

  /* {type: 'confirm', name: 'isLocal', default: true,
    message: '使用本地数据库?否则用192.168.19.218',}, */
  {
    type: 'list', message: '数据库服务器', name: 'host', choices: ['localhost', '192.168.19.218']
    /* choices: [
      { key: '1', name: 'localhost', value: 'localhost' },
      { key: '2', name: '192.168.19.218', value: '192.168.19.218' },
    ], */
  },

  /* {
    type: 'input', name: 'dbName', validate: validRequired,
    message: "数据库名称?",}, */
  {
    type: 'autocomplete',
    name: 'dbName',
    message: '选择一个库',
    source: searchDatabase
  },
  {
    type: 'autocomplete',
    name: 'tbName',
    message: '选择一个表',
    source: searchTables
  },
  {
    type: 'list', name: 'outType',
    message: "输出方式", choices: ['字段列表', 'elementui模板']
  },


  /* {
    type: 'input', name: 'tbPre',
    message: "表前缀", validate: validRequired
  },
  {
    type: 'input', name: 'tbName', validate: validRequired,
    message: "表名称?",}, */
]  
inquirer.prompt(questions).then(answers => {
  //console.log('\nOrder receipt:');
  console.log(JSON.stringify(answers, null, '  '));

  tableName = answers.tbName
  tableNameNoPre = tableName.substr(tableName.indexOf('_')+1)
  getFieldsFromMysql(answers.host, answers.dbName, answers.tbName, function () {
    if (answers.outType == '字段列表') {
      console.log("tbFieldsJson=", JSON.stringify(tbFieldsJson));
    } else if (answers.outType == 'elementui模板') {
      maketemp('elementui')
    }
  })
  //resolve()
});

/* getFieldsFromMysql(tbName, () => {
  console.log(tbFieldsJson);
}) */

function getDbList(host,dbName){
  let isLoad = false
  dbName = dbName || 'information_schema'
  if (dbName == 'information_schema' && dbNameList.length==0 ){
    isLoad = true
  } else if (tbNameList.length == 0){
    isLoad = true
  }
  if (isLoad ) {
    var connection = mysql.createConnection({
      host: host,
      user: 'root',
      password: 'root',
      database: dbName
    });
    let sql
    if (dbName =='information_schema'){
      sql = 'select SCHEMA_NAME from information_schema.SCHEMATA' //获取所有的schema 数据库
    }else{
      sql = "select table_name from information_schema.TABLES where TABLE_SCHEMA='" + dbName + "'"
    }

    connection.query(sql, function (error, results, fields) {
      results.forEach(el => {
        if (dbName == 'information_schema') {
          //dbNameList.push(el.table_name)
          //console.log(results);
          dbNameList.push(el.SCHEMA_NAME)
        }else{
          tbNameList.push(el.table_name)
        }
        
      });
    })
  }
}

function getFieldsFromMysql(host,dbName,tbName, cb) {
  
  var connection = mysql.createConnection({
    host: host, //'localhost',
    user: 'root',
    password: 'root',
    database: dbName
  });
  connection.connect();

  

  connection.query('SHOW FULL COLUMNS FROM ' + PREFIX + tbName, function (error, results, fields) {
    if (error) throw error;

    //console.log('The solution is: ', results);
    results.forEach(e => {
      if (e.Field == 'id') return;
      var c = e.Comment;
      var arr = c.split('=')
      var ftitle = arr[0], ftype = 'text', flist = true, foption =[]
      if (arr[1]) ftype = arr[1]  //类型
      //if (arr[2]) flist = arr[2].indexOf('i') > -1 ? true : false  //表格中列表 
      if (ftype == 'radio' || ftype=='checkbox' || ftype=='select'){
        let foption = arr[2].replace('(', "").replace(')', "").split(',')
      }
      tbFields.push({
        fname: e.Field, ftitle: ftitle, ftype: ftype, fdatatype: e.Type, fdefault: e.Default, flist: flist, foption: foption
      })
      tbFieldsJson[e.Field] = ftitle
    });
    //console.log(tbFields);
    if (cb) cb()
  });
  connection.end();
}

/* getFieldsFromMysql('user', function (rs) {
  //console.log("cb");
  maketemp(1)
}) */
function maketemp(tempName) {
  var sourcePath = path.resolve(__dirname, './template/' + tempName) 
  var destPath = sourcePath + '/temp'

  //var data1 = fs.readFileSync(sourcePath + '/index.ejs'); // 同步读取
  //var data2 = fs.readFileSync(sourcePath + '/box.ejs'); // 同步读取
  var aFile = ['index','box'], data, html, dest =''
  for (let i = 0; i < aFile.length; i++) {
    data = fs.readFileSync(sourcePath + '/'+aFile[i]+'.ejs');
    html = ejs.render(data.toString(), { tableName: tableNameNoPre, tbFields, tbFieldsJsonStr: JSON.stringify(tbFieldsJson).replace('&#34;','"') });
    dest = destPath + '/' + aFile[i]+'.vue'
    fs.writeFileSync(dest, html)
    shelljs.exec('code ' + dest);
  }
}

