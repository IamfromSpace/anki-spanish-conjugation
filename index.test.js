const { expect } = require("chai");
const { ortho_correct } = require("./ortho_correct");
const { dipthongize, vowel_raise } = require("./stem_vowel_change");

describe("regular ortho_correct", () => {
  const correct = ortho_correct(false)(false);
  describe("stem change", () => {
    it("-ar verbs", () => {
      expect(correct("tocar")("emos")).to.equal("toquemos");
      expect(correct("tocar")("é")).to.equal("toqué");
      expect(correct("gozar")("emos")).to.equal("gocemos");
      expect(correct("negar")("emos")).to.equal("neguemos");
      expect(correct("averiguar")("emos")).to.equal("averigüemos");
    });

    describe("-[ei]r verbs", () => {
      it("sound preservation", () => {
        expect(correct("delinquir")("amos")).to.equal("delincamos");
        expect(correct("vencer")("o")).to.equal("venzo");
        expect(correct("proteger")("amos")).to.equal("protejamos");
        expect(correct("distinguir")("amos")).to.equal("distingamos");
      });

      it("-uir medial -y-", () => {
        expect(correct("construir")("o")).to.equal("construyo");
        expect(correct("construir")("es")).to.equal("construyes");
        expect(correct("construir")("a")).to.equal("construya");
        expect(correct("argüir")("o")).to.equal("arguyo");
        expect(correct("argüir")("ó")).to.equal("arguyó");
      });
    });
  });

  describe("no stem change", () => {
    it("-ar verbs", () => {
      expect(correct("averiguar")("amos")).to.equal("averiguamos");
      expect(correct("hablar")("emos")).to.equal("hablemos");
    });

    describe("-[ei]r verbs", () => {
      it("sound preservation", () => {
        expect(correct("distinguir")("emos")).to.equal("distinguemos");
        expect(correct("distinguir")("é")).to.equal("distingué");
        expect(correct("distinguir")("ía")).to.equal("distinguía");
        expect(correct("correr")("amos")).to.equal("corramos");
      });

      it("-uir medial -y-", () => {
        expect(correct("construir")("ía")).to.equal("construía");
        expect(correct("construir")("iría")).to.equal("construiría");
        expect(correct("argüir")("ía")).to.equal("argüía");
        expect(correct("argüir")("iría")).to.equal("argüiría");
      });
    });
  });

  describe("impossible cases that would stem change", () => {
    it("-ar verbs", () => {
      expect(correct("tocar")("i")).to.equal("toqui");
      expect(correct("tocar")("í")).to.equal("toquí");
    });

    it("-[ei]r verbs", () => {
      expect(correct("vencer")("á")).to.equal("venzá");
    });
  });

  describe("ending change", () => {
    it("should accent the i when stressed", () => {
      expect(correct("caer")("imos")).to.equal("caímos");
      expect(correct("caer")("iste")).to.equal("caíste");
      expect(correct("leer")("imos")).to.equal("leímos");
      expect(correct("oír")("imos")).to.equal("oímos");
    });

    it("should remove accents in monosyllabic forms", () => {
      expect(correct("liar")("é")).to.equal("lie");
      expect(correct("liar")("ó")).to.equal("lio");
      expect(correct("ver")("í")).to.equal("vi");
      expect(correct("ver")("ío")).to.equal("vio");
    });

    it("should replace an i between vowels with a y", () => {
      expect(correct("caer")("ió")).to.equal("cayó");
      expect(correct("caer")("ieron")).to.equal("cayeron");
      expect(correct("argüir")("iendo")).to.equal("arguyendo");
    });

    it("should drop an i between ll or ñ and a vowel", () => {
      expect(correct("bullir")("ió")).to.equal("bulló");
      expect(correct("tañer")("ió")).to.equal("tañó");
    });
  });

  describe("dipthongize", () => {
    it("should...", () => {
      expect(dipthongize("pens")("o")).to.equal("piens");
      expect(dipthongize("cont")("o")).to.equal("cuent");
      expect(dipthongize("ol")("o")).to.equal("huel");
      expect(dipthongize("err")("o")).to.equal("yerr");

      expect(dipthongize("jug")("o")).to.equal("jueg");
      expect(dipthongize("aduquir")("o")).to.equal("aduquier");

      expect(dipthongize("pens")("amos")).to.equal("pens");
      expect(dipthongize("cont")("amos")).to.equal("cont");
      expect(dipthongize("ol")("emos")).to.equal("ol");
      expect(dipthongize("err")("amos")).to.equal("err");

      expect(dipthongize("avergonz")("o")).to.equal("avergüenz");
    });
  });

  describe("vowel_raising", () => {
    it("not raise for non-dipthongizers when the ending does not included ir or í", () => {
      expect(vowel_raise(false)("ped")("o")).to.equal("pid");
      expect(vowel_raise(false)("ped")("a")).to.equal("pid");
      expect(vowel_raise(false)("ped")("e")).to.equal("pid");
    });

    it("raise for dipthongizers when no dipthong is created and ending does not included ir or í", () => {
      expect(vowel_raise(true)("dorm")("amos")).to.equal("durm");
      expect(vowel_raise(true)("dorm")("iendo")).to.equal("durm");
      expect(vowel_raise(true)("dorm")("ieron")).to.equal("durm");
      expect(vowel_raise(true)("sent")("amos")).to.equal("sint");
      expect(vowel_raise(true)("sent")("iendo")).to.equal("sint");
      expect(vowel_raise(true)("sent")("ieron")).to.equal("sint");
    });

    it("not raise for dipthongizers when a dipthong is created when it otherwise would", () => {
      expect(vowel_raise(true)("dorm")("o")).to.equal("dorm");
      expect(vowel_raise(true)("dorm")("a")).to.equal("dorm");
      expect(vowel_raise(true)("dorm")("e")).to.equal("dorm");
      expect(vowel_raise(true)("sent")("o")).to.equal("sent");
      expect(vowel_raise(true)("sent")("a")).to.equal("sent");
      expect(vowel_raise(true)("sent")("e")).to.equal("sent");
    });

    it("not raise when the ending does not included ir or í (dipthong or not)", () => {
      expect(vowel_raise(true)("sent")("ido")).to.equal("sent");
      expect(vowel_raise(false)("sent")("ido")).to.equal("sent");
    });
  });
});
