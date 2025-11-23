# Lovy.ai

Love & Personality Diagnosis Platform - MBTI × Love Type 16 による 256 通りの診断サービス

## 概要

Lovy.ai は、MBTI（16 タイプ）と Love Type 16（16 タイプ）を組み合わせた 256 通りの恋愛・性格診断プラットフォームです。

### 診断結果の内容

1. **モテ度スコア** - あなたの恋愛市場での魅力度を数値化
2. **性格分析** - MBTI × Love Type の組み合わせによる詳細な性格テキスト
3. **相性診断** - あなたに最適な相手の Top 3
4. **愛着表現ランキング** - 5 つの愛の言語の優先順位
5. **時間配分分析** - 恋愛、仕事、趣味などの理想的なバランス

## 技術スタック

### フロントエンド

- **React** 18.x - UI フレームワーク
- **TypeScript** 5.x - 型安全な開発
- **Vite** 5.x - ビルドツール
- **React Router** 6.x - ルーティング
- **Tailwind CSS** 3.x - スタイリング
- **html2canvas** 1.x - 診断結果の画像生成

### バックエンド

- **TypeScript** 5.x - 開発言語
- **Node.js** 20.x - ランタイム
- **Serverless Framework** 3.x - デプロイ管理
- **AWS Lambda** - サーバーレス関数実行
- **API Gateway** - REST API エンドポイント

### インフラ (AWS)

- Lambda - 診断ロジック実行
- API Gateway - REST API
- S3 - 静的ファイルホスティング
- CloudFront - CDN 配信
- Route53 - DNS 管理
- CloudWatch - ログ・モニタリング

### アーキテクチャ

- **DDD (Domain-Driven Design)** - ドメイン駆動設計
- **オニオンアーキテクチャ** - 依存関係の制御
- **ステートレス設計** - 診断結果は永続化せず、リクエストごとに計算

## プロジェクト構造

```
.
├── backend/              # バックエンドAPI (Serverless Framework)
│   ├── src/
│   │   ├── domain/       # ドメイン層（エンティティ、値オブジェクト）
│   │   ├── application/  # アプリケーション層（ユースケース、DTO）
│   │   ├── infrastructure/ # インフラ層（静的データ、アルゴリズム）
│   │   ├── interface/    # インターフェース層（HTTPハンドラー）
│   │   └── shared/       # 共通ユーティリティ
│   ├── serverless.yml
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/             # フロントエンド (React + Vite)
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docs/                 # 設計ドキュメント
│   ├── 01_overview仮.md
│   ├── 02_functional-requirements仮.md
│   ├── 03_technical-architecture-fix.md
│   ├── 04_api-specification-fix.md
│   ├── 05_data-model仮.md
│   └── 06_development-plan.md
│
└── package.json          # ルートレベルのスクリプト管理
```

## セットアップ

### 前提条件

- Node.js 20.x 以上
- npm 9.x 以上
- AWS CLI (デプロイ時)
- Serverless Framework CLI

### インストール

```bash
# 全プロジェクトの依存関係をインストール
npm run install:all

# または個別にインストール
npm install
cd backend && npm install
cd ../frontend && npm install
```

## 開発

### バックエンド開発

```bash
# ローカルでLambda関数を実行
npm run dev:backend

# 型チェック
cd backend && npm run typecheck

# テスト実行
cd backend && npm test

# リンター
cd backend && npm run lint
```

### フロントエンド開発

```bash
# 開発サーバー起動
npm run dev:frontend

# ビルド
cd frontend && npm run build

# プレビュー
cd frontend && npm run preview
```

### 全体のコマンド

```bash
# 全体のビルド
npm run build:all

# 全体のテスト
npm run test:all

# 全体のリンター
npm run lint:all

# クリーンアップ
npm run clean
```

## デプロイ

### 開発環境へのデプロイ

```bash
npm run deploy:dev
```

### 本番環境へのデプロイ

```bash
npm run deploy:prod
```

## API 仕様

### 診断実行エンドポイント

```
POST /api/v1/diagnosis
```

**リクエスト:**

```json
{
  "mbti": "ENFJ",
  "loveType": "FARE"
}
```

**レスポンス:**

```json
{
  "success": true,
  "data": {
    "mbti": "ENFJ",
    "loveType": "FARE",
    "results": {
      "attractiveness": { "totalScore": 85, "description": "..." },
      "personalityAxis": { "topThreeTraits": [...], "description": "..." },
      "compatibility": { "top3": [...] },
      "loveLanguages": [...],
      "lifeAllocation": { "romance": 30, "career": 25, ... }
    }
  },
  "error": null
}
```

詳細は `docs/04_api-specification-fix.md` を参照してください。

## テスト

```bash
# バックエンドのテスト
cd backend && npm test

# カバレッジ付きテスト
cd backend && npm run test:coverage

# 監視モード
cd backend && npm run test:watch
```

## ライセンス

ISC

## 開発計画

詳細な開発計画は `docs/06_development-plan.md` を参照してください。

### Phase 1: 基盤構築 (Week 1-2) ✓

- [x] プロジェクト初期セットアップ
- [x] バックエンド: Serverless Framework 設定
- [x] フロントエンド: Vite + React + TypeScript 環境構築
- [x] DDD/オニオンアーキテクチャのディレクトリ構造作成

### Phase 2: ドメインロジック実装 (Week 3-4)

- [ ] ドメイン層の実装
- [ ] 5 つの診断アルゴリズム実装

### Phase 3: API 実装 (Week 5-6)

- [ ] アプリケーション層の実装
- [ ] インフラ層の実装
- [ ] インターフェース層の実装

### Phase 4: フロントエンド実装 (Week 7-8)

- [ ] UI/UX デザイン
- [ ] ページ実装
- [ ] 結果画像生成・ダウンロード機能

### Phase 5: 統合・テスト (Week 9-10)

- [ ] E2E テスト
- [ ] パフォーマンステスト
- [ ] セキュリティテスト

### Phase 6: デプロイ・リリース (Week 11-12)

- [ ] 本番環境デプロイ
- [ ] モニタリング設定
- [ ] 正式リリース
