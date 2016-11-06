const koa = require('koa');
const app = koa();
const serve = require('koa-better-static');
const nunjucks = require('koa-nunjucks-render');
const Router = require ('koa-router');


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

var paths = {
  '/': 'index'
};

Object.keys(paths).forEach(function(path) {
  router.get(path, function*() {
    yield this.render(paths[path]);
  });
});

app.use(router.routes());


app.use(function*() {

  this.status = 404;
  this.body = 'Page not found';

});


let port = process.env.PORT || 3000;

app.listen(port);
console.log('Listening to port ',port);