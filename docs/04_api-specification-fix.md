# API 仕様書

## ベース URL

- 開発: `https://dev-api.lovy.ai`
- 本番: `https://api.lovy.ai`

## 共通仕様

### リクエストヘッダー

```
Content-Type: application/json
Accept: application/json
```

### レスポンス形式

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### エラーレスポンス

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": { ... }
  }
}
```

### エラーコード

| コード                | 説明                     | HTTP ステータス |
| --------------------- | ------------------------ | --------------- |
| `INVALID_INPUT`       | 入力バリデーションエラー | 400             |
| `NOT_FOUND`           | リソースが見つからない   | 404             |
| `INTERNAL_ERROR`      | サーバー内部エラー       | 500             |
| `RATE_LIMIT_EXCEEDED` | レート制限超過           | 429             |

---

## エンドポイント一覧

### 1. 診断実行 API

#### `POST /api/v1/diagnosis`

**概要**: MBTI× ラブタイプから 256 通りの診断を実行

**リクエストボディ**

```json
{
  "mbti": "ENFJ",
  "loveType": "FARE"
}
```

**リクエストパラメータ**
| フィールド | 型 | 必須 | 説明 | 例 |
|-----------|-----|------|------|-----|
| `mbti` | string | ○ | MBTI 4 文字（E/I, N/S, T/F, J/P） | "ENFJ" |
| `loveType` | string | ○ | Love Type 16 4 文字（L/F, C/A, R/P, O/E） | "FARE" |

**レスポンス**

```json
{
  "success": true,
  "data": {
    "mbti": "ENFJ",
    "loveType": "FARE",
    "results": {
      "attractiveness": {
        "totalScore": 85,
        "description": "高いモテ度を持つタイプです"
        // "subscores": {
        //   "opportunityVolume": 60,
        //   "firstImpression": 20,
        //   "sustainedLikability": 5
        // }
      },
      "personalityAxis": {
        "topThreeTraits": []
      },
      "compatibility": {
        "top3": [
          {
            "rank": 1,
            "mbti": "INFP",
            "loveType": "LCRE",
            "description": "理想的なパートナー"
          },
          {
            "rank": 2,
            "mbti": "ISFJ",
            "loveType": "FARO",
            "description": "安定した関係を築ける"
          },
          {
            "rank": 3,
            "mbti": "ENFP",
            "loveType": "FAPO",
            "description": "刺激的な関係"
          }
        ]
      },
      "loveLanguages": [
        {
          "rank": 1,
          "type": "QUALITY_TIME",
          "score": 95,
          "description": "xxx"
        },
        {
          "rank": 2,
          "type": "WORDS_OF_AFFIRMATION",
          "score": 80,
          "description": "xxx"
        },
        {
          "rank": 3,
          "type": "PHYSICAL_TOUCH",
          "score": 70,
          "description": "xxx"
        },
        {
          "rank": 4,
          "type": "ACTS_OF_SERVICE",
          "score": 55,
          "description": "xxx"
        },
        {
          "rank": 5,
          "type": "RECEIVING_GIFTS",
          "score": 45,
          "description": "xxx"
        }
      ],
      "lifeAllocation": {
        "romance": 30,
        "career": 25,
        "friends": 15,
        "hobbies": 15,
        "family": 10,
        "description": "xxx"
      }
    }
  },
  "error": null
}
```

**ステータスコード**

- `200 OK`: 診断成功
- `400 Bad Request`: 入力バリデーションエラー
- `500 Internal Server Error`: サーバーエラー

---

## レート制限

| エンドポイント           | 制限             |
| ------------------------ | ---------------- |
| `POST /api/v1/diagnosis` | 10 リクエスト/分 |

---

## バージョニング

- URL パスに `/v1` を含める
- 後方互換性のない変更は `/v2` として提供
