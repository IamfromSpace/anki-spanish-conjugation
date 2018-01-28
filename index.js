const fs = require("fs");
const AnkiExport = require("anki-apkg-export").default;

const tenseDesc = {
  present: "cada día",
  imperfect: "hace varios año",
  preterite: "ayer",
  future: "mañana",
  conditional: "hoy si...",
  present_subjunctive: "hoy quiero que...",
  imperfect_subjunctive: "ayer yo quería que..."
};

const tense = (yo, tú, usted, nosotros, ustedes) => ({
  yo,
  tú,
  usted,
  nosotros,
  ustedes
});

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

const card = (front, back, tags) => ({
  front,
  back,
  tags
});

const simpleTenseToCards = (infinitive, tense_name, tense) =>
  Object.keys(tense).map(subject =>
    card(
      `${
        tenseDesc[tense_name]
      }, ${subject}, ${infinitive}<imc src="${tense_name}.png" /><img src="${subject}.png" />`,
      tense[subject],
      [subject, tense_name, infinitive, `-${infinitive.slice(-2)}`]
    )
  );

const verbToCards = verb =>
  Object.keys(verb.simple_tenses)
    .map(tense_name =>
      simpleTenseToCards(
        verb.infinitive,
        tense_name,
        verb.simple_tenses[tense_name]
      )
    )
    .reduce((p, n) => p.concat(n), []);

const makeDeck = (deckName, cards) =>
  // TODO: Add images
  // apkg.addMedia('anki.png', fs.readFileSync('assets/anki.png'));
  cards.reduce((a, { front, back, tags }) => {
    a.addCard(front, back, { tags });
    return a;
  }, new AnkiExport(deckName));

const saveDeck = deck =>
  deck.save().then(zip => {
    fs.writeFileSync("./output.apkg", zip, "binary");
  });

const verbs = [
  regular_verb_ar("habl"),
  regular_verb_ar("camin"),
  regular_verb_ar("pas"),
  regular_verb_ar("qued"),
  regular_verb_ar("llev"),
  regular_verb_ar("dej"),
  regular_verb_ar("llam"),
  regular_verb_ar("tom")
];

const cards = verbs.map(verbToCards).reduce((p, n) => p.concat(n), []);

const deck = makeDeck("Spanish Conjugation", cards);

saveDeck(deck).then(() => console.log("output written successfully!"));
