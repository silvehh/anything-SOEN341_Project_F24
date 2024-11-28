//rating test , test file
import { expect } from 'chai';
import { containsOffensiveWords } from './sentenceCheck.mjs'

describe('containsOffensiveWords', () => {
    const offensiveWords = ['badword1', 'badword2', 'badword3'];

    // Test #1: Input contains an offensive word
    it('should return true if input contains an offensive word', () => {
        expect(containsOffensiveWords('This contains badword1', offensiveWords)).to.equal(true);
    });

    // Test #2: Input does not contain any offensive word
    it('should return false if input does not contain any offensive words', () => {
        expect(containsOffensiveWords('This is a clean sentence', offensiveWords)).to.equal(false);
    });

    // Test #3: Input contains offensive word with mixed case
    it('should return true if input contains an offensive word in mixed case', () => {
        expect(containsOffensiveWords('This contains BaDwOrD1', offensiveWords)).to.equal(true);
    });

    // Test #4: Input is an empty string
    it('should return false for an empty string', () => {
        expect(containsOffensiveWords('', offensiveWords)).to.equal(false);
    });

    // Test #5: Input contains no words (whitespace only)
    it('should return false for input with whitespace only', () => {
        expect(containsOffensiveWords('   ', offensiveWords)).to.equal(false);
    });

    // Test #6: Input is null
    it('should return false for null input', () => {
        expect(containsOffensiveWords(null, offensiveWords)).to.equal(false);
    });

    // Test #7: Input is undefined
    it('should return false for undefined input', () => {
        expect(containsOffensiveWords(undefined, offensiveWords)).to.equal(false);
    });

    // Test #8: Input contains offensive word as part of a larger word
    it('should return false if offensive word is part of a larger word', () => {
        expect(containsOffensiveWords('This is badword123', offensiveWords)).to.equal(false);
    });

    // Test #9: Input contains offensive words separated by punctuation
    it('should return true if offensive words are separated by punctuation', () => {
        expect(containsOffensiveWords('This contains badword1, and more.', offensiveWords)).to.equal(true);
    });
});