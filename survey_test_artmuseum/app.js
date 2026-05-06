const express = require('express');
const path = require('path');
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();

const questionsFilePath = path.join(__dirname, "../shared/questions.json");

// 回答の履歴を保存
const answers = [];

// Excelファイルパス
const excelFilePath = path.join(__dirname, 'answers.xlsx');

// サーバー起動時に既存の回答を復元
if (fs.existsSync(excelFilePath)) {
  const workbook = XLSX.readFile(excelFilePath);
  workbook.SheetNames.forEach((sheetName) => {
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    if (sheetData.length > 1) {
      // シートデータの2行目以降を answers に復元
      sheetData.slice(1).forEach((row) => {
        answers.push({
          question: row[1],
          answer: row[2],
        });
      });
    }
  });
}

if (fs.existsSync(excelFilePath)) {
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = '結果とメールアドレス';
  
    if (workbook.SheetNames.includes(sheetName)) {
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
  
      // ヘッダー行を除いてanswers配列に復元
      if (sheetData.length > 1) {
        sheetData.slice(1).forEach((row) => {
          answers.push({
            question: '最終結果',
            answer: `おすすめジャンル: ${row[1]} -`, // 復元時にフォーマットを揃える
          });
          answers.push({
            question: 'メールアドレスを入力してください',
            answer: row[2],
          });
        });
      }
    }
  }

  // publicディレクトリ内に保存している静的ファイルを取り出す
app.use(express.static(path.join(__dirname, 'public')));

