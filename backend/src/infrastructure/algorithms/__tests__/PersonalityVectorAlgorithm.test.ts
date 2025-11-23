import { getFlags } from "../common/TypeFlags";
import { calcPersonalityVector } from "../PersonalityVectorAlgorithm";
import { MBTI_TYPES } from "../../../domain/valueObjects/MBTIType";
import { LOVE_TYPES } from "../../../domain/valueObjects/LoveType";

describe("PersonalityVectorAlgorithm", () => {
  describe("calcPersonalityVector", () => {
    it("should calculate all 11 axes and extract top 3 for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcPersonalityVector(flags);

      // 11軸すべてが計算されていることを確認
      expect(result.allAxes).toHaveLength(11);

      // Top3が抽出されていることを確認
      expect(result.top3).toHaveLength(3);

      // Top3がスコア降順であることを確認
      expect(result.top3[0].score).toBeGreaterThanOrEqual(result.top3[1].score);
      expect(result.top3[1].score).toBeGreaterThanOrEqual(result.top3[2].score);

      // 各アイテムが必須プロパティを持つことを確認
      result.top3.forEach((item) => {
        expect(item.key).toBeTruthy();
        expect(item.label).toBeTruthy();
        expect(typeof item.score).toBe("number");
        expect(item.level).toMatch(/^S[1-5]$/);
        expect(item.text).toBeTruthy();
      });
    });

    it("should calculate correct scores for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      // ENFJはE=1, N=1, F=1, J=1
      // FAREはF=1, A=1, R=1, E=1
      // つまり flags = { E:1, I:0, N:1, S:0, Fm:1, Tm:0, J:1, Pm:0, L:0, Fl:1, C:0, A:1, R:1, Pl:0, O:0, El:1 }

      const result = calcPersonalityVector(flags);

      // 外向性: E * 100 = 100
      const extraversion = result.allAxes.find((a) => a.key === "extraversion");
      expect(extraversion?.score).toBe(100);
      expect(extraversion?.level).toBe("S5");

      // 内面志向: I * 100 = 0
      const introversionDepth = result.allAxes.find(
        (a) => a.key === "introversionDepth"
      );
      expect(introversionDepth?.score).toBe(0);
      expect(introversionDepth?.level).toBe("S1");

      // 直観/ロマン性: (0.7*N + 0.3*Pl) * 100 = (0.7*1 + 0.3*0) * 100 = 70
      const intuitionRomance = result.allAxes.find(
        (a) => a.key === "intuitionRomance"
      );
      expect(intuitionRomance?.score).toBe(70);
      expect(intuitionRomance?.level).toBe("S4");

      // 現実/実務性: (0.7*S + 0.3*R) * 100 = (0.7*0 + 0.3*1) * 100 = 30
      const realism = result.allAxes.find((a) => a.key === "realism");
      expect(realism?.score).toBe(30);
      expect(realism?.level).toBe("S2");

      // 論理性: Tm * 100 = 0
      const thinking = result.allAxes.find((a) => a.key === "thinking");
      expect(thinking?.score).toBe(0);
      expect(thinking?.level).toBe("S1");

      // 共感性: Fm * 100 = 100
      const feeling = result.allAxes.find((a) => a.key === "feeling");
      expect(feeling?.score).toBe(100);
      expect(feeling?.level).toBe("S5");

      // 構造化・計画性: J * 100 = 100
      const structure = result.allAxes.find((a) => a.key === "structure");
      expect(structure?.score).toBe(100);
      expect(structure?.level).toBe("S5");

      // 柔軟・フットワーク: Pm * 100 = 0
      const flexibility = result.allAxes.find((a) => a.key === "flexibility");
      expect(flexibility?.score).toBe(0);
      expect(flexibility?.level).toBe("S1");

      // 甘えニーズ: C * 100 = 0
      const cuddleNeed = result.allAxes.find((a) => a.key === "cuddleNeed");
      expect(cuddleNeed?.score).toBe(0);
      expect(cuddleNeed?.level).toBe("S1");

      // 甘え受容力: A * 100 = 100
      const acceptWarmth = result.allAxes.find((a) => a.key === "acceptWarmth");
      expect(acceptWarmth?.score).toBe(100);
      expect(acceptWarmth?.level).toBe("S5");

      // 主導性: L * 100 = 0
      const leadAttitude = result.allAxes.find((a) => a.key === "leadAttitude");
      expect(leadAttitude?.score).toBe(0);
      expect(leadAttitude?.level).toBe("S1");
    });

    it("should have top3 with highest scores for ENFJ + FARE", () => {
      const flags = getFlags("ENFJ", "FARE");
      const result = calcPersonalityVector(flags);

      // スコア100のものが4つある: 外向性、共感性、構造化・計画性、甘え受容力
      // スコア70: 直観/ロマン性
      // その他は低い

      // 100点のものが3つ入るはず
      const score100Keys = [
        "extraversion",
        "feeling",
        "structure",
        "acceptWarmth",
      ];

      // Top3の全てが100点のグループまたは70点（intuitionRomance）から選ばれているはず
      result.top3.forEach((item) => {
        expect(
          score100Keys.includes(item.key) || item.key === "intuitionRomance"
        ).toBe(true);
      });

      // すべて60以上のスコアであるはず
      result.top3.forEach((item) => {
        expect(item.score).toBeGreaterThanOrEqual(60);
      });
    });

    it("should calculate correct scores for INTJ + LCRO", () => {
      const flags = getFlags("INTJ", "LCRO");
      // INTJはI=1, N=1, T=1, J=1
      // LCROはL=1, C=1, R=1, O=1

      const result = calcPersonalityVector(flags);

      // 外向性: E * 100 = 0
      const extraversion = result.allAxes.find((a) => a.key === "extraversion");
      expect(extraversion?.score).toBe(0);

      // 内面志向: I * 100 = 100
      const introversionDepth = result.allAxes.find(
        (a) => a.key === "introversionDepth"
      );
      expect(introversionDepth?.score).toBe(100);

      // 論理性: Tm * 100 = 100
      const thinking = result.allAxes.find((a) => a.key === "thinking");
      expect(thinking?.score).toBe(100);

      // 共感性: Fm * 100 = 0
      const feeling = result.allAxes.find((a) => a.key === "feeling");
      expect(feeling?.score).toBe(0);

      // 構造化・計画性: J * 100 = 100
      const structure = result.allAxes.find((a) => a.key === "structure");
      expect(structure?.score).toBe(100);

      // Top3に内面志向、論理性、構造化・計画性が含まれるはず
      const top3Keys = result.top3.map((item) => item.key);
      expect(top3Keys).toContain("introversionDepth");
      expect(top3Keys).toContain("thinking");
      expect(top3Keys).toContain("structure");
    });
  });

  describe("Comprehensive: All MBTI x LoveType combinations", () => {
    it("should successfully calculate personality vector for all 256 combinations", () => {
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ mbti: string; loveType: string; error: string }> = [];

      // Test all 16 MBTI × 16 LoveType = 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          try {
            const flags = getFlags(mbti, loveType);
            const result = calcPersonalityVector(flags);

            // Validate structure
            expect(result).toHaveProperty("allAxes");
            expect(result).toHaveProperty("top3");

            // Validate allAxes has 11 axes
            expect(result.allAxes).toHaveLength(11);

            // Validate top3 has 3 items
            expect(result.top3).toHaveLength(3);

            // Validate all axes have required properties
            result.allAxes.forEach((axis) => {
              expect(axis).toHaveProperty("key");
              expect(axis).toHaveProperty("label");
              expect(axis).toHaveProperty("score");
              expect(axis).toHaveProperty("level");
              expect(axis).toHaveProperty("text");

              // Validate score range
              expect(axis.score).toBeGreaterThanOrEqual(0);
              expect(axis.score).toBeLessThanOrEqual(100);

              // Validate level format
              expect(axis.level).toMatch(/^S[1-5]$/);

              // Validate text is non-empty
              expect(axis.text.length).toBeGreaterThan(0);
            });

            // Validate top3 is sorted by score (descending)
            expect(result.top3[0].score).toBeGreaterThanOrEqual(result.top3[1].score);
            expect(result.top3[1].score).toBeGreaterThanOrEqual(result.top3[2].score);

            // Validate top3 items are from allAxes
            result.top3.forEach((topItem) => {
              const found = result.allAxes.find(
                (axis) => axis.key === topItem.key && axis.score === topItem.score
              );
              expect(found).toBeDefined();
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

    it("should verify all 11 axes are always present", () => {
      const expectedAxes = [
        "extraversion",
        "introversionDepth",
        "intuitionRomance",
        "realism",
        "thinking",
        "feeling",
        "structure",
        "flexibility",
        "cuddleNeed",
        "acceptWarmth",
        "leadAttitude",
      ];

      // Test all 256 combinations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcPersonalityVector(flags);

          const axisKeys = result.allAxes.map((axis) => axis.key);

          // All expected axes should be present
          expectedAxes.forEach((expectedKey) => {
            expect(axisKeys).toContain(expectedKey);
          });

          // No extra axes should be present
          expect(axisKeys).toHaveLength(11);
        });
      });
    });

    it("should produce valid level distribution across all combinations", () => {
      const levelCountsByAxis: Record<string, Record<string, number>> = {};

      // Initialize counters
      const axisKeys = [
        "extraversion",
        "introversionDepth",
        "intuitionRomance",
        "realism",
        "thinking",
        "feeling",
        "structure",
        "flexibility",
        "cuddleNeed",
        "acceptWarmth",
        "leadAttitude",
      ];

      axisKeys.forEach((key) => {
        levelCountsByAxis[key] = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0 };
      });

      // Collect level distributions
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcPersonalityVector(flags);

          result.allAxes.forEach((axis) => {
            levelCountsByAxis[axis.key][axis.level]++;
          });
        });
      });

      // Verify all 256 combinations were counted for each axis
      axisKeys.forEach((key) => {
        const total = Object.values(levelCountsByAxis[key]).reduce(
          (sum, count) => sum + count,
          0
        );
        expect(total).toBe(256);
      });

      console.log("Level distribution by axis:", levelCountsByAxis);
    });

    it("should verify score-to-level mapping consistency for all combinations", () => {
      // Test all 256 combinations to ensure score-to-level mapping is correct
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcPersonalityVector(flags);

          // Helper function to verify score matches level (S5 scale)
          const verifyScoreLevel = (score: number, level: string) => {
            if (score >= 80) expect(level).toBe("S5");
            else if (score >= 60) expect(level).toBe("S4");
            else if (score >= 40) expect(level).toBe("S3");
            else if (score >= 20) expect(level).toBe("S2");
            else expect(level).toBe("S1");
          };

          // Verify all axes
          result.allAxes.forEach((axis) => {
            verifyScoreLevel(axis.score, axis.level);
          });

          // Verify top3
          result.top3.forEach((item) => {
            verifyScoreLevel(item.score, item.level);
          });
        });
      });
    });

    it("should produce diverse top3 combinations across all types", () => {
      const top3Combinations = new Set<string>();

      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcPersonalityVector(flags);

          // Create a signature for this top3 combination
          const top3Keys = result.top3.map((item) => item.key).sort().join(",");
          top3Combinations.add(top3Keys);
        });
      });

      console.log(`Unique top3 combinations: ${top3Combinations.size}`);
      console.log("Sample combinations:", Array.from(top3Combinations).slice(0, 10));

      // Should have multiple different top3 combinations (not all the same)
      expect(top3Combinations.size).toBeGreaterThan(1);
    });

    it("should verify all axis labels are correctly assigned", () => {
      const expectedLabels: Record<string, string> = {
        extraversion: "外向性",
        introversionDepth: "内面志向",
        intuitionRomance: "直観／ロマン性",
        realism: "現実／実務性",
        thinking: "論理性",
        feeling: "共感性",
        structure: "構造化・計画性",
        flexibility: "柔軟・フットワーク",
        cuddleNeed: "甘えニーズ",
        acceptWarmth: "甘え受容力",
        leadAttitude: "主導性",
      };

      // Test with a sample combination
      const flags = getFlags("INFJ", "LCRO");
      const result = calcPersonalityVector(flags);

      result.allAxes.forEach((axis) => {
        expect(axis.label).toBe(expectedLabels[axis.key]);
      });
    });

    it("should calculate composite scores correctly for intuitionRomance and realism", () => {
      // Test specific combinations to verify composite score calculations
      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcPersonalityVector(flags);

          // Find intuitionRomance and realism
          const intuitionRomance = result.allAxes.find(
            (a) => a.key === "intuitionRomance"
          );
          const realism = result.allAxes.find((a) => a.key === "realism");

          // Verify they exist
          expect(intuitionRomance).toBeDefined();
          expect(realism).toBeDefined();

          if (intuitionRomance && realism) {
            // intuitionRomance = (0.7*N + 0.3*Pl) * 100
            const expectedIntuition = (0.7 * flags.N + 0.3 * flags.Pl) * 100;
            expect(intuitionRomance.score).toBeCloseTo(expectedIntuition, 5);

            // realism = (0.7*S + 0.3*R) * 100
            const expectedRealism = (0.7 * flags.S + 0.3 * flags.R) * 100;
            expect(realism.score).toBeCloseTo(expectedRealism, 5);
          }
        });
      });
    });

    it("should verify binary axes are either 0 or 100", () => {
      const binaryAxes = [
        "extraversion",
        "introversionDepth",
        "thinking",
        "feeling",
        "structure",
        "flexibility",
        "cuddleNeed",
        "acceptWarmth",
        "leadAttitude",
      ];

      MBTI_TYPES.forEach((mbti) => {
        LOVE_TYPES.forEach((loveType) => {
          const flags = getFlags(mbti, loveType);
          const result = calcPersonalityVector(flags);

          result.allAxes.forEach((axis) => {
            if (binaryAxes.includes(axis.key)) {
              // Binary axes should be 0 or 100
              expect([0, 100]).toContain(axis.score);
            }
          });
        });
      });
    });
  });
});
