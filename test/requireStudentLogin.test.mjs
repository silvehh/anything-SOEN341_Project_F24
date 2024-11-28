import { expect } from 'chai';
import sinon from 'sinon';
import { requireStudentLogin } from './requireStudentLogin.mjs';

describe('requireStudentLogin', () => {
  it('should call next() if req.session.student is defined', () => {
    // Mock objects
    const req = { session: { student: true } };
    const res = {};
    const next = sinon.spy();

    requireStudentLogin(req, res, next);

    // Assertions
    expect(next.calledOnce).to.be.true;
  });

  it('should redirect to /student-login if req.session.student is undefined', () => {
    // Mock objects
    const req = { session: {} };
    const res = { redirect: sinon.spy() };
    const next = sinon.spy();

    requireStudentLogin(req, res, next);

    // Assertions
    expect(res.redirect.calledOnce).to.be.true;
    expect(res.redirect.calledWith('/student-login')).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});