function loadQuestions() {
  try {
    const data = fs.readFileSync(questionsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading questions:", error);
    return [];
  }
}

let questions = loadQuestions();
console.log("読み込んだ質問リスト:", questions);
// module.exports = { questions, loadQuestions };



// 質問と結果を格納
// const questions = [
// /* 0 */ { question: '性別を選んでください', inputType: 'radio', options: ['男性', '女性', 'その他'], next: 1 },
// /* 1 */ { question: '年齢を教えてください', inputType: 'text', next: 2},
// /* 2 */ { question: '本日美術館に来た目的を教えてください（展示鑑賞のため/学びのためなど）', inputType: 'text', next: 3 },
// /* 3 */ { question: '展示内容に満足しましたか？', inputType: 'choice', yesNext: 4, noNext: 4 },
// /* 4 */ { question: '展示のどの部分が印象的でしたか？（具体的に教えてください）', inputType: 'text', next: 5 },

//   /* 5 */ { question: 'アートを見て明るい気持ちになりたいと思いますか？', inputType: 'choice', yesNext: 6, noNext: 7 },
//  /* 6 */ { question: 'プリンセスや聖母マリアに惹かれますか？', inputType: 'choice', yesNext: 8, noNext: 9 },
//  /* 7 */ { question: 'ヘンテコなものに出会いたいと思いますか？', inputType: 'choice', yesNext: 10, noNext: 11 },
//  /* 8 */ { question: 'ボタニカルという言葉に弱いですか？', inputType: 'choice', yesNext: 16, noNext: 12 },
//  /* 9 */ { question: '旅行では景色を楽しむ方ですか？', inputType: 'choice', yesNext: 13, noNext: 14 },
// /* 10 */ { question: '心理学に興味がありますか？', inputType: 'choice', yesNext: 24, noNext: 15 },
// /* 11 */ { question: '陰影がカッコいい絵を見たいと思いますか？', inputType: 'choice', yesNext: 27, noNext: 16 },
// /* 12 */ { question: 'ゆめかわなテイストでも好んで見たいと思いますか？', inputType: 'choice', yesNext: 18, noNext: 19 },
// /* 13 */ { question: '晴れている日が好きですか？', inputType: 'choice', yesNext: 20, noNext: 21 },
// /* 14 */ { question: '現代アートが気になりますか？', inputType: 'choice', yesNext: 22, noNext: 23 },
// /* 15 */ { question: '破壊衝動に駆られる時がありますか？', inputType: 'choice', yesNext: 25, noNext: 26 },
// /* 16 */ { question: '退廃的なものに惹かれますか？', inputType: 'choice', yesNext: 28, noNext: 29 },

// /* 17 */ { result: 'おすすめジャンル: アール・ヌーヴォー', next: 30},
// /* 18 */ { result: 'おすすめジャンル: ロココ' , next: 30 },
// /* 19 */ { result: 'おすすめジャンル: ゴシック' , next: 30 },
// /* 20 */ { result: 'おすすめジャンル: 印象主義' , next: 30 },
// /* 21 */ { result: 'おすすめジャンル: 写実主義', next: 30},
// /* 22 */ { result: 'おすすめジャンル: ポップアート', next: 30 },
// /* 23 */ { result: 'おすすめジャンル: ルネサンス', next: 30 },
// /* 24 */ { result: 'おすすめジャンル: シュルレアリスム', next: 30 },
// /* 25 */ { result: 'おすすめジャンル: ダダイズム', next: 30 },
// /* 26 */ { result: 'おすすめジャンル: キュビズム', next: 30 },
// /* 27 */ { result: 'おすすめジャンル: バロック', next: 30 },
// /* 28 */ { result: 'おすすめジャンル: 象徴主義', next: 30 },
// /* 29 */ { result: 'おすすめジャンル: フォービズム', next: 30 },

// /* 30 */ { question: 'このジャンルに関する展示情報を受け取りますか？', inputType: 'choice', yesNext: 31, noNext: 32 },
// /* 31 */ { question: 'メールアドレスを入力してください', inputType: 'text', next: 32},
// /* 32 */ { question: 'ご協力ありがとうございました', inputType: null, showExportButton: true }
// ];

// 現在の質問番号
let currentQuestionIndex = 0;

// /questionというパスに対してGETリクエストを送った時に呼び出される
app.get('/questions', (req, res) => {
  const questionData = questions[currentQuestionIndex];
  res.json(questionData || { question: '質問が見つかりません', inputType: null});
});


// データ削除（開発用なので運用時はここはコメントアウト）
app.get('/delete-data', (req, res) => {
    try {
        // Excelファイルを削除
        if (fs.existsSync(excelFilePath)) {
            fs.unlikeSync(excelFilePath);
            console.log('Excelファイルが削除されました');
            res.json({ status: 'ok', message: 'データが削除されました' });
        } else {
            res.json({ status: 'error', message: '削除するデータが存在しません '});
        } 
    } catch (error) {
        console.error('データ削除中にエラーが発生しました:', error);
        res.status(500).send('データ削除中にエラーが発生しました');
    }
});


const saveAnswersToExcel = () => {
  const resultSheetData = prepareResultData();
  generateExcelFile(excelFilePath, resultSheetData);
  console.log("ファイルが正常に保存されました");
};

  //  結果とメールアドレスのデータを収集する関数
const prepareResultData = () => {
    const resultSheetData = [['No', 'Result', 'Email']]; // ヘッダー行
    let no = 1;
    let currentIndex = 0;
  
    while (currentIndex < answers.length) {
      const resultAnswer = answers.find((item, idx) => idx >= currentIndex && item.question === '最終結果');
      if (!resultAnswer) break;
  
      const match = resultAnswer.answer.match(/おすすめジャンル: (.+?)( -|$)/);
      const result = match ? match[1] : '不明';
  
      const emailAnswer = answers.find(
        (item, idx) => idx > answers.indexOf(resultAnswer) && item.question === 'メールアドレスを入力してください'
      );
      const email = emailAnswer ? emailAnswer.answer || '無回答' : '無回答';
  
      resultSheetData.push([no, result, email]);
  
      currentIndex = answers.indexOf(emailAnswer) + 1 || answers.indexOf(resultAnswer) + 1;
      no++;
    }
  
    return resultSheetData;
  };
  
  // Excelファイルを生成する関数
  const generateExcelFile = (filePath, resultSheetData) => {
    const workbook = XLSX.utils.book_new();
  
    // 結果とメールアドレスのシートを追加
    const resultWorksheet = XLSX.utils.aoa_to_sheet(resultSheetData);
    XLSX.utils.book_append_sheet(workbook, resultWorksheet, '結果とメールアドレス');
  
    // 各質問ごとのシートを作成
    questions.forEach((item, index) => {
      if (index >= 5 && index <= 12) return; // 性格診断部分をスキップ
      if (item.result || item.question === 'ご協力ありがとうございました') return; // 結果ページや終了メッセージをスキップ
  
      const worksheetData = answers
        .filter(answer => answer.question === item.question)
        .map((item, i) => ({
          No: i + 1,
          Question: item.question,
          Answer: item.answer || '無回答',
        }));
  
      if (worksheetData.length === 0) {
        worksheetData.push({ No: 1, Question: item.question, Answer: '無回答' });
      }
  
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Q${index + 1}`);
    });
  
    XLSX.writeFile(workbook, filePath);
  };
  

app.get('/answer', (req, res) => {
  const choice = req.query.choice;

  // 質問または結果を保存
  if (questions[currentQuestionIndex].result) {
    // 結果の場合、resultをanswersに保存
    answers.push({
      question: '最終結果',
      answer: questions[currentQuestionIndex].result,
    });
  } else {
    answers.push({
      question: questions[currentQuestionIndex].question || '不明な質問',
      answer: choice || '無回答',
    });
  }

  // 次の質問に進む
  if (questions[currentQuestionIndex].result) {
    currentQuestionIndex = questions[currentQuestionIndex].next;
  } else if (questions[currentQuestionIndex].inputType === 'choice') {
    if (choice === 'yes') {
      currentQuestionIndex = questions[currentQuestionIndex].yesNext;
    }
    else if (choice === 'no') {
      currentQuestionIndex = questions[currentQuestionIndex].noNext;
    }
  } else if (questions[currentQuestionIndex].inputType === 'text' || questions[currentQuestionIndex].inputType === 'radio') {
    currentQuestionIndex = questions[currentQuestionIndex].next;
  }

  if (currentQuestionIndex === 21) {
    saveAnswersToExcel();
  }

  res.json({ status: 'ok', nextQuestion: questions[currentQuestionIndex] });
});


app.get('/export', (req, res) => {
    try {
      const resultSheetData = prepareResultData();
      const tempFilePath = path.join(__dirname, 'answers_temp.xlsx');
      generateExcelFile(tempFilePath, resultSheetData);
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="answers.xlsx"');
      res.download(tempFilePath, 'answers.xlsx', (err) => {
        if (err) {
          console.error('エクセルファイルのダウンロードに失敗しました:', err);
          res.status(500).send('エクセルファイルのダウンロードに失敗しました');
        } else {
          console.log('エクセルファイルが正常に送信されました');
          fs.unlinkSync(tempFilePath); // 一時ファイルを削除
        }
      });
    } catch (error) {
      console.error('エクセル生成中にエラーが発生しました:', error);
      res.status(500).send('エクセル生成中にエラーが発生しました');
    }
  });

app.listen(8000, () => {
  console.log('Server is running at http://localhost:8000');
});