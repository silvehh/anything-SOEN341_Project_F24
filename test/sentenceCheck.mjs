export function containsOffensiveWords(input, offensiveWords) {

    if (typeof input !== 'string') return false;
    const words = input.toLowerCase().split(/\s+/);
    return words.some(word => offensiveWords.includes(word));
    
}