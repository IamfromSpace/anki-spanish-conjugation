const ortho_correct = infinitive => ending => {
  const stem = infinitive.slice(0, infinitive.length - 2);
  if (/a.$/.test(infinitive)) {
    if (/^[eéií]/.test(ending)) {
      switch (stem.charAt(stem.length - 1)) {
        case "z":
          return stem.slice(0, stem.length - 1) + "c" + ending;
        case "c":
          return stem.slice(0, stem.length - 1) + "qu" + ending;
        case "g":
          return stem + "u" + ending;
        case "u":
          if (infinitive.charAt(stem.length - 2) === "g")
            return stem.slice(0, stem.length - 1) + "ü" + ending;
      }
    }
  } else {
    if (/^[^eéií]/.test(ending)) {
      switch (stem.charAt(stem.length - 1)) {
        case "c":
          return stem.slice(0, stem.length - 1) + "z" + ending;
        case "g":
          return stem.slice(0, stem.length - 1) + "j" + ending;
        case "u":
          if (stem.charAt(stem.length - 2) === "q")
            return stem.slice(0, stem.length - 2) + "c" + ending;
          if (stem.charAt(stem.length - 2) === "g")
            return stem.slice(0, stem.length - 1) + ending;
      }
    }
  }
  return stem + ending;
};

module.exports = { ortho_correct };
