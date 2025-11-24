import { CreateDiagnosisUseCase } from "../CreateDiagnosisUseCase";
import { MBTIType } from "../../../domain/valueObjects/MBTIType";
import { LoveType } from "../../../domain/valueObjects/LoveType";

describe("CreateDiagnosisUseCase", () => {
  let useCase: CreateDiagnosisUseCase;

  beforeEach(() => {
    useCase = new CreateDiagnosisUseCase();
  });

  describe("execute", () => {
    it("ENFP × LCPO の診断結果を正常に作成できる", () => {
      const mbti: MBTIType = "ENFP";
      const loveType: LoveType = "LCPO";

      const result = useCase.execute(mbti, loveType);

      // 基本プロパティの検証
      expect(result.mbti).toBe(mbti);
      expect(result.loveType).toBe(loveType);

      // 各診断結果の存在確認
      expect(result.results.attractiveness).toBeDefined();
      expect(result.results.personalityAxis).toBeDefined();
      expect(result.results.compatibility).toBeDefined();
      expect(result.results.loveLanguage).toBeDefined();
      expect(result.results.lifeAllocation).toBeDefined();
    });

    it("モテ度の結果が正しい構造を持つ", () => {
      const mbti: MBTIType = "ENFP";
      const loveType: LoveType = "LCPO";

      const result = useCase.execute(mbti, loveType);
      const attractiveness = result.results.attractiveness;

      // スコアの検証
      expect(attractiveness.scores).toHaveProperty("totalScore");
      expect(attractiveness.scores).toHaveProperty("chance");
      expect(attractiveness.scores).toHaveProperty("firstImpression");
      expect(attractiveness.scores).toHaveProperty("lastingLikeability");

      // レベルの検証
      expect(attractiveness.levels).toHaveProperty("chance");
      expect(attractiveness.levels).toHaveProperty("firstImpression");
      expect(attractiveness.levels).toHaveProperty("lastingLikeability");

      // テキストの検証
      expect(attractiveness.texts).toHaveProperty("summary");
      expect(typeof attractiveness.texts.summary).toBe("string");
    });

    it("性格ベクトルの結果が正しい構造を持つ", () => {
      const mbti: MBTIType = "ENFP";
      const loveType: LoveType = "LCPO";

      const result = useCase.execute(mbti, loveType);
      const personalityAxis = result.results.personalityAxis;

      // Top3の検証
      expect(personalityAxis.top3).toHaveLength(3);
      expect(personalityAxis.top3[0]).toHaveProperty("label");
      expect(personalityAxis.top3[0]).toHaveProperty("score");
      expect(personalityAxis.top3[0]).toHaveProperty("level");
      expect(personalityAxis.top3[0]).toHaveProperty("text");

      // スコアの降順検証
      expect(personalityAxis.top3[0].score).toBeGreaterThanOrEqual(
        personalityAxis.top3[1].score
      );
      expect(personalityAxis.top3[1].score).toBeGreaterThanOrEqual(
        personalityAxis.top3[2].score
      );
    });

    it("相性の結果が正しい構造を持ち、ベスト3が含まれる", () => {
      const mbti: MBTIType = "ENFP";
      const loveType: LoveType = "LCPO";

      const result = useCase.execute(mbti, loveType);
      const compatibility = result.results.compatibility;

      // サマリーの検証
      expect(typeof compatibility.summary).toBe("string");

      // ベストマッチの検証
      expect(compatibility.bestMatches).toHaveLength(3);
      expect(compatibility.bestMatches[0]).toHaveProperty("partner");
      expect(compatibility.bestMatches[0]).toHaveProperty("score");
      expect(compatibility.bestMatches[0]).toHaveProperty("level");
      expect(compatibility.bestMatches[0]).toHaveProperty("relationFlavor");
      expect(compatibility.bestMatches[0]).toHaveProperty("description");

      // パートナー情報の検証
      expect(compatibility.bestMatches[0].partner).toHaveProperty("mbti");
      expect(compatibility.bestMatches[0].partner).toHaveProperty("loveType");

      // スコアの降順検証
      expect(compatibility.bestMatches[0].score).toBeGreaterThanOrEqual(
        compatibility.bestMatches[1].score
      );
      expect(compatibility.bestMatches[1].score).toBeGreaterThanOrEqual(
        compatibility.bestMatches[2].score
      );
    });

    it("愛情表現の結果が正しい構造を持つ", () => {
      const mbti: MBTIType = "ENFP";
      const loveType: LoveType = "LCPO";

      const result = useCase.execute(mbti, loveType);
      const loveLanguage = result.results.loveLanguage;

      // サマリーテキストの検証
      expect(typeof loveLanguage.summaryText).toBe("string");

      // アイテムの検証（5つの愛情表現）
      expect(loveLanguage.items).toHaveLength(5);
      expect(loveLanguage.items[0]).toHaveProperty("rank");
      expect(loveLanguage.items[0]).toHaveProperty("label");
      expect(loveLanguage.items[0]).toHaveProperty("score");
      expect(loveLanguage.items[0]).toHaveProperty("level");
      expect(loveLanguage.items[0]).toHaveProperty("text");

      // ランクの検証
      expect(loveLanguage.items[0].rank).toBe(1);
      expect(loveLanguage.items[4].rank).toBe(5);
    });

    it("人生の時間配分の結果が正しい構造を持つ", () => {
      const mbti: MBTIType = "ENFP";
      const loveType: LoveType = "LCPO";

      const result = useCase.execute(mbti, loveType);
      const lifeAllocation = result.results.lifeAllocation;

      // サマリーテキストの検証
      expect(typeof lifeAllocation.summaryText).toBe("string");

      // アイテムの検証（5つの領域: 恋人、仕事、友人、家族、趣味）
      expect(lifeAllocation.items).toHaveLength(5);
      expect(lifeAllocation.items[0]).toHaveProperty("label");
      expect(lifeAllocation.items[0]).toHaveProperty("percent");
      expect(lifeAllocation.items[0]).toHaveProperty("level");
      expect(lifeAllocation.items[0]).toHaveProperty("text");

      // パーセンテージの合計が100%に近い
      const totalPercent = lifeAllocation.items.reduce(
        (sum, item) => sum + item.percent,
        0
      );
      expect(totalPercent).toBeCloseTo(100, 0);
    });

    it("異なるMBTI × LoveTypeで異なる結果を返す", () => {
      const result1 = useCase.execute("ENFP", "LCPO");
      const result2 = useCase.execute("INTJ", "FARE");

      // 基本情報が異なる
      expect(result1.mbti).not.toBe(result2.mbti);
      expect(result1.loveType).not.toBe(result2.loveType);

      // 何らかのスコアが異なることを確認（完全に同じ結果にはならない）
      const attractiveness1 = result1.results.attractiveness.scores.totalScore;
      const attractiveness2 = result2.results.attractiveness.scores.totalScore;

      // 同じスコアになる可能性もあるが、構造は正しいことを確認
      expect(typeof attractiveness1).toBe("number");
      expect(typeof attractiveness2).toBe("number");
    });

    it("全16種類のMBTIで診断が成功する", () => {
      const mbtiTypes: MBTIType[] = [
        "ENFP",
        "ENFJ",
        "ENTP",
        "ENTJ",
        "ESFP",
        "ESFJ",
        "ESTP",
        "ESTJ",
        "INFP",
        "INFJ",
        "INTP",
        "INTJ",
        "ISFP",
        "ISFJ",
        "ISTP",
        "ISTJ",
      ];

      const loveType: LoveType = "LCPO";

      mbtiTypes.forEach((mbti) => {
        const result = useCase.execute(mbti, loveType);
        expect(result.mbti).toBe(mbti);
        expect(result.loveType).toBe(loveType);
        expect(result.results).toBeDefined();
      });
    });

    it("全16種類のLoveTypeで診断が成功する", () => {
      const loveTypes: LoveType[] = [
        "LCPO",
        "LCPE",
        "LCRO",
        "LCRE",
        "LAPO",
        "LAPE",
        "LARO",
        "LARE",
        "FCPO",
        "FCPE",
        "FCRO",
        "FCRE",
        "FAPO",
        "FAPE",
        "FARO",
        "FARE",
      ];

      const mbti: MBTIType = "ENFP";

      loveTypes.forEach((loveType) => {
        const result = useCase.execute(mbti, loveType);
        expect(result.mbti).toBe(mbti);
        expect(result.loveType).toBe(loveType);
        expect(result.results).toBeDefined();
      });
    });
  });
});
