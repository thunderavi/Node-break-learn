const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const slugify=require('slugify');



const replaceTemplate =require('./modules/replaceTemplate');



// Use readFileSync to read the files synchronously with error handling
const tempOverview = fs.readFileSync(path.join(__dirname, 'templates', 'template-overview.html'), 'utf-8');
const tempCard = fs.readFileSync(path.join(__dirname, 'templates', 'template-card.html'), 'utf-8');
const tempProduct = fs.readFileSync(path.join(__dirname, 'templates', 'template-product.html'), 'utf-8');
const data = fs.readFileSync(path.join(__dirname, 'dev-data', 'data.json'), 'utf-8');
const dataObj = JSON.parse(data);

const slugs =dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);

console.log(slugify('Fresh Avocados',{lower:true}));

const server = http.createServer((req, res) => {
  


  const { query,pathname } = url.parse(req.url, true);  // Use pathname instead of just url

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const cardHtml=dataObj.map(el=>  replaceTemplate(tempCard,el)).join('');
    const output=tempOverview.replace(`{%PRODUCT_CARDS%}`,cardHtml);
    res.end(output);

  // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const product =dataObj[query.id];
    const output=replaceTemplate(tempProduct,product);
    res.end(output);

  // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);

  // Not found
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
