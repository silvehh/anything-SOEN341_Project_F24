import { describe, test, it, expect } from 'vitest';
import { rating } from './valid.js'


describe('rating', () => {

    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(0)).toBe(false);
    })
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(1)).toBe(true);
    })
    it('Should return true if value between 1 and 5', () => {
       
        expect(rating(2)).toBe(true);
    })
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
