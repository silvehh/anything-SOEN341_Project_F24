
import { describe, test, it, expect } from 'vitest';
import { rating } from './valid.js'

//Create test case
describe('rating', () => {

    //Test #1 testing with value of 0 and it should return false
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(0)).toBe(false);
    })

    //Test #2 testing with valie of 1 and it should return true
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(1)).toBe(true);
    })

    //Test #3 testing with value of 2 and it should return true
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(2)).toBe(true);
    })

    //Test #4 testing with value of 3 and it should return true
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(3)).toBe(true);
    })

    //Test #5 testing with value of 4 and it should return true
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(4)).toBe(true);
    })

    //Test #6 testing with value of 5 and it should return true
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(5)).toBe(true);
    })

    //Test #7 testing with value of 6 and it should return false 
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(6)).toBe(false);
    })

    //Test #8 testing with 100 and it should return false
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(100)).toBe(false);
    })

    //Test #9 testing with -1 and it should return false
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(-1)).toBe(false);
    })

})
