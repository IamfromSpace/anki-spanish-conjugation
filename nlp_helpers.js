const lorca = require("lorca-nlp");

const get_syllables = word =>
  lorca(word)
    .syllables()
    .get();

module.exports = { get_syllables };
