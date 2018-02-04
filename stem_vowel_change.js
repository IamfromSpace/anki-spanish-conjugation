const { get_syllables } = require("./nlp_helpers");
const { starts_with_stressed_i } = require("./stress");

const creates_dipthong = ending =>
  /[nsaeiou]$/.test(ending) &&
  !/[áéíóú]/.test(ending) &&
  get_syllables(ending).length == 1;

const dipthongize = stem => ending => {
  if (creates_dipthong(ending)) {
    const syllables = get_syllables(stem);
    const first_syllables = syllables.slice(0, syllables.length - 1).join("");
    const final_syllable = syllables[syllables.length - 1].replace(".", "");

    if (/[ei]/.test(final_syllable)) {
      const joined = first_syllables + final_syllable.replace(/[ei]/, "ie");
      return syllables.length === 1 ? joined.replace(/^i/, "y") : joined;
    } else if (/[ou]/.test(final_syllable)) {
      const start =
        syllables.length === 1 && /^[ou]/.test(final_syllable) ? "h" : "";
      return (
        start +
        first_syllables +
        final_syllable.replace(/[ou]/, "ue").replace("gu", "gü")
      );
    }
  }
  return stem;
};

const vowel_raise = dipthongizes => stem => ending => {
  if (
    !(/ir/.test(ending) || starts_with_stressed_i(ending)) &&
    (!dipthongizes || !creates_dipthong(ending))
  ) {
    const syllables = get_syllables(stem);
    const first_syllables = syllables.slice(0, syllables.length - 1).join("");
    const final_syllable = syllables[syllables.length - 1].replace(".", "");

    if (/e/.test(final_syllable)) {
      return first_syllables + final_syllable.replace("e", "i");
    } else if (/o/.test(final_syllable)) {
      return first_syllables + final_syllable.replace("o", "u");
    }
  }
  return stem;
};

module.exports = { dipthongize, vowel_raise };
