var inquirer = require('inquirer');
var fuzzy = require('fuzzy');
var Promise = require('promise');

var mysql = require('mysql');
var tbFieldsJson = {}, tbFields = [], PREFIX = '';
var tbNameList = []

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
function searchTables(answers, input) {
  input = input || '';
  //console.log('answers', answers);
  return new Promise(function (resolve) {

    getTbNameList(answers.host, answers.dbName)

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

  {
    type: 'input', name: 'dbName', validate: validRequired,
    message: "数据库名称?",},
  {
    type: 'autocomplete',
    name: 'tbName',
    message: '选择一个表',
    source: searchTables
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

  getFieldsFromMysql(answers.host, answers.dbName, answers.tbName, function () {
    console.log("tbFieldsJson", tbFieldsJson);
    
  })
});

/* getFieldsFromMysql(tbName, () => {
  console.log(tbFieldsJson);
}) */

function getTbNameList(host,dbName) {
  if (tbNameList.length == 0) {
    var connection = mysql.createConnection({
      host: host,
      user: 'root',
      password: 'root',
      database: dbName
    });

    //select SCHEMA_NAME from information_schema.SCHEMATA //获取所有的schema 数据库
    let sql = "select table_name from information_schema.TABLES where TABLE_SCHEMA='"+dbName+"'"

    connection.query(sql, function (error, results, fields) {
      //console.log('results', results);
      results.forEach(el => {
        tbNameList.push(el.table_name)
      });
      //console.log('table_name' , tbNameList);
      
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
      var ftitle = arr[0], ftype = 'text', flist = false
      if (arr[1]) ftype = arr[1]  //类型
      if (arr[2]) flist = arr[2].indexOf('i') > -1 ? true : false  //表格中列表 
      tbFields.push({
        fname: e.Field, ftitle: ftitle, ftype: ftype, fdatatype: e.Type, fdefault: e.Default, flist: flist
      })
      tbFieldsJson[e.Field] = ftitle
    });
    //console.log(tbFields);
    if (cb) cb()
  });
  connection.end();
}