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

const ending_correct = stem => ending => {
  if (
    /^[i]/.test(ending) && // must begin with an i
    !(/[íéáóú]/.test(stem) || /[íéáóú]/.test(ending)) && // must not have different stress
    /[eéaáoó]$/.test(stem) && // stem must end with an a/e/o
    lorca(ending)
      .syllables()
      .get().length === 2 // stress must fall on the i
  ) {
    return "í" + ending.slice(1, ending.length);
  }
  return ending;
};

const ortho_correct = infinitive => ending => {
  const stem = stem_correct(infinitive)(ending);
  return stem + ending_correct(stem)(ending);
};

module.exports = { ortho_correct };
