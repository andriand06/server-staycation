const isLogin = (req, res, next) => {
  /**
   * cek session user kalau tidak ada alert
   * kalau ada next() -> next action di router admin.js
   * yaitu router.get("/dashboard")
   */
  if (req.session.user == null || req.session.user == undefined) {
    req.flash("alertMessage", `Session telah habis, silahkan sign in kembali!`);
    req.flash("alertStatus", "danger");
    res.redirect("/admin/signin");
  } else {
    next();
  }
};

module.exports = isLogin;
