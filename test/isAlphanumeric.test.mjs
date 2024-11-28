import { expect } from 'chai';
import { isAlphanumeric } from './isAlphanumeric.mjs'

describe('isAlphanumeric', () => {
    it('should return true for alphanumeric input', () => {
        expect(isAlphanumeric('abc123')).to.be.true;
    });

    it('should return false for input containing special characters', () => {
        expect(isAlphanumeric('abc123!')).to.be.false;
    });

    it('should return true for input containing spaces', () => {
        expect(isAlphanumeric('abc 123')).to.be.true;
    });

    it('should return false for an empty string', () => {
        expect(isAlphanumeric('')).to.be.false;
    });

    it('should return true for uppercase alphanumeric input', () => {
        expect(isAlphanumeric('ABC123')).to.be.true;
    });

    it('should return true for input with only spaces', () => {
        expect(isAlphanumeric('   ')).to.be.true;
    });
});