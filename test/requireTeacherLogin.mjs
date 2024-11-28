export function requireTeacherLogin(req, res, next) {
    if (req.session.teacher) {
      next();
    } else {
      res.redirect('/teacher-login');
    }
  }