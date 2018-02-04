const { get_syllables } = require("./nlp_helpers");
const { dipthongize, vowel_raise } = require("./stem_vowel_change");
const { starts_with_stressed_i } = require("./stress");

const stem_correct = infinitive => ending => {
  const stem = infinitive.slice(0, infinitive.length - 2);
  if (/a.$/.test(infinitive)) {
    if (/^[eéií]/.test(ending)) {
      switch (stem.charAt(stem.length - 1)) {
        case "z":
          return stem.slice(0, stem.length - 1) + "c";
        case "c":
          return stem.slice(0, stem.length - 1) + "qu";
        case "g":
          return stem + "u";
        case "u":
          if (infinitive.charAt(stem.length - 2) === "g")
            return stem.slice(0, stem.length - 1) + "ü";
      }
    }
  } else {
    if (/^[^eéií]/.test(ending)) {
      switch (stem.charAt(stem.length - 1)) {
        case "c":
          return stem.slice(0, stem.length - 1) + "z";
        case "g":
          return stem.slice(0, stem.length - 1) + "j";
        case "u":
          if (stem.charAt(stem.length - 2) === "q")
            return stem.slice(0, stem.length - 2) + "c";
          if (stem.charAt(stem.length - 2) === "g")
            return stem.slice(0, stem.length - 1);
      }
    }
  }
  return stem;
};

const unaccent = word =>
  word
    .replace(/í/g, "i")
    .replace(/é/g, "e")
    .replace(/á/g, "a")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u");

const ending_correct = stem => ending => {
  const is_stressed_i = starts_with_stressed_i(ending);

  if (/[eéaáoó]$/.test(stem) && is_stressed_i) {
    return "í" + ending.slice(1, ending.length);
  }

  const stem_no_accents = unaccent(stem);
  const ending_no_accents = unaccent(ending);
  const is_monosyllabic =
    get_syllables(stem_no_accents + ending_no_accents).length === 1;

  if (is_monosyllabic) {
    return ending_no_accents;
  }

  if (
    !is_stressed_i &&
    /[aáeéiíoóuú]$/.test(stem) &&
    /^i[aáeéiíoóuú]/.test(ending)
  ) {
    return "y" + ending.slice(1, ending.length);
  }

  if (!is_stressed_i && /(ll|ñ)$/.test(stem) && /^i[aáeéiíoóuú]/.test(ending)) {
    return ending.slice(1, ending.length);
  }

  return ending;
};

const ortho_correct = vowel_rasing => dipthongizing => infinitive => ending => {
  const stem_1 = infinitive.slice(0, infinitive.length - 2);
  const stem_2 = dipthongizing ? dipthongize(stem_1)(ending) : stem_1;
  const stem_3 = vowel_rasing
    ? vowel_raise(dipthongizing)(stem_2)(ending)
    : stem_2;
  const stem_4 = stem_correct(stem_3 + infinitive.slice(-2))(ending);
  return stem_4 + ending_correct(stem_4)(ending);
};

module.exports = { ortho_correct };
