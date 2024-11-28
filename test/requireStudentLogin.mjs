export function requireStudentLogin(req, res, next) {
    if (req.session.student) {
      next();
    } else {
      res.redirect('/student-login');
    }
  }