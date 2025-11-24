import { getFlags } from "../common/TypeFlags";
import { calcLoveLanguages } from "../LoveLanguageService";
import { MBTI_TYPES } from "../../../domain/valueObjects/MBTIType";
import { LOVE_TYPES } from "../../../domain/valueObjects/LoveType";
import { LOVE_LANGUAGE_KEYS } from "../../../domain/valueObjects/LoveLanguage";

describe("LoveLanguageAlgorithm", () => {
  describe("calcLoveLanguages", () => {
    it("should calculate all 5 love languages for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLoveLanguages(flags);

      // 5つの愛情表現が計算されていることを確認
      expect(result.items).toHaveLength(5);

      // サマリーテキストが存在することを確認
      expect(result.summaryText).toBeTruthy();
      expect(result.summaryText.length).toBeGreaterThan(0);

      // 各アイテムが必須プロパティを持つことを確認
      result.items.forEach((item) => {
        expect(item.key).toBeTruthy();
        expect(item.label).toBeTruthy();
        expect(typeof item.score).toBe("number");
        expect(item.level).toMatch(/^S[1-5]$/);
        expect(item.rank).toBeGreaterThanOrEqual(1);
        expect(item.rank).toBeLessThanOrEqual(5);
        expect(item.text).toBeTruthy();
      });
    });

    it("should calculate correct scores for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      // ENFJはE=1, N=1, F=1, J=1
      // FAREはF=1, A=1, R=1, E=1
      // つまり flags = { E:1, I:0, N:1, S:0, Fm:1, Tm:0, J:1, Pm:0, L:0, Fl:1, C:0, A:1, R:1, Pl:0, O:0, El:1 }

      const result = calcLoveLanguages(flags);

      // words: 0.50 * Fm + 0.30 * N + 0.20 * El = 0.50 * 1 + 0.30 * 1 + 0.20 * 1 = 1.0 => 100
      const words = result.items.find((item) => item.key === "words");
      expect(words?.score).toBe(100);
      expect(words?.level).toBe("S5");

      // time: 0.45 * I + 0.25 * Fm + 0.20 * Fl + 0.10 * A = 0 + 0.25 + 0.20 + 0.10 = 0.55 => 55
      const time = result.items.find((item) => item.key === "time");
      expect(time?.score).toBeCloseTo(55, 5);
      expect(time?.level).toBe("S3");

      // gifts: 0.40 * N + 0.35 * J + 0.25 * El = 0.40 + 0.35 + 0.25 = 1.0 => 100
      const gifts = result.items.find((item) => item.key === "gifts");
      expect(gifts?.score).toBe(100);
      expect(gifts?.level).toBe("S5");

      // service: 0.40 * J + 0.35 * Tm + 0.25 * R = 0.40 + 0 + 0.25 = 0.65 => 65
      const service = result.items.find((item) => item.key === "service");
      expect(service?.score).toBe(65);
      expect(service?.level).toBe("S4");

      // touch: 0.55 * E + 0.25 * C + 0.20 * Pl = 0.55 + 0 + 0 = 0.55 => 55
      const touch = result.items.find((item) => item.key === "touch");
      expect(touch?.score).toBeCloseTo(55, 5);
      expect(touch?.level).toBe("S3");
    });

    it("should have items sorted by score (rank order)", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLoveLanguages(flags);

      // ランク順に並んでいることを確認
      for (let i = 0; i < result.items.length - 1; i++) {
        const current = result.items.find((item) => item.rank === i + 1);
        const next = result.items.find((item) => item.rank === i + 2);

        expect(current).toBeDefined();
        expect(next).toBeDefined();

        if (current && next) {
          expect(current.score).toBeGreaterThanOrEqual(next.score);
        }
      }
    });

    it("should have unique ranks from 1 to 5", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLoveLanguages(flags);

      const ranks = result.items.map((item) => item.rank).sort();
      expect(ranks).toEqual([1, 2, 3, 4, 5]);
    });

    it("should include all 5 love language keys", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLoveLanguages(flags);

      const keys = result.items.map((item) => item.key).sort();
      const expectedKeys = [...LOVE_LANGUAGE_KEYS].sort();
      expect(keys).toEqual(expectedKeys);
    });

    it("should calculate correct scores for INTJ + LCRO", () => {
      const flags = getFlags("INTJ", "LCRO");
      // INTJはI=1, N=1, T=1, J=1
      // LCROはL=1, C=1, R=1, O=1

      const result = calcLoveLanguages(flags);

      // words: 0.50 * Fm + 0.30 * N + 0.20 * El = 0 + 0.30 + 0 = 0.30 => 30
      const words = result.items.find((item) => item.key === "words");
      expect(words?.score).toBe(30);
      expect(words?.level).toBe("S2");

      // time: 0.45 * I + 0.25 * Fm + 0.20 * Fl + 0.10 * A = 0.45 + 0 + 0 + 0 = 0.45 => 45
      const time = result.items.find((item) => item.key === "time");
      expect(time?.score).toBe(45);
      expect(time?.level).toBe("S3");

      // gifts: 0.40 * N + 0.35 * J + 0.25 * El = 0.40 + 0.35 + 0 = 0.75 => 75
      const gifts = result.items.find((item) => item.key === "gifts");
      expect(gifts?.score).toBe(75);
      expect(gifts?.level).toBe("S4");

      // service: 0.40 * J + 0.35 * Tm + 0.25 * R = 0.40 + 0.35 + 0.25 = 1.0 => 100
      const service = result.items.find((item) => item.key === "service");
      expect(service?.score).toBe(100);
      expect(service?.level).toBe("S5");

      // touch: 0.55 * E + 0.25 * C + 0.20 * Pl = 0 + 0.25 + 0 = 0.25 => 25
      const touch = result.items.find((item) => item.key === "touch");
      expect(touch?.score).toBe(25);
      expect(touch?.level).toBe("S2");
    });

    it("should generate appropriate summary text mentioning top 2 languages", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLoveLanguages(flags);

      // Top2を取得
      const top1 = result.items.find((item) => item.rank === 1);
      const top2 = result.items.find((item) => item.rank === 2);

      expect(top1).toBeDefined();
      expect(top2).toBeDefined();

      if (top1 && top2) {
        // サマリーにTop1とTop2のラベルが含まれることを確認
        expect(result.summaryText).toContain(top1.label);
        expect(result.summaryText).toContain(top2.label);
      }
    });
  });

  describe("Comprehensive: All MBTI x LoveType combinations", () => {
    it("should successfully calculate love languages for all 256 combinations", () => {
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ mbti: string; loveType: string; error: string }> =
        [];

      // Test all 16 MBTI × 16 LoveType = 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          try {
            const flags = getFlags(mbti, loveType);
            const result = calcLoveLanguages(flags);

            // Validate structure
            expect(result).toHaveProperty("items");
            expect(result).toHaveProperty("summaryText");

            // Validate items has 5 love languages
            expect(result.items).toHaveLength(5);

            // Validate all items have required properties
            result.items.forEach((item) => {
              expect(item).toHaveProperty("key");
              expect(item).toHaveProperty("label");
              expect(item).toHaveProperty("score");
              expect(item).toHaveProperty("level");
              expect(item).toHaveProperty("rank");
              expect(item).toHaveProperty("text");

              // Validate score range
              expect(item.score).toBeGreaterThanOrEqual(0);
              expect(item.score).toBeLessThanOrEqual(100);

              // Validate level format
              expect(item.level).toMatch(/^S[1-5]$/);

              // Validate rank range
              expect(item.rank).toBeGreaterThanOrEqual(1);
              expect(item.rank).toBeLessThanOrEqual(5);

              // Validate text is non-empty
              expect(item.text.length).toBeGreaterThan(0);
            });

            // Validate summaryText is non-empty
            expect(result.summaryText.length).toBeGreaterThan(0);

            // Validate ranks are unique and complete
            const ranks = result.items.map((item) => item.rank).sort();
            expect(ranks).toEqual([1, 2, 3, 4, 5]);

            // Validate all 5 keys are present
            const keys = new Set(result.items.map((item) => item.key));
            LOVE_LANGUAGE_KEYS.forEach((key) => {
              expect(keys.has(key)).toBe(true);
            });

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

    it("should verify all 5 love language keys are always present", () => {
      // Test all 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLoveLanguages(flags);

          const itemKeys = result.items.map((item) => item.key);

          // All expected keys should be present
          LOVE_LANGUAGE_KEYS.forEach((expectedKey) => {
            expect(itemKeys).toContain(expectedKey);
          });

          // No extra keys should be present
          expect(itemKeys).toHaveLength(5);
        });
      });
    });

    it("should produce valid level distribution across all combinations", () => {
      const levelCountsByLanguage: Record<string, Record<string, number>> = {};

      // Initialize counters
      LOVE_LANGUAGE_KEYS.forEach((key) => {
        levelCountsByLanguage[key] = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0 };
      });

      // Collect level distributions
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLoveLanguages(flags);

          result.items.forEach((item) => {
            levelCountsByLanguage[item.key][item.level]++;
          });
        });
      });

      // Verify all 256 combinations were counted for each language
      LOVE_LANGUAGE_KEYS.forEach((key) => {
        const total = Object.values(levelCountsByLanguage[key]).reduce(
          (sum, count) => sum + count,
          0
        );
        expect(total).toBe(256);
      });

      console.log(
        "Level distribution by love language:",
        levelCountsByLanguage
      );
    });

    it("should verify score-to-level mapping consistency for all combinations", () => {
      // Test all 256 combinations to ensure score-to-level mapping is correct
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLoveLanguages(flags);

          // Helper function to verify score matches level (S5 scale)
          const verifyScoreLevel = (score: number, level: string) => {
            if (score >= 80) expect(level).toBe("S5");
            else if (score >= 60) expect(level).toBe("S4");
            else if (score >= 40) expect(level).toBe("S3");
            else if (score >= 20) expect(level).toBe("S2");
            else expect(level).toBe("S1");
          };

          // Verify all items
          result.items.forEach((item) => {
            verifyScoreLevel(item.score, item.level);
          });
        });
      });
    });

    it("should verify score ordering matches rank ordering", () => {
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLoveLanguages(flags);

          // Verify that ranks are assigned in descending score order
          for (let rank = 1; rank <= 4; rank++) {
            const currentItem = result.items.find((item) => item.rank === rank);
            const nextItem = result.items.find(
              (item) => item.rank === rank + 1
            );

            expect(currentItem).toBeDefined();
            expect(nextItem).toBeDefined();

            if (currentItem && nextItem) {
              expect(currentItem.score).toBeGreaterThanOrEqual(nextItem.score);
            }
          }
        });
      });
    });

    it("should produce diverse rank 1 languages across all types", () => {
      const rank1Languages = new Set<string>();

      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLoveLanguages(flags);

          const rank1Item = result.items.find((item) => item.rank === 1);
          if (rank1Item) {
            rank1Languages.add(rank1Item.key);
          }
        });
      });

      console.log(`Unique rank 1 love languages: ${rank1Languages.size}`);
      console.log(
        "Languages that appear as rank 1:",
        Array.from(rank1Languages)
      );

      // Should have multiple different rank 1 languages (not all the same)
      expect(rank1Languages.size).toBeGreaterThan(1);
    });

    it("should verify all language labels are correctly assigned", () => {
      const expectedLabels: Record<string, string> = {
        words: "言葉",
        time: "一緒に過ごす時間",
        gifts: "プレゼント",
        service: "サービス・行動",
        touch: "スキンシップ",
      };

      // Test with a sample combination
      const flags = getFlags("INFJ", "LCRO");
      const result = calcLoveLanguages(flags);

      result.items.forEach((item) => {
        expect(item.label).toBe(expectedLabels[item.key]);
      });
    });

    it("should verify composite score calculations", () => {
      // Test specific combinations to verify score calculations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLoveLanguages(flags);

          // words: 0.50 * Fm + 0.30 * N + 0.20 * El
          const words = result.items.find((item) => item.key === "words");
          const expectedWords = Math.min(
            100,
            (0.5 * flags.Fm + 0.3 * flags.N + 0.2 * flags.El) * 100
          );
          expect(words?.score).toBeCloseTo(expectedWords, 5);

          // time: 0.45 * I + 0.25 * Fm + 0.20 * Fl + 0.10 * A
          const time = result.items.find((item) => item.key === "time");
          const expectedTime = Math.min(
            100,
            (0.45 * flags.I +
              0.25 * flags.Fm +
              0.2 * flags.Fl +
              0.1 * flags.A) *
              100
          );
          expect(time?.score).toBeCloseTo(expectedTime, 5);

          // gifts: 0.40 * N + 0.35 * J + 0.25 * El
          const gifts = result.items.find((item) => item.key === "gifts");
          const expectedGifts = Math.min(
            100,
            (0.4 * flags.N + 0.35 * flags.J + 0.25 * flags.El) * 100
          );
          expect(gifts?.score).toBeCloseTo(expectedGifts, 5);

          // service: 0.40 * J + 0.35 * Tm + 0.25 * R
          const service = result.items.find((item) => item.key === "service");
          const expectedService = Math.min(
            100,
            (0.4 * flags.J + 0.35 * flags.Tm + 0.25 * flags.R) * 100
          );
          expect(service?.score).toBeCloseTo(expectedService, 5);

          // touch: 0.55 * E + 0.25 * C + 0.20 * Pl
          const touch = result.items.find((item) => item.key === "touch");
          const expectedTouch = Math.min(
            100,
            (0.55 * flags.E + 0.25 * flags.C + 0.2 * flags.Pl) * 100
          );
          expect(touch?.score).toBeCloseTo(expectedTouch, 5);
        });
      });
    });

    it("should verify all scores are within valid range", () => {
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLoveLanguages(flags);

          result.items.forEach((item) => {
            expect(item.score).toBeGreaterThanOrEqual(0);
            expect(item.score).toBeLessThanOrEqual(100);
          });
        });
      });
    });
  });
});
