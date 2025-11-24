import { getFlags } from "../common/TypeFlags";
import { calcLifeAllocation } from "../LifeAllocationService";
import { MBTI_TYPES } from "../../../domain/valueObjects/MBTIType";
import { LOVE_TYPES } from "../../../domain/valueObjects/LoveType";
import { LIFE_ALLOCATION_KEYS } from "../../../domain/valueObjects/LifeAllocation";

describe("LifeAllocationAlgorithm", () => {
  describe("calcLifeAllocation", () => {
    it("should calculate all 5 life allocations for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLifeAllocation(flags);

      // 5つの人生配分が計算されていることを確認
      expect(result.items).toHaveLength(5);

      // サマリーテキストが存在することを確認
      expect(result.summaryText).toBeTruthy();
      expect(result.summaryText.length).toBeGreaterThan(0);

      // 各アイテムが必須プロパティを持つことを確認
      result.items.forEach((item) => {
        expect(item.key).toBeTruthy();
        expect(item.label).toBeTruthy();
        expect(typeof item.percent).toBe("number");
        expect(item.level).toMatch(/^S[1-5]$/);
        expect(item.text).toBeTruthy();
      });
    });

    it("should calculate correct percentages for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      // ENFJはE=1, N=1, F=1, J=1
      // FAREはF=1, A=1, R=1, E=1
      // つまり flags = { E:1, I:0, N:1, S:0, Fm:1, Tm:0, J:1, Pm:0, L:0, Fl:1, C:0, A:1, R:1, Pl:0, O:0, El:1 }

      const result = calcLifeAllocation(flags);

      // rawPartner = 0.35 * Fm + 0.25 * N + 0.20 * C + 0.15 * A + 0.05 * Pl
      //             = 0.35 * 1 + 0.25 * 1 + 0.20 * 0 + 0.15 * 1 + 0.05 * 0 = 0.75
      // rawWork    = 0.40 * J + 0.30 * Tm + 0.20 * R + 0.10 * El
      //             = 0.40 * 1 + 0.30 * 0 + 0.20 * 1 + 0.10 * 1 = 0.70
      // rawFriends = 0.50 * E + 0.30 * N + 0.20 * O
      //             = 0.50 * 1 + 0.30 * 1 + 0.20 * 0 = 0.80
      // rawFamily  = 0.35 * Fm + 0.35 * J + 0.30 * El
      //             = 0.35 * 1 + 0.35 * 1 + 0.30 * 1 = 1.00
      // rawHobbies = 0.35 * I + 0.35 * N + 0.20 * Pm + 0.10 * O
      //             = 0.35 * 0 + 0.35 * 1 + 0.20 * 0 + 0.10 * 0 = 0.35
      // sumRaw = 0.75 + 0.70 + 0.80 + 1.00 + 0.35 = 3.60

      const partner = result.items.find((item) => item.key === "partner");
      expect(partner?.percent).toBeCloseTo((0.75 / 3.6) * 100, 1);

      const work = result.items.find((item) => item.key === "work");
      expect(work?.percent).toBeCloseTo((0.7 / 3.6) * 100, 1);

      const friends = result.items.find((item) => item.key === "friends");
      expect(friends?.percent).toBeCloseTo((0.8 / 3.6) * 100, 1);

      const family = result.items.find((item) => item.key === "family");
      expect(family?.percent).toBeCloseTo((1.0 / 3.6) * 100, 1);
      // family が最も高いので S3 になるはず (27.8%)
      expect(family?.level).toBe("S3");

      const hobbies = result.items.find((item) => item.key === "hobbies");
      expect(hobbies?.percent).toBeCloseTo((0.35 / 3.6) * 100, 1);
    });

    it("should have items sorted by percent (descending order)", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLifeAllocation(flags);

      // パーセンテージの降順に並んでいることを確認
      for (let i = 0; i < result.items.length - 1; i++) {
        expect(result.items[i].percent).toBeGreaterThanOrEqual(
          result.items[i + 1].percent
        );
      }
    });

    it("should have percentages sum to ~100%", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLifeAllocation(flags);

      const totalPercent = result.items.reduce(
        (sum, item) => sum + item.percent,
        0
      );
      expect(totalPercent).toBeCloseTo(100, 0);
    });

    it("should include all 5 life allocation keys", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLifeAllocation(flags);

      const keys = result.items.map((item) => item.key).sort();
      const expectedKeys = [...LIFE_ALLOCATION_KEYS].sort();
      expect(keys).toEqual(expectedKeys);
    });

    it("should calculate correct percentages for INTJ + LCRO", () => {
      const flags = getFlags("INTJ", "LCRO");
      // INTJはI=1, N=1, T=1, J=1
      // LCROはL=1, C=1, R=1, O=1

      const result = calcLifeAllocation(flags);

      // rawPartner = 0.35 * Fm + 0.25 * N + 0.20 * C + 0.15 * A + 0.05 * Pl
      //             = 0.35 * 0 + 0.25 * 1 + 0.20 * 1 + 0.15 * 0 + 0.05 * 0 = 0.45
      // rawWork    = 0.40 * J + 0.30 * Tm + 0.20 * R + 0.10 * El
      //             = 0.40 * 1 + 0.30 * 1 + 0.20 * 1 + 0.10 * 0 = 0.90
      // rawFriends = 0.50 * E + 0.30 * N + 0.20 * O
      //             = 0.50 * 0 + 0.30 * 1 + 0.20 * 1 = 0.50
      // rawFamily  = 0.35 * Fm + 0.35 * J + 0.30 * El
      //             = 0.35 * 0 + 0.35 * 1 + 0.30 * 0 = 0.35
      // rawHobbies = 0.35 * I + 0.35 * N + 0.20 * Pm + 0.10 * O
      //             = 0.35 * 1 + 0.35 * 1 + 0.20 * 0 + 0.10 * 1 = 0.80
      // sumRaw = 0.45 + 0.90 + 0.50 + 0.35 + 0.80 = 3.00

      const partner = result.items.find((item) => item.key === "partner");
      expect(partner?.percent).toBeCloseTo((0.45 / 3.0) * 100, 1);

      const work = result.items.find((item) => item.key === "work");
      expect(work?.percent).toBeCloseTo((0.9 / 3.0) * 100, 1);
      // work が最も高いので S3 になるはず (30%)
      expect(work?.level).toBe("S3");

      const friends = result.items.find((item) => item.key === "friends");
      expect(friends?.percent).toBeCloseTo((0.5 / 3.0) * 100, 1);

      const family = result.items.find((item) => item.key === "family");
      expect(family?.percent).toBeCloseTo((0.35 / 3.0) * 100, 1);

      const hobbies = result.items.find((item) => item.key === "hobbies");
      expect(hobbies?.percent).toBeCloseTo((0.8 / 3.0) * 100, 1);
    });

    it("should generate appropriate summary text mentioning top 2 allocations", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcLifeAllocation(flags);

      // Top2を取得
      const top1 = result.items[0];
      const top2 = result.items[1];

      expect(top1).toBeDefined();
      expect(top2).toBeDefined();

      // サマリーにTop1とTop2のラベルが含まれることを確認
      expect(result.summaryText).toContain(top1.label);
      expect(result.summaryText).toContain(top2.label);
    });
  });

  describe("Comprehensive: All MBTI x LoveType combinations", () => {
    it("should successfully calculate life allocations for all 256 combinations", () => {
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ mbti: string; loveType: string; error: string }> =
        [];

      // Test all 16 MBTI × 16 LoveType = 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          try {
            const flags = getFlags(mbti, loveType);
            const result = calcLifeAllocation(flags);

            // Validate structure
            expect(result).toHaveProperty("items");
            expect(result).toHaveProperty("summaryText");

            // Validate items has 5 life allocations
            expect(result.items).toHaveLength(5);

            // Validate all items have required properties
            result.items.forEach((item) => {
              expect(item).toHaveProperty("key");
              expect(item).toHaveProperty("label");
              expect(item).toHaveProperty("percent");
              expect(item).toHaveProperty("level");
              expect(item).toHaveProperty("text");

              // Validate percent range
              expect(item.percent).toBeGreaterThanOrEqual(0);
              expect(item.percent).toBeLessThanOrEqual(100);

              // Validate level format
              expect(item.level).toMatch(/^S[1-5]$/);

              // Validate text is non-empty
              expect(item.text.length).toBeGreaterThan(0);
            });

            // Validate summaryText is non-empty
            expect(result.summaryText.length).toBeGreaterThan(0);

            // Validate all 5 keys are present
            const keys = new Set(result.items.map((item) => item.key));
            LIFE_ALLOCATION_KEYS.forEach((key) => {
              expect(keys.has(key)).toBe(true);
            });

            // Validate percentages sum to ~100%
            const totalPercent = result.items.reduce(
              (sum, item) => sum + item.percent,
              0
            );
            expect(totalPercent).toBeCloseTo(100, 0);

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

    it("should verify all 5 life allocation keys are always present", () => {
      // Test all 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLifeAllocation(flags);

          const itemKeys = result.items.map((item) => item.key);

          // All expected keys should be present
          LIFE_ALLOCATION_KEYS.forEach((expectedKey) => {
            expect(itemKeys).toContain(expectedKey);
          });

          // No extra keys should be present
          expect(itemKeys).toHaveLength(5);
        });
      });
    });

    it("should produce valid level distribution across all combinations", () => {
      const levelCountsByAllocation: Record<
        string,
        Record<string, number>
      > = {};

      // Initialize counters
      LIFE_ALLOCATION_KEYS.forEach((key) => {
        levelCountsByAllocation[key] = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0 };
      });

      // Collect level distributions
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLifeAllocation(flags);

          result.items.forEach((item) => {
            levelCountsByAllocation[item.key][item.level]++;
          });
        });
      });

      // Verify all 256 combinations were counted for each allocation
      LIFE_ALLOCATION_KEYS.forEach((key) => {
        const total = Object.values(levelCountsByAllocation[key]).reduce(
          (sum, count) => sum + count,
          0
        );
        expect(total).toBe(256);
      });

      console.log(
        "Level distribution by life allocation:",
        levelCountsByAllocation
      );
    });

    it("should verify percent-to-level mapping consistency for all combinations", () => {
      // Test all 256 combinations to ensure percent-to-level mapping is correct
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLifeAllocation(flags);

          // Helper function to verify percent matches level
          const verifyPercentLevel = (percent: number, level: string) => {
            if (percent >= 50) expect(level).toBe("S5");
            else if (percent >= 35) expect(level).toBe("S4");
            else if (percent >= 20) expect(level).toBe("S3");
            else if (percent >= 10) expect(level).toBe("S2");
            else expect(level).toBe("S1");
          };

          // Verify all items
          result.items.forEach((item) => {
            verifyPercentLevel(item.percent, item.level);
          });
        });
      });
    });

    it("should verify percent ordering matches item ordering", () => {
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLifeAllocation(flags);

          // Verify that items are sorted in descending percent order
          for (let i = 0; i < result.items.length - 1; i++) {
            expect(result.items[i].percent).toBeGreaterThanOrEqual(
              result.items[i + 1].percent
            );
          }
        });
      });
    });

    it("should produce diverse top allocations across all types", () => {
      const topAllocations = new Set<string>();

      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLifeAllocation(flags);

          const topItem = result.items[0];
          if (topItem) {
            topAllocations.add(topItem.key);
          }
        });
      });

      console.log(`Unique top allocations: ${topAllocations.size}`);
      console.log(
        "Allocations that appear as top:",
        Array.from(topAllocations)
      );

      // Should have multiple different top allocations (not all the same)
      expect(topAllocations.size).toBeGreaterThan(1);
    });

    it("should verify all allocation labels are correctly assigned", () => {
      const expectedLabels: Record<string, string> = {
        partner: "恋人",
        work: "仕事",
        friends: "友人",
        family: "家族",
        hobbies: "趣味",
      };

      // Test with a sample combination
      const flags = getFlags("INFJ", "LCRO");
      const result = calcLifeAllocation(flags);

      result.items.forEach((item) => {
        expect(item.label).toBe(expectedLabels[item.key]);
      });
    });

    it("should verify composite score calculations", () => {
      // Test specific combinations to verify score calculations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLifeAllocation(flags);

          // Calculate expected raw scores
          const rawPartner =
            0.35 * flags.Fm +
            0.25 * flags.N +
            0.2 * flags.C +
            0.15 * flags.A +
            0.05 * flags.Pl;
          const rawWork =
            0.4 * flags.J + 0.3 * flags.Tm + 0.2 * flags.R + 0.1 * flags.El;
          const rawFriends = 0.5 * flags.E + 0.3 * flags.N + 0.2 * flags.O;
          const rawFamily = 0.35 * flags.Fm + 0.35 * flags.J + 0.3 * flags.El;
          const rawHobbies =
            0.35 * flags.I + 0.35 * flags.N + 0.2 * flags.Pm + 0.1 * flags.O;
          const sumRaw =
            rawPartner + rawWork + rawFriends + rawFamily + rawHobbies;

          // partner
          const partner = result.items.find((item) => item.key === "partner");
          const expectedPartner = (rawPartner / sumRaw) * 100;
          expect(partner?.percent).toBeCloseTo(expectedPartner, 1);

          // work
          const work = result.items.find((item) => item.key === "work");
          const expectedWork = (rawWork / sumRaw) * 100;
          expect(work?.percent).toBeCloseTo(expectedWork, 1);

          // friends
          const friends = result.items.find((item) => item.key === "friends");
          const expectedFriends = (rawFriends / sumRaw) * 100;
          expect(friends?.percent).toBeCloseTo(expectedFriends, 1);

          // family
          const family = result.items.find((item) => item.key === "family");
          const expectedFamily = (rawFamily / sumRaw) * 100;
          expect(family?.percent).toBeCloseTo(expectedFamily, 1);

          // hobbies
          const hobbies = result.items.find((item) => item.key === "hobbies");
          const expectedHobbies = (rawHobbies / sumRaw) * 100;
          expect(hobbies?.percent).toBeCloseTo(expectedHobbies, 1);
        });
      });
    });

    it("should verify all percentages are within valid range", () => {
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLifeAllocation(flags);

          result.items.forEach((item) => {
            expect(item.percent).toBeGreaterThanOrEqual(0);
            expect(item.percent).toBeLessThanOrEqual(100);
          });
        });
      });
    });

    it("should verify percentages sum to 100% for all combinations", () => {
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcLifeAllocation(flags);

          const totalPercent = result.items.reduce(
            (sum, item) => sum + item.percent,
            0
          );
          expect(totalPercent).toBeCloseTo(100, 0);
        });
      });
    });
  });
});
