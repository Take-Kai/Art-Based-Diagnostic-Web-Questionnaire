# アート診断型Webアンケート

八戸高専 専攻科2年次の「エンジニアリングデザイン」等科目でのプロジェクトです．

八戸市美術館における来館者アンケートの解答率向上という課題に対し，アンケートに回答してもらえるようにエンタメ要素を加えたWebアプリを提案，作成しました．

「解凍すること自体が楽しくなる」という体験の提供を目指し，性格や興味からおすすめのアートジャンルを愛知アンするアート診断の要素をアンケートに組み込みました．

制作の背景や動作例などは[Notionページ](https://wholesale-beginner-8e9.notion.site/347306a87b4980d481f2d9815bac4a0a?v=347306a87b498023832d000cf5d8d356&p=359306a87b49803d8d1ec598c8a7dd0f&pm=c)からご覧いただけます．

動作の様子は[デモ動画（Google Drive）](https://drive.google.com/file/d/1sgpjwqQihfY0sp-8GcHwaIxMvzabfhy6/view?usp=sharing)からご覧いただけます．

---

## ⚒️ 開発環境
- **Frontend**：HTML, CSS, JavaScript
- **Backend**：Node.js, Express
- **Data Storage**：Excel

## 📁 メイン処理
「アンケートに回答するアプリ」と「質問を編集するアプリ」の2つで構成されています．

### 1. アンケート回答アプリ(`survey_test_artmuseum/`)
- [Script.js]
  - `question.json`からデータを読み込み，ユーザの「はい/いいえ」の選択に応じて次に表示する質問を切り替える．
- [app.js]
  - 回答結果とメールアドレスをExcelファイル(`answer.xlsx`)へ蓄積・出力．
 
### 2. アンケート編集アプリ(`survey_editor_app/`)
- 管理者がプログラミングの知識なしで，質問項目や分岐先をブラウザ上で編集・更新できるシステム．
- [server.js]
  - 編集された質問項目の保存や更新

### 3. 質問やおすすめジャンルの定義(`Shared/`)
- [question.json]
  - 質問項目，分岐先番号，最終結果のジャンルを構造化したJSONファイル．
