# 技術アーキテクチャ仕様

## 0. 設計方針

**初期リリース: ステートレス・DB 不要の軽量構成**

- 診断結果は永続化せず、リクエストごとに計算
- DynamoDB は使用しない（将来的に導入検討）
- フロントエンドで画像生成（クライアントサイド優先）
- 最小限の AWS リソースでコスト最適化

## 1. システムアーキテクチャ概要（初期リリース）

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
┌──────▼──────────────────────────────┐
│   CloudFront (CDN)                  │
└──────┬──────────────────────────────┘
       │
       ├─────────────────┐
       │                 │
┌──────▼──────────┐  ┌──▼───────────┐
│   S3 (Static)   │  │ API Gateway  │
│   - React App   │  └──┬───────────┘
│   - Images*     │     │
└─────────────────┘     │
                  ┌─────▼──────────┐
                  │ Lambda         │
                  │ (TypeScript)   │
                  │ - 診断実行     │
                  │ - ステートレス │
                  └────────────────┘

* 画像は主にクライアントサイド生成（html2canvas）
  S3への保存はオプション（SNS共有実装時）
```

## 2. 技術スタック

### 2.1 フロントエンド

| 技術         | バージョン | 用途              |
| ------------ | ---------- | ----------------- |
| React        | 19.x       | UI フレームワーク |
| TypeScript   | 5.x        | 型安全な開発      |
| React Router | 6.x        | ルーティング      |
| Axios        | 1.x        | HTTP 通信         |
| html2canvas  | 1.x        | 画像生成          |
| Tailwind CSS | 3.x        | スタイリング      |
| Vite         | 5.x        | ビルドツール      |

### 2.2 バックエンド

| 技術                 | バージョン | 用途             |
| -------------------- | ---------- | ---------------- |
| TypeScript           | 5.x        | 開発言語         |
| Node.js              | 20.x       | ランタイム       |
| Serverless Framework | 3.x        | デプロイ管理     |
| AWS SDK              | 3.x        | AWS サービス連携 |

### 2.3 インフラ (AWS)

#### 初期リリースで使用

| サービス    | 用途                                  |
| ----------- | ------------------------------------- |
| Lambda      | サーバーレス関数実行（診断ロジック）  |
| API Gateway | REST API エンドポイント               |
| S3          | 静的ファイルホスティング（React App） |
| CloudFront  | CDN・グローバル配信                   |
| Route53     | DNS 管理                              |
| ACM         | SSL/TLS 証明書                        |
| CloudWatch  | ログ・モニタリング                    |

#### 将来的に導入予定

| サービス       | 用途                         | 導入タイミング         |
| -------------- | ---------------------------- | ---------------------- |
| DynamoDB       | 診断結果・ユーザーデータ保存 | ユーザー登録機能実装時 |
| S3（画像保存） | 診断結果画像の一時保存       | SNS 共有機能実装時     |
| Cognito        | ユーザー認証                 | ユーザー登録機能実装時 |

## 3. バックエンドアーキテクチャ（DDD + オニオンアーキテクチャ）

### 3.1 ディレクトリ構造（初期リリース）

```
backend/
├── src/
│   ├── domain/                    # ドメイン層（最内層）
│   │   ├── entities/              # エンティティ
│   │   │   ├── DiagnosisResult.ts
│   │   │   ├── MBTIType.ts
│   │   │   └── LoveType.ts
│   │   ├── valueObjects/          # 値オブジェクト
│   │   │   ├── PopularityScore.ts
│   │   │   ├── Compatibility.ts
│   │   │   ├── AttachmentStyle.ts
│   │   │   └── TimeAllocation.ts
│   │   └── services/              # ドメインサービス
│   │       ├── DiagnosisService.ts
│   │       ├── CompatibilityService.ts
│   │       └── PopularityService.ts
│   │
│   ├── application/               # アプリケーション層
│   │   ├── usecases/              # ユースケース
│   │   │   └── ExecuteDiagnosisUseCase.ts  # 診断実行（ステートレス）
│   │   └── dto/                   # データ転送オブジェクト
│   │       ├── DiagnosisInputDTO.ts
│   │       └── DiagnosisOutputDTO.ts
│   │
│   ├── infrastructure/            # インフラ層（最外層）
│   │   ├── data/                  # 静的データ（DB代替）
│   │   │   ├── personalityTexts.ts      # 256通りの性格テキスト
│   │   │   ├── compatibilityMatrix.ts   # 相性マトリクス
│   │   │   └── algorithmWeights.ts      # 各種スコアリング重み
│   │   └── algorithms/            # 診断アルゴリズム実装
│   │       ├── PopularityAlgorithm.ts
│   │       ├── CompatibilityAlgorithm.ts
│   │       ├── AttachmentAlgorithm.ts
│   │       └── TimeAllocationAlgorithm.ts
│   │
│   ├── interface/                 # インターフェース層
│   │   ├── http/                  # HTTPハンドラー
│   │   │   └── DiagnosisHandler.ts
│   │   └── validators/            # バリデーション
│   │       └── DiagnosisInputValidator.ts
│   │
│   └── shared/                    # 共通ユーティリティ
│       ├── errors/
│       │   └── DomainError.ts
│       └── utils/
│           └── logger.ts
│
├── serverless.yml                 # Serverless Framework設定
├── tsconfig.json
└── package.json
```

### 3.2 レイヤー責務

#### ドメイン層（Domain Layer）

- **責務**: ビジネスロジックの中核
- **依存**: なし（完全に独立）
- **内容**:
  - エンティティ: DiagnosisResult, MBTIType, LoveType
  - 値オブジェクト: CompatibilityScore, AttachmentStyle
  - ドメインサービス: 複雑な診断ロジック

#### アプリケーション層（Application Layer）

- **責務**: ユースケースの調整
- **依存**: ドメイン層のみ
- **内容**:
  - ユースケース: 診断実行、結果取得、画像生成
  - DTO: 入出力データの変換

#### インフラ層（Infrastructure Layer）

- **責務**: 外部システムとの接続・静的データ管理
- **依存**: ドメイン層・アプリケーション層
- **内容**:
  - 静的データ定義（256 通りの診断データ）
  - アルゴリズム具体実装
  - 将来: リポジトリ実装（DynamoDB）、外部サービス（S3, SNS）

#### インターフェース層（Interface Layer）

- **責務**: 外部からのリクエスト処理
- **依存**: アプリケーション層
- **内容**:
  - Lambda ハンドラー
  - バリデーション

## 4. データフロー（初期リリース - ステートレス）

```
1. API Gateway
   ↓
