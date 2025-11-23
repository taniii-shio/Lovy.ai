import { getFlags } from "../common/TypeFlags";
import {
  calcAttractivenessScores,
  buildAttractivenessResult,
} from "../PopularityAlgorithm";

describe("PopularityAlgorithm", () => {
  describe("calcAttractivenessScores", () => {
    it("should calculate scores for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      const scores = calcAttractivenessScores(flags);

      // ENFJはE=1, N=1, F=1, J=1
      // FAREはF=1, A=1, R=1, E=1
      // つまり flags = { E:1, I:0, N:1, S:0, Fm:1, Tm:0, J:1, Pm:0, L:0, Fl:1, C:0, A:1, R:1, Pl:0, O:0, El:1 }

      // chance = 0.35*E + 0.20*L + 0.15*O + 0.15*J + 0.15*Pm = 0.35*1 + 0.20*0 + 0.15*0 + 0.15*1 + 0.15*0 = 0.50 → 50
      expect(scores.chance).toBe(50);

      // firstImpression = 0.25*E + 0.25*Fm + 0.20*C + 0.20*Pl + 0.10*N = 0.25*1 + 0.25*1 + 0.20*0 + 0.20*0 + 0.10*1 = 0.60 → 60
      expect(scores.firstImpression).toBe(60);

      // lastingLikeability = 0.30*El + 0.25*R + 0.20*Fm + 0.15*J + 0.10*I = 0.30*1 + 0.25*1 + 0.20*1 + 0.15*1 + 0.10*0 = 0.90 → 90
      expect(scores.lastingLikeability).toBe(90);

      // totalScore = (50 + 60 + 90) / 3 = 66.67
      expect(scores.totalScore).toBeCloseTo(66.67, 1);
    });

    it("should calculate scores for INTJ + LCRO", () => {
      const flags = getFlags("INTJ", "LCRO");
      const scores = calcAttractivenessScores(flags);

      // INTJはI=1, N=1, T=1, J=1
      // LCROはL=1, C=1, R=1, O=1
      // つまり flags = { E:0, I:1, N:1, S:0, Fm:0, Tm:1, J:1, Pm:0, L:1, Fl:0, C:1, A:0, R:1, Pl:0, O:1, El:0 }

      // chance = 0.35*E + 0.20*L + 0.15*O + 0.15*J + 0.15*Pm = 0.35*0 + 0.20*1 + 0.15*1 + 0.15*1 + 0.15*0 = 0.50 → 50
      expect(scores.chance).toBeCloseTo(50, 1);

      // firstImpression = 0.25*E + 0.25*Fm + 0.20*C + 0.20*Pl + 0.10*N = 0.25*0 + 0.25*0 + 0.20*1 + 0.20*0 + 0.10*1 = 0.30 → 30
      expect(scores.firstImpression).toBeCloseTo(30, 1);

      // lastingLikeability = 0.30*El + 0.25*R + 0.20*Fm + 0.15*J + 0.10*I = 0.30*0 + 0.25*1 + 0.20*0 + 0.15*1 + 0.10*1 = 0.50 → 50
      expect(scores.lastingLikeability).toBeCloseTo(50, 1);

      // totalScore = (50 + 30 + 50) / 3 = 43.33
      expect(scores.totalScore).toBeCloseTo(43.33, 1);
    });
  });

  describe("buildAttractivenessResult", () => {
    it("should build complete result with texts for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = buildAttractivenessResult(flags);

      expect(result.scores.totalScore).toBeCloseTo(66.67, 1);
      expect(result.scores.chance).toBe(50);
      expect(result.scores.firstImpression).toBe(60);
      expect(result.scores.lastingLikeability).toBe(90);

      expect(result.levels.chance).toBe("S6");
      expect(result.levels.firstImpression).toBe("S7");
      expect(result.levels.lastingLikeability).toBe("S10");

      expect(result.texts.chance).toContain("気分次第の行動派");
      expect(result.texts.firstImpression).toContain("安心感の塊");
      expect(result.texts.lastingLikeability).toContain("もはや沼");
      expect(result.texts.summary).toContain("出会いの多さについては、");
      expect(result.texts.summary).toContain("初対面では、");
      expect(result.texts.summary).toContain("そして長く付き合うと、");
    });

    it("should build complete result with texts for ISTP + FAPO", () => {
      const flags = getFlags("ISTP", "FAPO");
      const result = buildAttractivenessResult(flags);

      // ISTPはI=1, S=1, T=1, P=1
      // FAPOはF=1, A=1, P=1, O=1
      // flags = { E:0, I:1, N:0, S:1, Fm:0, Tm:1, J:0, Pm:1, L:0, Fl:1, C:0, A:1, R:0, Pl:1, O:1, El:0 }

      // chance = 0.35*E + 0.20*L + 0.15*O + 0.15*J + 0.15*Pm = 0.35*0 + 0.20*0 + 0.15*1 + 0.15*0 + 0.15*1 = 0.30 → 30
      expect(result.scores.chance).toBe(30);
      expect(result.levels.chance).toBe("S4");

      // firstImpression = 0.25*E + 0.25*Fm + 0.20*C + 0.20*Pl + 0.10*N = 0.25*0 + 0.25*0 + 0.20*0 + 0.20*1 + 0.10*0 = 0.20 → 20
      expect(result.scores.firstImpression).toBe(20);
      expect(result.levels.firstImpression).toBe("S3");

      // lastingLikeability = 0.30*El + 0.25*R + 0.20*Fm + 0.15*J + 0.10*I = 0.30*0 + 0.25*0 + 0.20*0 + 0.15*0 + 0.10*1 = 0.10 → 10
      expect(result.scores.lastingLikeability).toBe(10);
      expect(result.levels.lastingLikeability).toBe("S2");

      // totalScore = (30 + 20 + 10) / 3 = 20
      expect(result.scores.totalScore).toBe(20);
    });
  });
});
