// EnglishJS.js
// This script finds English words and translates them into JavaScript symbols.
const fs = require('fs');

// Here is the dictionary mapping English words to JS symbols
const dictionary = [
    { word: /\bequals\b/g, symbol: '=' },
    { word: /\bplus\b/g, symbol: '+' },
    { word: /\bminus\b/g, symbol: '-' },
    { word: /\btimes\b/g, symbol: '*' },
    { word: /\bdivided by\b/g, symbol: '/' },
    
    // Logic comparisons
    { word: /\bis equal to\b/g, symbol: '===' },
    { word: /\bis not equal to\b/g, symbol: '!==' },
    { word: /\bis greater than\b/g, symbol: '>' },
    { word: /\bis less than\b/g, symbol: '<' },
    { word: /\band\b/g, symbol: '&&' },
    { word: /\bor\b/g, symbol: '||' },
    
    // Replacing curly brackets {} with words
    { word: /\bbegin\b/g, symbol: '{' },
    { word: /\bend\b/g, symbol: '}' },

    // A nice shortcut so you don't have to type console.log()
    { word: /\bprint\b/g, symbol: 'console.log' }
];

function runEnglishJS(filename) {
    // 1. Read your English code
    let code = fs.readFileSync(filename, 'utf8');
    
    // 2. Swap out the words for JavaScript symbols
    dictionary.forEach(rule => {
        code = code.replace(rule.word, rule.symbol);
    });
    
    // 3. Run the translated code!
    try {
        eval(code);
    } catch (error) {
        console.log("Oops, there is a bug in the code:");
        console.error(error.message);
    }
}

// Grab the file you want to run
const fileToRun = process.argv[2] || 'script.english';

if (fs.existsSync(fileToRun)) {
    runEnglishJS(fileToRun);
} else {
    console.log(`Could not find ${fileToRun}.`);
}