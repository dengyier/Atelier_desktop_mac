# Atelier Desktop

**アートと AI を、ひとつのローカルワークスペースに。** Atelier Desktop は macOS 向けのローカルプレビューです。制作テーマから資料調査、編集可能な制作ファイル、確認できるビジュアル成果までをつなぎます。[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) と MIT ライセンスの [DSH Desktop](https://github.com/dataelement/dsh-desktop) を基盤とし、Atelier 独自のブランド、画面、制作プリセット、ユーザープロファイルを備えます。

[English](README.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md)

## このプレビューでできること

- **アート・3D 制作：** 新しいセッションでは *Atelier Creative Mode* が既定です。Blender ワークフロー Skill と `mcp-for-blender` の接続設定を含みます。Blender 本体と MCP アドオンは別途インストールが必要です。
- **日常業務：** 文書処理、データ分析・可視化、議事録、調査レポート、スライドのボタンは編集可能なプロンプトを入力欄へ挿入します。クリックだけでタスクは送信されません。
- **確認できる成果物：** 3D ワークフローでは編集可能なシーンを保存し、レンダリング画像を確認します。回答にファイル名があるだけでは、生成や検証の証拠にはなりません。
- **モデルとツール：** アプリ内でモデルプロバイダーを設定します。MCP コネクターマーケットにはアート・デザイン向けの選定項目があります。Atelier プリセットへ追加した後、新しいセッションでツール接続を確認してください。コミュニティプラグインマーケットは現在非表示です。
- **ローカル環境：** ワークスペース、セッション、設定は DSH と別の Atelier プロファイルに保存されます。画面は中国語・英語・フランス語に対応します。内蔵 PPT モードでは編集可能な PPTX を生成できます。

これは**初期のローカルプレビュー**です。Atelier 独自の署名済み公開版、更新フィード、自動更新はまだありません。リポジトリには上流のマルチプラットフォーム実装が残っていますが、現在の Atelier の手順と検証は macOS が中心です。DSH Desktop の公開版を Atelier の公開版とみなさないでください。また、このアプリは Atelier の複数ユーザー向け Web サービスの代替ではありません。

## macOS で実行

**Node.js 24** を使用し、リポジトリのルートで実行します。

```sh
npm ci
npm run dev
```

続いて **設定 → モデル** でモデルプロバイダーを設定してください。別の DSH プロファイルのキー、セッション、プラグインは自動取り込みされません。Apple Silicon 向けの未署名ローカルパッケージは次で作成できます。

```sh
npm run package:dev:mac:arm64
```

出力先は `dist-dev/` です。正式な配布用インストーラーではありません。

Blender を使う場合は Blender と `uvx` をインストールし、`mcp-for-blender==2.0.4` アドオンを有効化して `127.0.0.1:9876` でサービスを起動してください。制作前に MCP 接続を確認します。詳しくは [ローカルプレビューと納品のガイド](README-ATELIER.md) を参照してください。

## 開発・データ・出典

`npm test`、`npm run typecheck`、`npm run build` を実行し、変更した操作をアプリでも確認してください。[アーキテクチャ](docs/architecture.md)、[開発ガイド](docs/development.md)、[PPT ガイド](packages/ppt-runtime/README.md) は継承したホストを説明しており、一部に DSH の名称が残っています。

Atelier は Harness をローカルで起動し、独立したユーザーデータディレクトリを使用します。画面のプロセスには分離とサンドボックスが適用されます。モデルプロバイダーや MCP サービスは権限に応じてファイルへアクセスしたりデータを送信したりできます。機密資料を扱う前に接続先を確認し、認証情報や顧客ファイルをリポジトリへ登録しないでください。

DSH Desktop 由来のコードは [MIT ライセンス](LICENSE)に従います。DeepSeek Harness とその他のコンポーネントには各自のライセンスと保守者があります。Atelier は独立した派生プロジェクトであり、DeepSeek または DSH Desktop の公式版ではありません。

[Atelier 公式サイト](https://artsmart.space/) · [リポジトリ](https://github.com/dengyier/Atelier_desktop_mac)
