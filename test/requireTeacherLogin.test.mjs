import { expect } from 'chai';
import sinon from 'sinon';
import { requireTeacherLogin } from './requireTeacherLogin.mjs';

describe('requireTeacherLogin', () => {
  it('should call next() if req.session.teacher is defined', () => {
    // Mock objects
    const req = { session: { teacher: true } };
    const res = {};
    const next = sinon.spy();

    requireTeacherLogin(req, res, next);

    // Assertions
    expect(next.calledOnce).to.be.true;
  });

  it('should redirect to /teacher-login if req.session.teacher is undefined', () => {
    // Mock objects
    const req = { session: {} };
    const res = { redirect: sinon.spy() };
    const next = sinon.spy();

    requireTeacherLogin(req, res, next);

    // Assertions
    expect(res.redirect.calledOnce).to.be.true;
    expect(res.redirect.calledWith('/teacher-login')).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});