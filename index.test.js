const { expect } = require("chai");
const { ortho_correct } = require("./ortho_correct");

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
      expect(ortho_correct("leer")("imos")).to.equal("leímos");
      expect(ortho_correct("oír")("imos")).to.equal("oímos");
    });
  });
});
