import { getFlags } from "../common/TypeFlags";
import { calcPersonalityVector } from "../PersonalityVectorAlgorithm";

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
});
