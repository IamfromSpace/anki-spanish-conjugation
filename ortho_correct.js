const lorca = require("lorca-nlp");

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

const get_syllables = word =>
  lorca(word)
    .syllables()
    .get();

const ending_correct = stem => ending => {
  const ending_syllables = get_syllables(ending);
  const is_stressed_i =
    !/[íéáóú]/.test(stem + ending) && // must not have different stress
    /^i[^aáeéoó]/.test(ending) && // must begin with an i and not be a dipthong
    // in practice, most of these rules never apply here, but are present for if this
    // gets extracted out into a "stress finder" function.
    ((/[^nsaeiou]/.test(ending) && ending_syllables.length === 2) ||
      ending_syllables.length === 1); // stress must fall on the i

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

const ortho_correct = infinitive => ending => {
  const stem = stem_correct(infinitive)(ending);
  return stem + ending_correct(stem)(ending);
};

module.exports = { ortho_correct };
