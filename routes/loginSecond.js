
exports.get = function* () {
    //var tab = this.query.tab;
    //var p = this.query.p || 1;
    var login = []
    var wallet = this.session.zxwallet || "0123";
    console.log("wallet value is ++++++"+wallet);
    if (wallet == "0123") {
        console.log("wallet sel value is ++++++0000");
        console.log("login value is "+String(login));
        yield this.render('loginSecond', {login: login});
    }
};