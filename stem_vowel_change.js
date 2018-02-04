const { get_syllables } = require("./nlp_helpers");

const dipthongize = stem => ending => {
  if (
    /[nsaeiou]$/.test(ending) &&
    !/[áéíóú]/.test(ending) &&
    get_syllables(ending).length == 1
  ) {
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

module.exports = { dipthongize };
