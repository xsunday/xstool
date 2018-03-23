#!/usr/bin/env node

//console.log('xstool');
var path = require("path")

var program = require('commander');

var version = require('./package.json').version
//let argArr = process.argv;

program
  .version(version)
  .option('-t, --type [value]', '类型: mysql')
  .parse(process.argv);

//console.log(program.type);
//console.log(program);
//console.log('program.args',program.args.length==0);
if (program.args.length==0){program.help();}

if (program.args[0]=='mysql'){
  require('./model/mysql.js')
}
