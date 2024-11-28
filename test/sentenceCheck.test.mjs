//rating test , test file
import { expect } from 'chai';
import { containsOffensiveWords } from './sentenceCheck.mjs'

describe('containsOffensiveWords', () => {
    const offensiveWords = ['badword1', 'badword2', 'badword3'];

    
    it('should return true if input contains an offensive word', () => {
        expect(containsOffensiveWords('This contains badword1', offensiveWords)).to.equal(true);
    });

    
    it('should return false if input does not contain any offensive words', () => {
        expect(containsOffensiveWords('This is a clean sentence', offensiveWords)).to.equal(false);
    });

    
    it('should return true if input contains an offensive word in mixed case', () => {
        expect(containsOffensiveWords('This contains BaDwOrD1', offensiveWords)).to.equal(true);
    });

    
    it('should return false for an empty string', () => {
        expect(containsOffensiveWords('', offensiveWords)).to.equal(false);
    });

    
    it('should return false for input with whitespace only', () => {
        expect(containsOffensiveWords('   ', offensiveWords)).to.equal(false);
    });

    
    it('should return false for null input', () => {
        expect(containsOffensiveWords(null, offensiveWords)).to.equal(false);
    });

    
    it('should return false for undefined input', () => {
        expect(containsOffensiveWords(undefined, offensiveWords)).to.equal(false);
    });

    
    it('should return false if offensive word is part of a larger word', () => {
        expect(containsOffensiveWords('This is badword123', offensiveWords)).to.equal(false);
    });

    
    it('should return true if offensive words are separated by punctuation', () => {
        expect(containsOffensiveWords('This contains badword1, and more.', offensiveWords)).to.equal(true);
    });
});