// Hack to get more memory out of underlying sql.js module
// https://github.com/kripken/sql.js/issues/113#issuecomment-317877596
Module = { TOTAL_MEMORY: Math.pow(2, 25) - 1 };
const fs = require("fs");
const AnkiExport = require("anki-apkg-export").default;
const { ortho_correct } = require("./ortho_correct");

const tense_desc = {
  present: "cada día",
  imperfect: "hace varios años",
  preterite: "ayer",
  future: "mañana",
  conditional: "hoy si...",
  present_subjunctive: "quiero que...",
  imperfect_subjunctive: "yo quería que...",
  present_perfect: "justamente recientemente",
  pluperfect: "antes...",
  future_perfect: "en la mañana, pero antes...",
  conditional_perfect: "ayer si...",
  present_perfect_subjunctive: "No creo que justamente recientemente...",
  pluperfect_subjunctive: "Yo no creía que... antes..."
};

const tense = (yo, tú, usted, nosotros, ustedes) => ({
  yo,
  tú,
  usted,
  nosotros,
  ustedes
});

const tense_map = fn => t => ({
  yo: fn(t.yo),
  tú: fn(t.tú),
  usted: fn(t.usted),
  nosotros: fn(t.nosotros),
  ustedes: fn(t.ustedes)
});

const tense_append = tense => infinitive =>
  tense_map(ending => ortho_correct(infinitive)(ending))(tense);

// -ar
const regular_present_ar = tense_append(tense("o", "as", "a", "amos", "an"));

const regular_imperfect_ar = tense_append(
  tense("aba", "abas", "aba", "ábamos", "aban")
);

const regular_preterite_ar = tense_append(
  tense("é", "aste", "ó", "amos", "aron")
);

const regular_future_ar = tense_append(
  tense("aré", "arás", "ará", "aremos", "arán")
);

const regular_conditional_ar = tense_append(
  tense("aría", "arías", "aría", "aríamos", "arían")
);

const regular_present_subjunctive_ar = tense_append(
  tense("e", "es", "e", "emos", "en")
);

const regular_imperfect_subjunctive_ar = tense_append(
  tense("ara", "aras", "ara", "áramos", "aran")
);

// -er
const regular_present_er = tense_append(tense("o", "es", "e", "emos", "en"));

const regular_imperfect_er = tense_append(
  tense("ía", "ías", "ía", "íamos", "ían")
);

const regular_preterite_er = tense_append(
  tense("í", "iste", "ió", "imos", "ieron")
);

const regular_future_er = tense_append(
  tense("eré", "erás", "erá", "eremos", "erán")
);

const regular_conditional_er = tense_append(
  tense("ería", "erías", "ería", "eríamos", "erían")
);

const regular_present_subjunctive_er = tense_append(
  tense("a", "as", "a", "amos", "an")
);

const regular_imperfect_subjunctive_er = tense_append(
  tense("iera", "ieras", "iera", "iéramos", "ieran")
);

// -ir
const regular_present_ir = tense_append(tense("o", "es", "e", "imos", "en"));

const regular_imperfect_ir = regular_imperfect_er;

const regular_preterite_ir = regular_preterite_er;

const regular_future_ir = tense_append(
  tense("iré", "irás", "irá", "iremos", "irán")
);

const regular_conditional_ir = tense_append(
  tense("iría", "irías", "iría", "iríamos", "irían")
);

const regular_present_subjunctive_ir = regular_present_subjunctive_er;

const regular_imperfect_subjunctive_ir = regular_imperfect_subjunctive_er;

const verb = (
  infinitive,
  present_participle,
  past_participle,
  imperative_positive_tú,
  present,
  imperfect,
  preterite,
  future,
  conditional,
  present_subjunctive,
  imperfect_subjunctive
) => ({
  infinitive,
  present_participle,
  past_participle,
  imperative_positive_tú,
  simple_tenses: {
    present,
    imperfect,
    preterite,
    future,
    conditional,
    present_subjunctive,
    imperfect_subjunctive
  }
});

const get_stem = infinitive => infinitive.slice(0, infinitive.length - 2);

regular_verb_ar = infinitive => {
  const stem = get_stem(infinitive);
  return verb(
    infinitive,
    stem + "ando",
    stem + "ado",
    stem + "a",
    regular_present_ar(infinitive),
    regular_imperfect_ar(infinitive),
    regular_preterite_ar(infinitive),
    regular_future_ar(infinitive),
    regular_conditional_ar(infinitive),
    regular_present_subjunctive_ar(infinitive),
    regular_imperfect_subjunctive_ar(infinitive)
  );
};

regular_verb_er = infinitive => {
  const stem = get_stem(infinitive);
  return verb(
    infinitive,
    stem + "iendo",
    stem + "ido",
    stem + "e",
    regular_present_er(infinitive),
    regular_imperfect_er(infinitive),
    regular_preterite_er(infinitive),
    regular_future_er(infinitive),
    regular_conditional_er(infinitive),
    regular_present_subjunctive_er(infinitive),
    regular_imperfect_subjunctive_er(infinitive)
  );
};

