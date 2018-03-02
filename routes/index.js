var router = require('koa-router')();
router.get('/*', function*() {
  // try {
    var path = this.request.path;
    if (path === '/' || path === '/index') {
      yield require('./login').get;
    } else {
      if (path !== undefined) {
        console.log(path)
        yield require('.' + path).get;
      }
    }
  // } catch (e) {
  //   console.log(e);
  // }

})
router.post('/*', function*() {
  // try {
    var path = this.request.path;
    console.log(this.request.method, path);
    yield require('.' + path).post;
  // } catch (e) {
  //   console.log(e);
  // }

})

module.exports = router;