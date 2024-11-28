import { expect } from 'chai';
import { isValidPassword } from './Validpassword.mjs';

describe('Password Validator', () => {
    it('should return false for a password with no letters', () => {
        expect(isValidPassword('123456')).to.be.false;
    });

    it('should return false for a password with no capital letters', () => {
        expect(isValidPassword('password123')).to.be.false;
    });

    it('should return false for a password with no numbers', () => {
        expect(isValidPassword('Password')).to.be.false;
    });

    it('should return true for a valid password', () => {
        expect(isValidPassword('Password123')).to.be.true;
    });

    it('should return false for a password that is not a string', () => {
        expect(isValidPassword(123456)).to.be.false;
    });

    it('should return false for an empty string', () => {
        expect(isValidPassword('')).to.be.false;
    });
});