function ensureAuth(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/Musicfy/login');
}
module.exports = ensureAuth;