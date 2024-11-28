import { expect } from 'chai';
import { isAlphanumeric } from './isAlphanumeric.mjs'

describe('isAlphanumeric', () => {

    it('should return true for alphanumeric input', () => {
        expect(isAlphanumeric('abc123')).to.be.true; //return true since only letters and numbers are in
    });

    it('should return false for input containing special characters', () => {
        expect(isAlphanumeric('abc123!')).to.be.false;//return false because there is an exclamation marks
    });

    it('should return true for input containing spaces', () => {
        expect(isAlphanumeric('abc 123')).to.be.true;//return true since space is valid
    });

    it('should return false for an empty string', () => {
        expect(isAlphanumeric('')).to.be.false; // return false because inputs is empty
    });

    it('should return true for uppercase alphanumeric input', () => {
        expect(isAlphanumeric('ABC123')).to.be.true; // Capitals letter are also valid
    });

    it('should return true for input with only spaces', () => {
        expect(isAlphanumeric('   ')).to.be.true;// use case to check if space would return true as intended
    });
});