// Hack to get more memory out of underlying sql.js module
// https://github.com/kripken/sql.js/issues/113#issuecomment-317877596
Module = { TOTAL_MEMORY: Math.pow(2, 26) - 1 };
const fs = require("fs");
const AnkiExport = require("anki-apkg-export").default;
const {
  ortho_correct,
  ortho_correct_dipthongizing
} = require("./ortho_correct");

// just because I always need these...
// á, é, í, ó, ú, ñ, ü

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

const tense_append_dipthongizing = tense => infinitive =>
  tense_map(ending => ortho_correct_dipthongizing(infinitive)(ending))(tense);

// -ar
const present_ar = tense("o", "as", "a", "amos", "an");

const imperfect_ar = tense("aba", "abas", "aba", "ábamos", "aban");

const preterite_ar = tense("é", "aste", "ó", "amos", "aron");

const future_ar = tense("aré", "arás", "ará", "aremos", "arán");

const conditional_ar = tense("aría", "arías", "aría", "aríamos", "arían");

const present_subjunctive_ar = tense("e", "es", "e", "emos", "en");

const imperfect_subjunctive_ar = tense("ara", "aras", "ara", "áramos", "aran");

// -er
const present_er = tense("o", "es", "e", "emos", "en");

const imperfect_er = tense("ía", "ías", "ía", "íamos", "ían");

const preterite_er = tense("í", "iste", "ió", "imos", "ieron");

const future_er = tense("eré", "erás", "erá", "eremos", "erán");

const conditional_er = tense("ería", "erías", "ería", "eríamos", "erían");

const present_subjunctive_er = tense("a", "as", "a", "amos", "an");

const imperfect_subjunctive_er = tense(
  "iera",
  "ieras",
  "iera",
  "iéramos",
  "ieran"
);

// -ir
const present_ir = tense("o", "es", "e", "imos", "en");

const imperfect_ir = imperfect_er;

const preterite_ir = preterite_er;

const future_ir = tense("iré", "irás", "irá", "iremos", "irán");

const conditional_ir = tense("iría", "irías", "iría", "iríamos", "irían");

const present_subjunctive_ir = present_subjunctive_er;

const imperfect_subjunctive_ir = imperfect_subjunctive_er;

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

regular_verb_ar = infinitive =>
  verb(
    infinitive,
    ortho_correct(infinitive)("ando"),
    ortho_correct(infinitive)("ado"),
    ortho_correct(infinitive)("a"),
    tense_append(present_ar)(infinitive),
    tense_append(imperfect_ar)(infinitive),
    tense_append(preterite_ar)(infinitive),
    tense_append(future_ar)(infinitive),
    tense_append(conditional_ar)(infinitive),
    tense_append(present_subjunctive_ar)(infinitive),
    tense_append(imperfect_subjunctive_ar)(infinitive)
  );

regular_verb_er = infinitive =>
  verb(
    infinitive,
    ortho_correct(infinitive)("iendo"),
    ortho_correct(infinitive)("ido"),
    ortho_correct(infinitive)("e"),
    tense_append(present_er)(infinitive),
    tense_append(imperfect_er)(infinitive),
    tense_append(preterite_er)(infinitive),
    tense_append(future_er)(infinitive),
    tense_append(conditional_er)(infinitive),
    tense_append(present_subjunctive_er)(infinitive),
    tense_append(imperfect_subjunctive_er)(infinitive)
  );

regular_verb_ir = infinitive =>
  verb(
    infinitive,
    ortho_correct(infinitive)("iendo"),
    ortho_correct(infinitive)("ido"),
    ortho_correct(infinitive)("e"),
    tense_append(present_ir)(infinitive),
    tense_append(imperfect_ir)(infinitive),
    tense_append(preterite_ir)(infinitive),
    tense_append(future_ir)(infinitive),
    tense_append(conditional_ir)(infinitive),
    tense_append(present_subjunctive_ir)(infinitive),
    tense_append(imperfect_subjunctive_ir)(infinitive)
  );

dipthongizing_verb_ar = infinitive =>
  verb(
    infinitive,
    ortho_correct_dipthongizing(infinitive)("ando"),
    ortho_correct_dipthongizing(infinitive)("ado"),
    ortho_correct_dipthongizing(infinitive)("a"),
    tense_append_dipthongizing(present_ar)(infinitive),
    tense_append_dipthongizing(imperfect_ar)(infinitive),
    tense_append_dipthongizing(preterite_ar)(infinitive),
    tense_append_dipthongizing(future_ar)(infinitive),
    tense_append_dipthongizing(conditional_ar)(infinitive),
    tense_append_dipthongizing(present_subjunctive_ar)(infinitive),
    tense_append_dipthongizing(imperfect_subjunctive_ar)(infinitive)
  );

dipthongizing_verb_er = infinitive =>
  verb(
    infinitive,
    ortho_correct_dipthongizing(infinitive)("iendo"),
    ortho_correct_dipthongizing(infinitive)("ido"),
    ortho_correct_dipthongizing(infinitive)("e"),
    tense_append_dipthongizing(present_er)(infinitive),
    tense_append_dipthongizing(imperfect_er)(infinitive),
    tense_append_dipthongizing(preterite_er)(infinitive),
    tense_append_dipthongizing(future_er)(infinitive),
    tense_append_dipthongizing(conditional_er)(infinitive),
    tense_append_dipthongizing(present_subjunctive_er)(infinitive),
    tense_append_dipthongizing(imperfect_subjunctive_er)(infinitive)
  );

dipthongizing_verb_ir = infinitive =>
  verb(
    infinitive,
    ortho_correct_dipthongizing(infinitive)("iendo"),
    ortho_correct_dipthongizing(infinitive)("ido"),
    ortho_correct_dipthongizing(infinitive)("e"),
    tense_append_dipthongizing(present_ir)(infinitive),
    tense_append_dipthongizing(imperfect_ir)(infinitive),
    tense_append_dipthongizing(preterite_ir)(infinitive),
    tense_append_dipthongizing(future_ir)(infinitive),
    tense_append_dipthongizing(conditional_ir)(infinitive),
    tense_append_dipthongizing(present_subjunctive_ir)(infinitive),
    tense_append_dipthongizing(imperfect_subjunctive_ir)(infinitive)
  );

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

const dipthongizing_verb = infinitive => {
  switch (infinitive.slice(-2)) {
    case "ar":
      return dipthongizing_verb_ar(infinitive);
    case "er":
      return dipthongizing_verb_er(infinitive);
    case "ir":
      return dipthongizing_verb_ir(infinitive);
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
  regular_verb("leer"),
  dipthongizing_verb("pensar"),
  dipthongizing_verb("oler"),
  dipthongizing_verb("errar"),
  dipthongizing_verb("contar"),
  dipthongizing_verb("jugar"),
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
