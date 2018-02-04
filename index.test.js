const { expect } = require("chai");
const { ortho_correct } = require("./ortho_correct");
const { dipthongize } = require("./stem_vowel_change");

describe("ortho_correct", () => {
  describe("stem change", () => {
    it("-ar verbs", () => {
      expect(ortho_correct("tocar")("emos")).to.equal("toquemos");
      expect(ortho_correct("tocar")("é")).to.equal("toqué");
      expect(ortho_correct("gozar")("emos")).to.equal("gocemos");
      expect(ortho_correct("negar")("emos")).to.equal("neguemos");
      expect(ortho_correct("averiguar")("emos")).to.equal("averigüemos");
    });

    it("-[ei]r verbs", () => {
      expect(ortho_correct("delinquir")("amos")).to.equal("delincamos");
      expect(ortho_correct("vencer")("o")).to.equal("venzo");
      expect(ortho_correct("proteger")("amos")).to.equal("protejamos");
      expect(ortho_correct("distinguir")("amos")).to.equal("distingamos");
    });
  });

  describe("no stem change", () => {
    it("-ar verbs", () => {
      expect(ortho_correct("averiguar")("amos")).to.equal("averiguamos");
      expect(ortho_correct("hablar")("emos")).to.equal("hablemos");
    });

    it("-[ei]r verbs", () => {
      expect(ortho_correct("distinguir")("emos")).to.equal("distinguemos");
      expect(ortho_correct("distinguir")("é")).to.equal("distingué");
      expect(ortho_correct("distinguir")("ía")).to.equal("distinguía");
      expect(ortho_correct("correr")("amos")).to.equal("corramos");
    });
  });

  describe("impossible cases that would stem change", () => {
    it("-ar verbs", () => {
      expect(ortho_correct("tocar")("i")).to.equal("toqui");
      expect(ortho_correct("tocar")("í")).to.equal("toquí");
    });

    it("-[ei]r verbs", () => {
      expect(ortho_correct("vencer")("á")).to.equal("venzá");
    });
  });

  describe("ending change", () => {
    it("should accent the i when stressed", () => {
      expect(ortho_correct("caer")("imos")).to.equal("caímos");
      expect(ortho_correct("caer")("iste")).to.equal("caíste");
      expect(ortho_correct("leer")("imos")).to.equal("leímos");
      expect(ortho_correct("oír")("imos")).to.equal("oímos");
    });

    it("should remove accents in monosyllabic forms", () => {
      expect(ortho_correct("liar")("é")).to.equal("lie");
      expect(ortho_correct("liar")("ó")).to.equal("lio");
      expect(ortho_correct("ver")("í")).to.equal("vi");
      expect(ortho_correct("ver")("ío")).to.equal("vio");
    });

    it("should replace an i between vowels with a y", () => {
      expect(ortho_correct("caer")("ió")).to.equal("cayó");
      expect(ortho_correct("caer")("ieron")).to.equal("cayeron");
    });

    it("should drop an i between ll or ñ and a vowel", () => {
      expect(ortho_correct("bullir")("ió")).to.equal("bulló");
      expect(ortho_correct("tañer")("ió")).to.equal("tañó");
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
});
