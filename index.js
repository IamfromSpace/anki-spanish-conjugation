// Hack to get more memory out of underlying sql.js module
// https://github.com/kripken/sql.js/issues/113#issuecomment-317877596
Module = { TOTAL_MEMORY: Math.pow(2, 25) - 1 };
const fs = require("fs");
const AnkiExport = require("anki-apkg-export").default;

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

const tense_pure = s => tense(s, s, s, s, s);
const tense_mappend = (a, b) => ({
  yo: a.yo + b.yo,
  tú: a.tú + b.tú,
  usted: a.usted + b.usted,
  nosotros: a.nosotros + b.nosotros,
  ustedes: a.ustedes + b.ustedes
});

// -ar
const regular_present_ar = s =>
  tense(s + "o", s + "as", s + "a", s + "amos", s + "an");

const regular_imperfect_ar = s =>
  tense(s + "aba", s + "abas", s + "aba", s + "ábamos", s + "aban");

const regular_preterite_ar = s =>
  tense(s + "é", s + "aste", s + "ó", s + "amos", s + "aron");

const regular_future_ar = s =>
  tense(s + "aré", s + "arás", s + "ará", s + "aremos", s + "arán");

const regular_conditional_ar = s =>
  tense(s + "aría", s + "arías", s + "aría", s + "aríamos", s + "arían");

const regular_present_subjunctive_ar = s =>
  tense(s + "e", s + "es", s + "e", s + "emos", s + "en");

const regular_imperfect_subjunctive_ar = s =>
  tense(s + "ara", s + "aras", s + "ara", s + "áramos", s + "aran");

// -er
const regular_present_er = s =>
  tense(s + "o", s + "es", s + "e", s + "emos", s + "en");

const regular_imperfect_er = s =>
  tense(s + "ía", s + "ías", s + "ía", s + "íamos", s + "ían");

const regular_preterite_er = s =>
  tense(s + "í", s + "iste", s + "ió", s + "imos", s + "ieron");

const regular_future_er = s =>
  tense(s + "eré", s + "erás", s + "erá", s + "eremos", s + "erán");

const regular_conditional_er = s =>
  tense(s + "ería", s + "erías", s + "ería", s + "eríamos", s + "erían");

const regular_present_subjunctive_er = s =>
  tense(s + "a", s + "as", s + "a", s + "amos", s + "an");

const regular_imperfect_subjunctive_er = s =>
  tense(s + "iera", s + "ieras", s + "iera", s + "iéramos", s + "ieran");

// -ir
const regular_present_ir = s =>
  tense(s + "o", s + "es", s + "e", s + "imos", s + "en");

const regular_imperfect_ir = regular_imperfect_er;

const regular_preterite_ir = regular_preterite_er;

const regular_future_ir = s =>
  tense(s + "iré", s + "irás", s + "irá", s + "iremos", s + "irán");

const regular_conditional_ir = s =>
  tense(s + "iría", s + "irías", s + "iría", s + "iríamos", s + "irían");

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

regular_verb_ar = s =>
  verb(
    s + "ar",
    s + "ando",
    s + "ado",
    s + "a",
    regular_present_ar(s),
    regular_imperfect_ar(s),
    regular_preterite_ar(s),
    regular_future_ar(s),
    regular_conditional_ar(s),
    regular_present_subjunctive_ar(s),
    regular_imperfect_subjunctive_ar(s)
  );

regular_verb_er = s =>
  verb(
    s + "er",
    s + "iendo",
    s + "ido",
    s + "e",
    regular_present_er(s),
    regular_imperfect_er(s),
    regular_preterite_er(s),
    regular_future_er(s),
    regular_conditional_er(s),
    regular_present_subjunctive_er(s),
    regular_imperfect_subjunctive_er(s)
  );

regular_verb_ir = s =>
  verb(
    s + "ir",
    s + "iendo",
    s + "ido",
    s + "e",
    regular_present_ir(s),
    regular_imperfect_ir(s),
    regular_preterite_ir(s),
    regular_future_ir(s),
    regular_conditional_ir(s),
    regular_present_subjunctive_ir(s),
    regular_imperfect_subjunctive_ir(s)
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
  const stem = infinitive.slice(0, infinitive.length - 2);
  switch (infinitive.slice(-2)) {
    case "ar":
      return regular_verb_ar(stem);
    case "er":
      return regular_verb_er(stem);
    case "ir":
      return regular_verb_ir(stem);
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
  const past_pure = tense_pure(" " + verb.past_participle);
  return {
    present_perfect: tense_mappend(haber.simple_tenses.present, past_pure),
    pluperfect: tense_mappend(haber.simple_tenses.imperfect, past_pure),
    // omitted due to rarity
    // preterite_perfect: tense_mappend(haber.simple_tenses.preterite, past_pure),
    future_perfect: tense_mappend(haber.simple_tenses.future, past_pure),
    conditional_perfect: tense_mappend(
      haber.simple_tenses.conditional,
      past_pure
    ),
    present_perfect_subjunctive: tense_mappend(
      haber.simple_tenses.present_subjunctive,
      past_pure
    ),
    pluperfect_subjunctive: tense_mappend(
      haber.simple_tenses.imperfect_subjunctive,
      past_pure
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