regular_verb_ir = infinitive => {
  const stem = get_stem(infinitive);
  return verb(
    stem + "ir",
    stem + "iendo",
    stem + "ido",
    stem + "e",
    regular_present_ir(infinitive),
    regular_imperfect_ir(infinitive),
    regular_preterite_ir(infinitive),
    regular_future_ir(infinitive),
    regular_conditional_ir(infinitive),
    regular_present_subjunctive_ir(infinitive),
    regular_imperfect_subjunctive_ir(infinitive)
  );
};

const haber = verb(
  "haber",
  "habiendo",
  "habido",
  "hé",
  tense("he", "has", "ha", "hemos", "han"),
  tense("había", "habías", "había", "habíamos", "habían"),
  tense("hube", "hubiste", "hubo", "hubimos", "hubieron"),
  tense("habré", "habrás", "habrá", "habremos", "habrán"),
  tense("habría", "habrías", "habría", "habríamos", "habrían"),
  tense("haya", "hayas", "haya", "hayamos", "hayan"),
  tense("hubiera", "hubieras", "hubiera", "hubiéramos", "hubieran")
);

regular_verb = infinitive => {
  switch (infinitive.slice(-2)) {
    case "ar":
      return regular_verb_ar(infinitive);
    case "er":
      return regular_verb_er(infinitive);
    case "ir":
      return regular_verb_ir(infinitive);
    default:
      throw new Error("invalid verb ending!");
  }
};

const card = (front, back, tags) => ({
  front,
  back,
  tags
});

const simple_tense_to_cards = (infinitive, tense_name, tense) =>
  Object.keys(tense).map(subject =>
    card(
      `<div style="font-size:36px; font-weight:bold">${infinitive}</div><img src="${tense_name}.png" /><img src="${subject}.png" /><div style="font-size:12px; font-style:italic">(${
        tense_desc[tense_name]
      }, ${subject})</div>`,
      tense[subject],
      [subject, tense_name, infinitive, `-${infinitive.slice(-2)}`]
    )
  );

const verb_to_compound_tenses = verb => {
  const add_past_particple = tense_map(x => x + " " + verb.past_participle);
  return {
    present_perfect: add_past_particple(haber.simple_tenses.present),
    pluperfect: add_past_particple(haber.simple_tenses.imperfect),
    // omitted due to rarity
    // preterite_perfect: add_past_particple(haber.simple_tenses.preterite),
    future_perfect: add_past_particple(haber.simple_tenses.future),
    conditional_perfect: add_past_particple(haber.simple_tenses.conditional),
    present_perfect_subjunctive: add_past_particple(
      haber.simple_tenses.present_subjunctive
    ),
    pluperfect_subjunctive: add_past_particple(
      haber.simple_tenses.imperfect_subjunctive
    )
  };
};

const verb_to_cards = verb => {
  const simple_cards = Object.keys(verb.simple_tenses).map(tense_name =>
    simple_tense_to_cards(
      verb.infinitive,
      tense_name,
      verb.simple_tenses[tense_name]
    )
  );
  const compound_tenses = verb_to_compound_tenses(verb);
  const compound_cards = Object.keys(compound_tenses).map(tense_name =>
    simple_tense_to_cards(
      verb.infinitive,
      tense_name,
      compound_tenses[tense_name]
    )
  );
  return simple_cards.concat(compound_cards).reduce((p, n) => p.concat(n), []);
};

const make_deck = (deck_name, cards, image_names) =>
  image_names.reduce(
    (a, name) => {
      a.addMedia(`${name}.png`, fs.readFileSync(`assets/${name}.png`));
      return a;
    },
    cards.reduce((a, { front, back, tags }) => {
      a.addCard(front, back, { tags });
      return a;
    }, new AnkiExport(deck_name))
  );

const save_deck = deck =>
  deck.save().then(zip => {
    fs.writeFileSync("./output.apkg", zip, "binary");
  });

const verbs = [
  regular_verb("hablar"),
  regular_verb("caminar"),
  regular_verb("llevar"),
  regular_verb("dejar"),
  regular_verb("llamar"),
  regular_verb("comer"),
  regular_verb("aprender"),
  regular_verb("beber"),
  regular_verb("comprender"),
  regular_verb("correr"),
  regular_verb("responder"),
  regular_verb("vivir"),
  regular_verb("decidir"),
  regular_verb("insistir"),
  regular_verb("ocurrir"),
  regular_verb("permitir"),
  regular_verb("recibir"),
  regular_verb("tocar"),
  regular_verb("gozar"),
  regular_verb("averiguar"),
  regular_verb("delinquir"),
  regular_verb("vencer"),
  regular_verb("proteger"),
  regular_verb("distinguir"),
  haber
];

const cards = verbs.map(verb_to_cards).reduce((p, n) => p.concat(n), []);
console.log(cards);
console.log(cards.length);

const image_names = [
  "yo",
  "tú",
  "usted",
  "nosotros",
  "ustedes",
  "present",
  "imperfect",
  "preterite",
  "future",
  "conditional",
  "present_subjunctive",
  "imperfect_subjunctive",
  "present_perfect",
  "pluperfect",
  "future_perfect",
  "conditional_perfect",
  "present_perfect_subjunctive",
  "pluperfect_subjunctive"
];

const deck = make_deck(`Spanish Conjugation`, cards, image_names);

save_deck(deck).then(() => console.log("output written successfully!"));
