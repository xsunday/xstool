var ejs = require('ejs');

var data = '<% json.forEach(function(field){ %> 111 <% }); %>'
  + '<% switch (b) { case 2: %>' + 111 + '<% break; }%>'
var html = ejs.render(data.toString(), { json:[{a:1},{a:2}], b: 1 });
console.log(html);

 