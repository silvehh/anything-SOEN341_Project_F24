//import test function and library
import { expect } from 'chai';
import { isAlphanumeric } from './isAlphanumeric.mjs'

describe('isAlphanumeric', () => {

    //Test#1 check if valid none capital inputs return valid
    it('should return true for alphanumeric input', () => {
        expect(isAlphanumeric('abc123')).to.be.true; //return true since only letters and numbers are in
    });

    //Test#2 check if '!' would return false as intended
    it('should return false for input containing special characters', () => {
        expect(isAlphanumeric('abc123!')).to.be.false;//return false because there is an exclamation marks
    });

    //Test#3 this covers the test for space in inputs
    it('should return true for input containing spaces', () => {
        expect(isAlphanumeric('abc 123')).to.be.true;//return true since space is valid
    });

    //Test#4 this test for empty inputs
    it('should return false for an empty string', () => {
        expect(isAlphanumeric('')).to.be.false; // return false because inputs is empty
    });

    //Test$5 this test for capitals letter
    it('should return true for uppercase alphanumeric input', () => {
        expect(isAlphanumeric('ABC123')).to.be.true; // Capitals letter are also valid
    });

    //Test#6 this test for just space sends as inputs
    it('should return true for input with only spaces', () => {
        expect(isAlphanumeric('   ')).to.be.true;// use case to check if space would return true as intended
    });
    
});