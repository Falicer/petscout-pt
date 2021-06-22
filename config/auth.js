module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        //collect requested url to send user back after login
        req.session.returnTo = req.originalUrl;

        // Generate Flash Message and direct to login page if user not logged in
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login')
    }
}