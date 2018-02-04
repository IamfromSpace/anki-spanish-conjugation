const { get_syllables } = require("./nlp_helpers");

const starts_with_stressed_i = word => {
  const syllables = get_syllables(word);
  return (
    /^í/.test(word) || // we're done here
    (!/([éáóú]|.í)/.test(word) && // must not have different stress
    /^i[^aáeéoó]/.test(word) && // must begin with an i and not be a dipthong
      ((/[nsaeiou]$/.test(word) && syllables.length === 2) ||
        syllables.length === 1)) // must be at the assumed stress point
  );
};

module.exports = { starts_with_stressed_i };
