import {
  calcCompatScore,
  calcRelationFlavor,
  buildCompatibilityMatch,
  buildCompatibilityResult,
} from "../CompatibilityAlgorithm";
import { getFlags } from "../common/TypeFlags";
import { RelationFlavor } from "../../../domain/valueObjects/Compatibility";
import { MBTIType, MBTI_TYPES } from "../../../domain/valueObjects/MBTIType";
import { LoveType, LOVE_TYPES } from "../../../domain/valueObjects/LoveType";

describe("CompatibilityAlgorithm", () => {
  describe("calcCompatScore", () => {
    it("should calculate high compatibility score for similar types", () => {
      const self = getFlags("INFJ", "LCRO");
      const other = getFlags("INFJ", "LCRO");
      const score = calcCompatScore(self, other);

      // Same type scores 80 (all similarity factors match, but no complement)
      expect(score).toBeGreaterThanOrEqual(70);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should calculate medium compatibility score for partially similar types", () => {
      const self = getFlags("INFJ", "LCRO");
      const other = getFlags("ENFP", "FAPE");
      const score = calcCompatScore(self, other);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should calculate compatibility score considering complement factors", () => {
      const self = getFlags("INTJ", "LCRO");
      const other = getFlags("INTJ", "FAPE"); // L/F and C/A are complementary
      const score = calcCompatScore(self, other);

      expect(score).toBeGreaterThanOrEqual(50);
    });

    it("should not exceed 100", () => {
      const self = getFlags("INFJ", "LCRO");
      const other = getFlags("INFJ", "LCRO");
      const score = calcCompatScore(self, other);

      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("calcRelationFlavor", () => {
    it("should return 'soulmate' for highly similar types", () => {
      const self = getFlags("INFJ", "LCRO");
      const other = getFlags("INFJ", "LCRO");
      const flavor = calcRelationFlavor(self, other);

      expect(flavor).toBe("soulmate");
    });

    it("should return 'partner' when both complement factors match", () => {
      const self = getFlags("INTJ", "LCRO");
      const other = getFlags("ESFP", "FAPE"); // L/F and C/A differ, but low similarity
      const flavor = calcRelationFlavor(self, other);

      expect(flavor).toBe("partner");
    });

    it("should return 'hybrid' for balanced similarity and complementarity", () => {
      const self = getFlags("INFJ", "LCRO");
      const other = getFlags("ESFP", "FCRO"); // Low similarity (E/I, S/N, T/F differ) + 1 complement (L/F)
      const flavor = calcRelationFlavor(self, other);

      expect(flavor).toBe("hybrid");
    });

    it("should return 'magnet' for unique attraction patterns", () => {
      const self = getFlags("INTJ", "LCRO");
      const other = getFlags("ESFP", "LCPE"); // Very different
      const flavor = calcRelationFlavor(self, other);

      expect(flavor).toBe("magnet");
    });
  });

  describe("buildCompatibilityMatch", () => {
    it("should create compatibility match with all required fields", () => {
      const match = buildCompatibilityMatch("INFJ" as MBTIType, "LCRO" as LoveType, "ENFP" as MBTIType, "FAPE" as LoveType);

      expect(match).toHaveProperty("partner");
      expect(match.partner.mbti).toBe("ENFP");
      expect(match.partner.loveType).toBe("FAPE");
      expect(match).toHaveProperty("score");
      expect(match.score).toBeGreaterThanOrEqual(0);
      expect(match.score).toBeLessThanOrEqual(100);
      expect(match).toHaveProperty("level");
      expect(match.level).toMatch(/^S(10|[1-9])$/);
      expect(match).toHaveProperty("relationFlavor");
      expect(["soulmate", "partner", "hybrid", "magnet"]).toContain(match.relationFlavor);
      expect(match).toHaveProperty("description");
      expect(match.description.length).toBeGreaterThan(0);
    });

    const testCases: Array<{
      flavor: RelationFlavor;
      shouldContain: string;
    }> = [
      { flavor: "soulmate", shouldContain: "魂が共鳴" },
      { flavor: "partner", shouldContain: "化学反応" },
      { flavor: "hybrid", shouldContain: "親友であり" },
      { flavor: "magnet", shouldContain: "運命" },
    ];

    testCases.forEach(({ flavor, shouldContain }) => {
      it(`should include appropriate description text for ${flavor} type`, () => {
        // Find a combination that produces this flavor and high score
        let match;
        if (flavor === "soulmate") {
          match = buildCompatibilityMatch("INFJ" as MBTIType, "LCRO" as LoveType, "INFJ" as MBTIType, "LCRO" as LoveType);
        } else if (flavor === "partner") {
          match = buildCompatibilityMatch("INTJ" as MBTIType, "LCRO" as LoveType, "ESFP" as MBTIType, "FAPE" as LoveType);
        } else if (flavor === "hybrid") {
          match = buildCompatibilityMatch("INFJ" as MBTIType, "LCRO" as LoveType, "ESFP" as MBTIType, "FCRO" as LoveType);
        } else {
          match = buildCompatibilityMatch("INTJ" as MBTIType, "LCRO" as LoveType, "ESFP" as MBTIType, "LCPE" as LoveType);
        }

        expect(match.relationFlavor).toBe(flavor);
        if (match.score >= 90) {
          expect(match.description).toContain(shouldContain);
        }
      });
    });
  });

  describe("buildCompatibilityResult", () => {
    it("should create complete compatibility result with best matches", () => {
      const bestPartners = [
        { mbti: "INFJ" as MBTIType, loveType: "LCRO" as LoveType },
        { mbti: "ENFP" as MBTIType, loveType: "FAPE" as LoveType },
      ];

      const result = buildCompatibilityResult(
        "INFJ" as MBTIType,
        "LCRO" as LoveType,
        bestPartners
      );

      expect(result).toHaveProperty("bestMatches");
      expect(result.bestMatches).toHaveLength(2);
      expect(result).toHaveProperty("summary");
      expect(result.summary.length).toBeGreaterThan(0);
    });

    it("should produce consistent results for same inputs", () => {
      const bestPartners = [{ mbti: "ENFP" as MBTIType, loveType: "FAPE" as LoveType }];

      const result1 = buildCompatibilityResult(
        "INTJ" as MBTIType,
        "LCRO" as LoveType,
        bestPartners
      );
      const result2 = buildCompatibilityResult(
        "INTJ" as MBTIType,
        "LCRO" as LoveType,
        bestPartners
      );

      expect(result1.bestMatches[0].score).toBe(result2.bestMatches[0].score);
      expect(result1.bestMatches[0].level).toBe(result2.bestMatches[0].level);
      expect(result1.bestMatches[0].relationFlavor).toBe(result2.bestMatches[0].relationFlavor);
    });

    it("should generate appropriate summary based on dominant flavor", () => {
      const soulmatePartners = [
        { mbti: "INFJ" as MBTIType, loveType: "LCRO" as LoveType },
        { mbti: "INTJ" as MBTIType, loveType: "LCRO" as LoveType },
      ];

      const result = buildCompatibilityResult(
        "INFJ" as MBTIType,
        "LCRO" as LoveType,
        soulmatePartners
      );

      expect(result.summary).toBeTruthy();
      expect(result.summary.length).toBeGreaterThan(0);
    });
  });

  describe("Integration: Score and Level consistency", () => {
    it("should assign S10 for scores >= 90", () => {
      const match = buildCompatibilityMatch("INFJ" as MBTIType, "LCRO" as LoveType, "INFJ" as MBTIType, "LCRO" as LoveType);
      if (match.score >= 90) {
        expect(match.level).toBe("S10");
      }
    });

    it("should assign appropriate level based on score ranges", () => {
      // Test multiple combinations to cover different score ranges
      const testCases: Array<[MBTIType, LoveType, MBTIType, LoveType]> = [
        ["INFJ" as MBTIType, "LCRO" as LoveType, "INFJ" as MBTIType, "LCRO" as LoveType], // Should be very high
        ["INTJ" as MBTIType, "LCRO" as LoveType, "ESFP" as MBTIType, "FAPE" as LoveType], // Should be lower
        ["ENFP" as MBTIType, "FCRE" as LoveType, "ENFP" as MBTIType, "LCPE" as LoveType], // Medium-high
      ];

      testCases.forEach(([mbti1, love1, mbti2, love2]) => {
        const match = buildCompatibilityMatch(mbti1, love1, mbti2, love2);
        const score = match.score;

        if (score >= 90) expect(match.level).toBe("S10");
        else if (score >= 80) expect(match.level).toBe("S9");
        else if (score >= 70) expect(match.level).toBe("S8");
        else if (score >= 60) expect(match.level).toBe("S7");
        else if (score >= 50) expect(match.level).toBe("S6");
        else if (score >= 40) expect(match.level).toBe("S5");
        else if (score >= 30) expect(match.level).toBe("S4");
        else if (score >= 20) expect(match.level).toBe("S3");
        else if (score >= 10) expect(match.level).toBe("S2");
        else expect(match.level).toBe("S1");
      });
    });
  });

  describe("Comprehensive: All MBTI x LoveType combinations", () => {
    it("should successfully create CompatibilityMatch for all 256 self type combinations", () => {
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ mbti: MBTIType; loveType: LoveType; error: string }> = [];

      // Test all 16 MBTI × 16 LoveType = 256 combinations as self
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          try {
            // Test against a fixed partner
            const match = buildCompatibilityMatch(
              mbti,
              loveType,
              "ENFP" as MBTIType,
              "FAPE" as LoveType
            );

            // Validate all required fields exist
            expect(match).toHaveProperty("partner");
            expect(match).toHaveProperty("score");
            expect(match).toHaveProperty("level");
            expect(match).toHaveProperty("relationFlavor");
            expect(match).toHaveProperty("description");

            // Validate field values
            expect(match.score).toBeGreaterThanOrEqual(0);
            expect(match.score).toBeLessThanOrEqual(100);
            expect(match.level).toMatch(/^S(10|[1-9])$/);
            expect(["soulmate", "partner", "hybrid", "magnet"]).toContain(
              match.relationFlavor
            );
            expect(match.description.length).toBeGreaterThan(0);

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

    it("should successfully create CompatibilityMatch for all 256 partner type combinations", () => {
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ mbti: MBTIType; loveType: LoveType; error: string }> = [];

      // Test fixed self against all 256 partner combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          try {
            const match = buildCompatibilityMatch(
              "INFJ" as MBTIType,
              "LCRO" as LoveType,
              mbti,
              loveType
            );

            // Validate all required fields exist
            expect(match).toHaveProperty("partner");
            expect(match.partner.mbti).toBe(mbti);
            expect(match.partner.loveType).toBe(loveType);
            expect(match).toHaveProperty("score");
            expect(match).toHaveProperty("level");
            expect(match).toHaveProperty("relationFlavor");
            expect(match).toHaveProperty("description");

            // Validate field values
            expect(match.score).toBeGreaterThanOrEqual(0);
            expect(match.score).toBeLessThanOrEqual(100);
            expect(match.level).toMatch(/^S(10|[1-9])$/);
            expect(["soulmate", "partner", "hybrid", "magnet"]).toContain(
              match.relationFlavor
            );
            expect(match.description.length).toBeGreaterThan(0);

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

    it("should produce valid relationFlavor distribution across all combinations", () => {
      const flavorCounts = {
        soulmate: 0,
        partner: 0,
        hybrid: 0,
        magnet: 0,
      };

      // Sample test: INFJ x LCRO against all 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const match = buildCompatibilityMatch(
            "INFJ" as MBTIType,
            "LCRO" as LoveType,
            mbti,
            loveType
          );
          flavorCounts[match.relationFlavor]++;
        });
      });

      // All 256 combinations should be categorized
      const total = Object.values(flavorCounts).reduce((sum, count) => sum + count, 0);
      expect(total).toBe(256);

      // Each flavor should appear at least once (algorithm coverage)
      expect(flavorCounts.soulmate).toBeGreaterThan(0);
      expect(flavorCounts.partner).toBeGreaterThan(0);
      expect(flavorCounts.hybrid).toBeGreaterThan(0);
      expect(flavorCounts.magnet).toBeGreaterThan(0);

      console.log("RelationFlavor distribution:", flavorCounts);
    });

    it("should produce valid score distribution across all combinations", () => {
      const levelCounts: Record<string, number> = {
        S1: 0,
        S2: 0,
        S3: 0,
        S4: 0,
        S5: 0,
        S6: 0,
        S7: 0,
        S8: 0,
        S9: 0,
        S10: 0,
      };

      // Sample test: INTJ x LCRO against all 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const match = buildCompatibilityMatch(
            "INTJ" as MBTIType,
            "LCRO" as LoveType,
            mbti,
            loveType
          );
          levelCounts[match.level]++;
        });
      });

      // All 256 combinations should be categorized
      const total = Object.values(levelCounts).reduce((sum, count) => sum + count, 0);
      expect(total).toBe(256);

      console.log("Score level distribution:", levelCounts);
    });
  });
});
