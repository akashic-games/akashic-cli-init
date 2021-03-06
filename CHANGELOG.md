# CHANGELOG

## 0.3.5
* javascriptテンプレートのREADMEを更新

## 0.3.4
* javascriptテンプレートを更新
  * スクリプトファイルをlintしてES5構文になっているかチェックする機能を追加

## 0.3.3
* コピー先に既存のファイルが存在する場合は、デフォルトでは処理を中断するように修正
* forceオプションを追加。
  * このオプションを指定した場合、コピー先の既存ファイルも上書きされます
* 各種依存モジュールの更新

## 0.3.2
* テンプレートを更新

## 0.3.1
* テンプレートを更新

## 0.3.0
* デフォルトで akashic-engine@2.0.0 を利用したテンプレートを出力するように

## 0.2.6
* ユーザーホームディレクトリのビルトインテンプレートを利用しない
  * テンプレートタイプに akashic-cli-init ビルトインの `javascript` `typescript` が指定された場合、ユーザーホームディレクトリに古いテンプレートが残っていても利用しないようになります。
    * これにより、 akashic-cli-init は常に最新のテンプレートを出力するようになります。

## 0.2.5
* テンプレートを更新
  * akashic-cli-init@0.2.4 以前のバージョンから 0.2.5 にアップデートする場合、テンプレートの更新を反映するには、ユーザーホームディレクトリにある `.akashic-templates` ディレクトリを削除する必要があります。

## 0.2.4
* --list オプションの有効化

## 0.2.3
* templatesをzipで持たないようにする対応

## 0.2.2
* typescript テンプレートを更新
  * テンプレートの更新を反映するには、 `npm install @akashic/akashic-cli` を実行し、 `~/.akashic-templates` を削除した後、 `akashic init` を実行してください。

## 0.2.1
* Node.js 7 で正常に動作しない場合がある問題の対応

## 0.2.0
* Node.js 7 対応

## 0.1.6
* javascript のテンプレートが生成できないバグの修正

## 0.1.5
* template.json のガイドメッセージ表示機能を追加

## 0.1.4
* 初期リリース
