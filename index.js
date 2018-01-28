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

const verb = (
  infinitive,
  present_participle,
  past_participle,
  imperative_negative,
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
  imperative_negative,
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
  /*
  present_participle,
  past_participle,
  imperative,
  present,
  imperfect,
  preterite,
  future,
  conditional,
  present_subjunctive,
  imperfect_subjunctive
  */
  verb(
    "hablar",
    "hablando",
    "hablado",
    "hables",
    tense("hablo", "hablas", "habla", "hablamos", "hablan"),
    tense("hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"),
    tense("hablé", "hablaste", "habló", "hablamos", "hablaron"),
    tense("hablaré", "hablarás", "hablará", "hablaremos", "hablarán"),
    tense("hablaría", "hablarías", "hablaría", "hablaríamos", "hablarían"),
    tense("hable", "hables", "hable", "hablemos", "hablen"),
    tense("hablara", "hablaras", "hablara", "habláramos", "hablaran")
  )
];

const cards = verbs.map(verbToCards).reduce((p, n) => p.concat(n), []);

const deck = makeDeck("Spanish Conjugation", cards);

saveDeck(deck).then(() => console.log("output written successfully!"));
