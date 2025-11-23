# データモデル仕様

## 前提
- **診断結果は永続化しない**（ステートレス設計）
- DynamoDBは使用しない
- 画像はクライアントサイドで生成（html2canvas）
- 診断はリクエストごとに計算し、レスポンスで返すのみ

---

## 1. ドメインモデル（TypeScript型定義）

### 1.1 エンティティ

#### DiagnosisResult（メモリ上のみ）
```typescript
interface DiagnosisResult {
  mbti: MBTIType;
  loveType: LoveType;
  results: DiagnosisResults;
}
```

#### MBTIType
```typescript
type MBTIAxis1 = 'E' | 'I';  // Extraversion / Introversion
type MBTIAxis2 = 'N' | 'S';  // Intuition / Sensing
type MBTIAxis3 = 'T' | 'F';  // Thinking / Feeling
type MBTIAxis4 = 'J' | 'P';  // Judging / Perceiving

type MBTIType = `${MBTIAxis1}${MBTIAxis2}${MBTIAxis3}${MBTIAxis4}`;

// 16パターンの例
// 'ENFJ' | 'ENFP' | 'ENTJ' | 'ENTP' |
// 'ESFJ' | 'ESFP' | 'ESTJ' | 'ESTP' |
// 'INFJ' | 'INFP' | 'INTJ' | 'INTP' |
// 'ISFJ' | 'ISFP' | 'ISTJ' | 'ISTP'
```

#### LoveType
```typescript
type LoveAxis1 = 'L' | 'F';  // TBD（例: Logical / Feeling）
type LoveAxis2 = 'C' | 'A';  // TBD（例: Cautious / Adventurous）
type LoveAxis3 = 'R' | 'P';  // TBD（例: Rational / Passionate）
type LoveAxis4 = 'O' | 'E';  // TBD（例: Open / Exclusive）

type LoveType = `${LoveAxis1}${LoveAxis2}${LoveAxis3}${LoveAxis4}`;

// 16パターン
// 'LCRO' | 'LCRE' | 'LCPO' | 'LCPE' |
// 'LARO' | 'LARE' | 'LAPO' | 'LAPE' |
// 'FCRO' | 'FCRE' | 'FCPO' | 'FCPE' |
// 'FARO' | 'FARE' | 'FAPO' | 'FAPE'
```

### 1.2 値オブジェクト

#### Attractiveness
```typescript
interface Attractiveness {
  totalScore: number;   // 0-100
  description: string;
}
```

#### Compatibility
```typescript
interface CompatibilityMatch {
  rank: 1 | 2 | 3;
  mbti: MBTIType;
  loveType: LoveType;
  description: string;
}

interface Compatibility {
  top3: [CompatibilityMatch, CompatibilityMatch, CompatibilityMatch];
}
```

#### PersonalityAxis
```typescript
interface PersonalityAxis {
  topThreeTraits: string[];  // 上位3つの性格特性
  description: string;       // 性格の説明テキスト
}
```

#### LoveLanguage
```typescript
enum LoveLanguageType {
  WORDS_OF_AFFIRMATION = 'WORDS_OF_AFFIRMATION',
  QUALITY_TIME = 'QUALITY_TIME',
  RECEIVING_GIFTS = 'RECEIVING_GIFTS',
  ACTS_OF_SERVICE = 'ACTS_OF_SERVICE',
  PHYSICAL_TOUCH = 'PHYSICAL_TOUCH',
}

interface LoveLanguageRanking {
  rank: 1 | 2 | 3 | 4 | 5;
  type: LoveLanguageType;
  score: number;        // 0-100
  description: string;
}

type LoveLanguages = [
  LoveLanguageRanking,
  LoveLanguageRanking,
  LoveLanguageRanking,
  LoveLanguageRanking,
  LoveLanguageRanking
];
```

#### LifeAllocation
```typescript
interface LifeAllocation {
  romance: number;      // 恋愛・パートナーシップ (%)
  career: number;       // 仕事・キャリア (%)
  friends: number;      // 友人・社交 (%)
  hobbies: number;      // 趣味・自己成長 (%)
  family: number;       // 家族 (%)
  description: string;  // 時間配分の説明テキスト
}

// バリデーション: 数値項目の合計が100%であること
```

### 1.3 診断結果統合型

```typescript
interface DiagnosisResults {
  attractiveness: Attractiveness;
  personalityAxis: PersonalityAxis;
  compatibility: Compatibility;
  loveLanguages: LoveLanguages;
  lifeAllocation: LifeAllocation;
}
```

---

## 2. アルゴリズムデータ（静的定義）

診断ロジックに必要な静的データは、コード内に定数として定義：

### 2.1 相性マトリクス
```typescript
// backend/src/infrastructure/algorithms/data/compatibilityMatrix.ts

const MBTI_COMPATIBILITY_MATRIX: Record<MBTIType, MBTIType[]> = {
  'ENFJ': ['INFP', 'ISFJ', 'ENFP'],
  'INFP': ['ENFJ', 'ENTJ', 'INFJ'],
  // ... 256通りの定義
};
```

### 2.2 性格テキストテンプレート
```typescript
// backend/src/infrastructure/algorithms/data/personalityTexts.ts

const PERSONALITY_TEMPLATES: Record<string, string> = {
  'ENFJ_LCRO': 'あなたは論理的で慎重、かつ理性的なリーダータイプです...',
  'ENFJ_FARE': 'あなたは感情豊かで冒険的、情熱的なカリスマタイプです...',
  'INFP_FCRE': 'あなたは感情的で慎重、理性的な理想主義者です...',
  // ... 256通りの定義
};
```

### 2.3 モテ度計算の重み
```typescript
// backend/src/infrastructure/algorithms/data/popularityWeights.ts

interface PopularityWeights {
  mbti: Record<MBTIType, number>;
  loveType: Record<LoveType, number>;
  combination: Record<string, number>; // MBTI_LoveTypeの組み合わせボーナス
}

const POPULARITY_WEIGHTS: PopularityWeights = {
  mbti: {
    'ENFJ': 8.5,
    'INFP': 7.0,
    // ...
  },
  loveType: {
    'ACEG': 8.0,
    // ...
  },
  combination: {
    'ENFJ_FARE': 1.2,  // ボーナス係数
    'INFP_LCRE': 1.1,
    // ... 256通りの組み合わせ
  }
};
```

---

## 3. 環境変数

```bash
# AWS
AWS_REGION=ap-northeast-1

# アプリケーション
API_BASE_URL=https://api.lovy.ai
FRONTEND_URL=https://lovy.ai
NODE_ENV=production
```

---

## 4. データフロー

```
1. ユーザーがMBTI + Love Type 16を選択
   ↓
2. フロントエンドからAPI Gatewayにリクエスト
   ↓
3. Lambda関数で診断アルゴリズム実行（メモリ上で計算）
   ↓
4. 診断結果をJSONで返却
   ↓
5. フロントエンドで結果表示
   ↓
6. ユーザーが画像ダウンロードボタンをクリック
   ↓
7. html2canvasでクライアントサイドで画像生成
   ↓
8. ブラウザから直接ダウンロード（永続化なし）
```
