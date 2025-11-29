リファクタリング診断レポート

🔴 優先度：高（重要な改善）

1. コードの重複 - 静的ページ（Terms, Privacy, Contact）

問題点:

- Terms.tsx, Privacy.tsx, Contact.tsx に同じパターンが繰り返されている
- useEffect(() => { window.scrollTo(0, 0); }, []) が 3 箇所に重複
- 「← トップに戻る」ボタンが重複
- 同じレイアウト構造

推奨リファクタリング:
// 新規: components/StaticPageLayout.tsx
// 新規: hooks/useScrollToTop.ts

効果: コード量 -60%、保守性向上

---

2. セッションストレージの直接操作

問題点:

- Start.tsx, Processing.tsx, Results.tsx で sessionStorage を直接操作
- エラーハンドリングなし
- 型安全性が低い
- テストが困難

推奨リファクタリング:
// 新規: hooks/useSessionStorage.ts
// 新規: utils/storage.ts

効果: 型安全性向上、エラーハンドリング、テスト容易性

---

3. API 呼び出しロジックの分離

問題点:

- Processing.tsx に API 呼び出しロジックが直接記述されている
- エラーハンドリングが不十分
- 環境変数の扱いが適切でない
- axios は依存関係にあるが使われていない（fetch 使用）

推奨リファクタリング:
// 新規: services/api.ts または api/diagnosis.ts
// 新規: hooks/useDiagnosis.ts

効果: 関心の分離、再利用性、テスト容易性

---

4. 定数とスタイルの重複

問題点:

- ボタンのクラス名が複数箇所に重複
- グラデーションクラス bg-gradient-lovy の使用箇所が多い
- アニメーションの定義が Results.tsx に直接記述

推奨リファクタリング:
// 新規: components/Button.tsx
// 新規: components/GradientText.tsx
// 新規: utils/constants.ts

効果: 一貫性、保守性、再利用性

---

🟡 優先度：中（改善推奨）

5. Results.tsx の肥大化

問題点:

- 1000 行超の巨大コンポーネント
- 複数の責務（状態管理、UI、アニメーション、画像生成）
- 複雑な useEffect、Intersection Observer

推奨リファクタリング:
// 分割案:
// - components/results/ScoreSection.tsx
// - components/results/PersonalitySection.tsx
// - components/results/CompatibilitySection.tsx
// - components/results/LoveLanguageSection.tsx
// - components/results/LifeAllocationChart.tsx
// - hooks/useScrollAnimation.ts
// - hooks/useShareImage.ts

効果: 可読性、保守性、再利用性

---

6. 型定義の改善

問題点:

- UserProfile の mbti と loveType が | '' を許容（型安全性が低い）
- オプショナルチェーンが多用される原因

推奨リファクタリング:
// 改善案:
export interface UserProfileInput {
nickname: string;
mbti: MBTIType | '';
loveType: LoveType | '';
}

export interface UserProfile {
nickname: string;
mbti: MBTIType;
loveType: LoveType;
}

効果: 型安全性向上、バグ削減

---

7. 未使用ファイルの削除

問題点:

- App.css が存在するが使われていない可能性
- assets/react.svg が未使用
- axios がインストールされているが未使用

推奨リファクタリング:

- 未使用ファイルを削除
- package.json から axios を削除（または fetch を axios に統一）

効果: バンドルサイズ削減、依存関係の整理

---

🟢 優先度：低（最適化）

8. ディレクトリ構造の改善

現在の構造:
src/
├── components/
├── pages/
├── types/

推奨構造:
src/
├── components/
│ ├── common/ (Button, GradientText など)
│ ├── layout/ (Header, Footer, PageBackground)
│ └── results/ (Results 関連コンポーネント)
├── pages/
├── hooks/ (カスタムフック)
├── services/ (API 呼び出し)
├── utils/ (ユーティリティ関数)
├── constants/ (定数)
└── types/

---

9. アクセシビリティの改善

問題点:

- ボタンに適切な aria-label がない
- キーボードナビゲーションの考慮不足

推奨リファクタリング:

- セマンティック HTML
- ARIA 属性の追加
- フォーカス管理

---

10. パフォーマンス最適化

問題点:

- PageBackground のバブルアニメーションが重い可能性
- Results.tsx の複数の Intersection Observer

推奨リファクタリング:

- React.memo の活用
- useMemo, useCallback の最適化
- 仮想化（必要に応じて）

---

📋 リファクタリング実施順序の推奨

1. フェーズ 1（基盤整備）:

   - セッションストレージの抽象化
   - API 呼び出しの分離
   - 共通コンポーネント作成（Button, GradientText）

2. フェーズ 2（構造改善）:

   - 静的ページのリファクタリング
   - Results.tsx の分割
   - ディレクトリ構造の整理

3. フェーズ 3（最適化）:

   - 型定義の改善
   - パフォーマンス最適化
   - アクセシビリティ改善
   - 入力バリデーション追加
   - バリデーションエラー表示追加

   - セッションストレージの構造の最適化、特に resultWithNickname

---
