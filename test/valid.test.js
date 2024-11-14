import { describe, test, it, expect } from 'vitest';
import { rating } from './valid.js'

//Create test 
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
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(4)).toBe(true);
    })
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(5)).toBe(true);
    })
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(6)).toBe(false);
    })

})