2. Lambda Handler (Interface Layer)
   ↓ 入力バリデーション（MBTI, LoveType）
3. ExecuteDiagnosisUseCase (Application Layer)
   ↓ ビジネスロジック調整
4. Domain Service (Domain Layer)
   ↓ 診断アルゴリズム実行
5. Algorithm + Static Data (Infrastructure Layer)
   ↓ 静的データ参照・計算
6. DiagnosisResult (メモリ上のみ)
   ↓
7. JSON レスポンス返却（永続化なし）
```

## 5. API 設計原則

- **完全ステートレス**: セッション・DB 保存なし
- **RESTful API**: 標準的な HTTP メソッド
- **JSON 形式**: リクエスト・レスポンス共通
- **エラーハンドリングの統一**: 統一されたエラーレスポンス
- **CORS 対応**: フロントエンドからのアクセス許可
- **冪等性**: 同じ入力には同じ結果を返す

## 6. セキュリティ

- HTTPS 必須（CloudFront + ACM）
- API Gateway のレート制限
- 入力バリデーション
- XSS 対策（フロントエンド）
- 環境変数での機密情報管理

## 7. 監視・ログ

### 7.1 アプリケーション監視

- CloudWatch Logs: Lambda 実行ログ
- CloudWatch Metrics: エラー率、レスポンスタイム
- X-Ray: 分散トレーシング（オプション）

### 7.2 コスト監視

| ツール                    | 用途         | 設定内容                       |
| ------------------------- | ------------ | ------------------------------ |
| AWS Budgets               | 予算アラート | 月額$10 でアラート設定         |
| Cost Explorer             | コスト分析   | サービス別・日別のコスト可視化 |
| CloudWatch Billing Alarms | 請求アラート | 閾値超過時のメール通知         |

**アラート設定例**:

- 月額コストが$7 を超えたら警告
- 月額コストが$15 を超えたら緊急アラート
- 日次コストが異常に高い場合の通知
