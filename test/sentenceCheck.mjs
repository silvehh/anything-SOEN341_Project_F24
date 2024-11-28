export function containsOffensiveWords(input, offensiveWords) {

    if (typeof input !== 'string') //Check if the inputs is a string
        return false;
    const words = input.toLowerCase().split(/\s+/);
        return words.some(word => offensiveWords.includes(word)); //check if the word is in the senetence

}