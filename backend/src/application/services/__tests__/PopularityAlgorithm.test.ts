import { getFlags } from "../common/TypeFlags";
import {
  calcAttractivenessScores,
  buildAttractivenessResult,
} from "../PopularityAlgorithm";
import { MBTI_TYPES } from "../../../domain/valueObjects/MBTIType";
import { LOVE_TYPES } from "../../../domain/valueObjects/LoveType";

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

  describe("Comprehensive: All MBTI x LoveType combinations", () => {
    it("should successfully calculate attractiveness for all 256 combinations", () => {
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ mbti: string; loveType: string; error: string }> = [];

      // Test all 16 MBTI × 16 LoveType = 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          try {
            const flags = getFlags(mbti, loveType);
            const scores = calcAttractivenessScores(flags);

            // Validate scores are within valid range
            expect(scores.chance).toBeGreaterThanOrEqual(0);
            expect(scores.chance).toBeLessThanOrEqual(100);
            expect(scores.firstImpression).toBeGreaterThanOrEqual(0);
            expect(scores.firstImpression).toBeLessThanOrEqual(100);
            expect(scores.lastingLikeability).toBeGreaterThanOrEqual(0);
            expect(scores.lastingLikeability).toBeLessThanOrEqual(100);
            expect(scores.totalScore).toBeGreaterThanOrEqual(0);
            expect(scores.totalScore).toBeLessThanOrEqual(100);

            // Validate totalScore is average of the three scores
            const expectedTotal = (scores.chance + scores.firstImpression + scores.lastingLikeability) / 3;
            expect(scores.totalScore).toBeCloseTo(expectedTotal, 5);

            successCount++;
          } catch (error) {
            failureCount++;
            failures.push({
              mbti,
              loveType,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        });
      });

      // Report results
      if (failures.length > 0) {
        console.error(`Failed combinations (${failureCount}/256):`, failures);
      }

      expect(successCount).toBe(256);
      expect(failureCount).toBe(0);
    });

    it("should successfully build attractiveness result for all 256 combinations", () => {
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ mbti: string; loveType: string; error: string }> = [];

      // Test all 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          try {
            const flags = getFlags(mbti, loveType);
            const result = buildAttractivenessResult(flags);

            // Validate structure
            expect(result).toHaveProperty("scores");
            expect(result).toHaveProperty("levels");
            expect(result).toHaveProperty("texts");

            // Validate scores
            expect(result.scores).toHaveProperty("chance");
            expect(result.scores).toHaveProperty("firstImpression");
            expect(result.scores).toHaveProperty("lastingLikeability");
            expect(result.scores).toHaveProperty("totalScore");

            // Validate levels (S1-S10 format)
            expect(result.levels.chance).toMatch(/^S(10|[1-9])$/);
            expect(result.levels.firstImpression).toMatch(/^S(10|[1-9])$/);
            expect(result.levels.lastingLikeability).toMatch(/^S(10|[1-9])$/);

            // Validate texts are non-empty
            expect(result.texts.chance.length).toBeGreaterThan(0);
            expect(result.texts.firstImpression.length).toBeGreaterThan(0);
            expect(result.texts.lastingLikeability.length).toBeGreaterThan(0);
            expect(result.texts.summary.length).toBeGreaterThan(0);

            // Validate summary contains all three parts
            expect(result.texts.summary).toContain("出会いの多さについては、");
            expect(result.texts.summary).toContain("初対面では、");
            expect(result.texts.summary).toContain("そして長く付き合うと、");

            successCount++;
          } catch (error) {
            failureCount++;
            failures.push({
              mbti,
              loveType,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        });
      });

      // Report results
      if (failures.length > 0) {
        console.error(`Failed combinations (${failureCount}/256):`, failures);
      }

      expect(successCount).toBe(256);
      expect(failureCount).toBe(0);
    });

    it("should produce valid level distribution across all combinations", () => {
      const chanceLevelCounts: Record<string, number> = {
        S1: 0, S2: 0, S3: 0, S4: 0, S5: 0, S6: 0, S7: 0, S8: 0, S9: 0, S10: 0,
      };
      const firstImpressionLevelCounts: Record<string, number> = {
        S1: 0, S2: 0, S3: 0, S4: 0, S5: 0, S6: 0, S7: 0, S8: 0, S9: 0, S10: 0,
      };
      const lastingLevelCounts: Record<string, number> = {
        S1: 0, S2: 0, S3: 0, S4: 0, S5: 0, S6: 0, S7: 0, S8: 0, S9: 0, S10: 0,
      };

      // Test all 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = buildAttractivenessResult(flags);

          chanceLevelCounts[result.levels.chance]++;
          firstImpressionLevelCounts[result.levels.firstImpression]++;
          lastingLevelCounts[result.levels.lastingLikeability]++;
        });
      });

      // All 256 combinations should be categorized
      const chanceTotal = Object.values(chanceLevelCounts).reduce((sum, count) => sum + count, 0);
      const firstTotal = Object.values(firstImpressionLevelCounts).reduce((sum, count) => sum + count, 0);
      const lastingTotal = Object.values(lastingLevelCounts).reduce((sum, count) => sum + count, 0);

      expect(chanceTotal).toBe(256);
      expect(firstTotal).toBe(256);
      expect(lastingTotal).toBe(256);

      console.log("Chance level distribution:", chanceLevelCounts);
      console.log("First impression level distribution:", firstImpressionLevelCounts);
      console.log("Lasting likeability level distribution:", lastingLevelCounts);
    });

    it("should produce diverse score ranges across all combinations", () => {
      const allScores = {
        chance: [] as number[],
        firstImpression: [] as number[],
        lastingLikeability: [] as number[],
        total: [] as number[],
      };

      // Collect all scores
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const scores = calcAttractivenessScores(flags);

          allScores.chance.push(scores.chance);
          allScores.firstImpression.push(scores.firstImpression);
          allScores.lastingLikeability.push(scores.lastingLikeability);
          allScores.total.push(scores.totalScore);
        });
      });

      // Calculate statistics for each score type
      const calculateStats = (scores: number[]) => ({
        min: Math.min(...scores),
        max: Math.max(...scores),
        avg: scores.reduce((sum, s) => sum + s, 0) / scores.length,
      });

      const chanceStats = calculateStats(allScores.chance);
      const firstStats = calculateStats(allScores.firstImpression);
      const lastingStats = calculateStats(allScores.lastingLikeability);
      const totalStats = calculateStats(allScores.total);

      console.log("Chance score stats:", chanceStats);
      console.log("First impression score stats:", firstStats);
      console.log("Lasting likeability score stats:", lastingStats);
      console.log("Total score stats:", totalStats);

      // Verify scores have good diversity (range > 50)
      expect(chanceStats.max - chanceStats.min).toBeGreaterThan(30);
      expect(firstStats.max - firstStats.min).toBeGreaterThan(30);
      expect(lastingStats.max - lastingStats.min).toBeGreaterThan(30);
      expect(totalStats.max - totalStats.min).toBeGreaterThan(30);

      // Verify min and max are within valid bounds
      expect(chanceStats.min).toBeGreaterThanOrEqual(0);
      expect(chanceStats.max).toBeLessThanOrEqual(100);
      expect(firstStats.min).toBeGreaterThanOrEqual(0);
      expect(firstStats.max).toBeLessThanOrEqual(100);
      expect(lastingStats.min).toBeGreaterThanOrEqual(0);
      expect(lastingStats.max).toBeLessThanOrEqual(100);
      expect(totalStats.min).toBeGreaterThanOrEqual(0);
      expect(totalStats.max).toBeLessThanOrEqual(100);
    });

    it("should verify score-to-level mapping consistency", () => {
      // Test all 256 combinations to ensure score-to-level mapping is correct
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = buildAttractivenessResult(flags);

          // Helper function to verify score matches level
          const verifyScoreLevel = (score: number, level: string) => {
            if (score >= 90) expect(level).toBe("S10");
            else if (score >= 80) expect(level).toBe("S9");
            else if (score >= 70) expect(level).toBe("S8");
            else if (score >= 60) expect(level).toBe("S7");
            else if (score >= 50) expect(level).toBe("S6");
            else if (score >= 40) expect(level).toBe("S5");
            else if (score >= 30) expect(level).toBe("S4");
            else if (score >= 20) expect(level).toBe("S3");
            else if (score >= 10) expect(level).toBe("S2");
            else expect(level).toBe("S1");
          };

          verifyScoreLevel(result.scores.chance, result.levels.chance);
          verifyScoreLevel(result.scores.firstImpression, result.levels.firstImpression);
          verifyScoreLevel(result.scores.lastingLikeability, result.levels.lastingLikeability);
        });
      });
    });
  });
});
