

module.exports = {
  isLoggedIn (req,res,next) {
    if(!req.session.userId) {
      req.flash("messageError", "You need to be logged in to do that");
      return res.redirect("/signin");
    }
    next();
  }
}