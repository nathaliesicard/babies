const koa = require('koa');
const app = koa();
const serve = require('koa-better-static');
const nunjucks = require('koa-nunjucks-render');
const Router = require ('koa-router');
const db = require('./db/util');

// logger

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(serve('public'));

app.use(nunjucks('views', {
  ext: '.html',
  noCache: true
}));


var router = new Router();

router.get('/', function*(){

  let categories = yield db.query(
    'SELECT * FROM categories'
  );
  console.log(categories);

  yield this.render('index',{
    categories: categories.rows
  })
});


app.use(router.routes());


app.use(function*() {

  this.status = 404;
  this.body = 'Page not found';

});


let port = process.env.PORT || 3000;

app.listen(port);
console.log('Listening to port ',port);