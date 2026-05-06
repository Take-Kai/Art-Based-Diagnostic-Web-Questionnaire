const introScreen = document.getElementById('intro-screen');
const surveyScreen = document.getElementById('survey-screen');
const questionElement = document.getElementById('question');
const inputContainer = document.getElementById('input-container');
const exportButton = document.getElementById('export-button');

let selectedGender = null;

// アンケート開始ボタン
const startSurveyButton = document.getElementById('start-survey-button');
startSurveyButton.addEventListener('click', () => {
  introScreen.style.display = 'none';
  surveyScreen.style.display = 'block';
  loadQuestion();
});

async function fetchQuestions() {
  try {
      const response = await fetch('/api/questions'); // `survey_editor_app` の API を使う
      const questions = await response.json();
      console.log("取得した質問リスト:", questions);
      return questions;
  } catch (error) {
      console.error("質問データの取得に失敗しました:", error);
      return [];
  }
}


const loadQuestion = async () => {
  try {
    const response = await fetch('/questions');
    const data = await response.json();

    console.log("サーバーから取得したデータ:", data);

    // 質問内容の更新
    questionElement.textContent = data.result ? `結果: ${data.result}` : data.question;

    // 入力欄を動的に生成
    inputContainer.innerHTML = ''; // 前の要素をクリア

    if (data.result) {
      // 結果の場合、「データを送信」ボタンを表示
      //exportButton.style.display = 'none';

      // 結果画面後に次へ進むボタンを追加
      const nextButton = document.createElement('button');
      nextButton.textContent = '次へ';

      nextButton.addEventListener('click', async () => {
        console.log('次へボタンがクリックされました');
        const response = await fetch(`/answer?choice=next`);
        if (response.ok) {
          console.log('次へリクエスト送信成功');
          loadQuestion();
        } else {
          alert('次の画面に進めませんでした');
        }
      });
      inputContainer.appendChild(nextButton);
      return;
    }

    // 質問に応じた入力欄を生成
    if (data.inputType === 'text') {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'ここに入力してください';
      inputContainer.appendChild(input);

      const nextButton = document.createElement('button');
      nextButton.textContent = '次へ';
      nextButton.addEventListener('click', async () => {
        const answer = input.value.trim();
        if (answer) {
          await fetch(`/answer?choice=${encodeURIComponent(answer)}`);
          loadQuestion();
        } else {
          alert('回答を入力してください。');
        }
      });
      inputContainer.appendChild(nextButton);
    } else if (data.inputType === 'choice') {
        const yesButton = document.createElement('button');
        yesButton.textContent = 'はい';
        yesButton.addEventListener('click', async () => {
          await fetch('/answer?choice=yes');
          loadQuestion();
        });
        inputContainer.appendChild(yesButton);

        const noButton = document.createElement('button');
        noButton.textContent = 'いいえ';
        noButton.addEventListener('click', async () => {
          await fetch('/answer?choice=no');
          loadQuestion();
      });
      inputContainer.appendChild(noButton);
    } else if (data.inputType === 'radio') {
        // ラジオボタンを生成
        data.options.forEach(option => {
        const label = document.createElement('label');
        label.textContent = option;

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'gender';
        radio.value = option;

      if (selectedGender === option) {
        radio.checked = true;
      }

        label.appendChild(radio);
        inputContainer.appendChild(label);
    });

      const nextButton = document.createElement('button');
      nextButton.textContent = '次へ';
      nextButton.addEventListener('click', async () => {
        console.log('次へボタンがクリックされました');
        const selectedOption = document.querySelector('input[name="gender"]:checked');
        if (selectedOption) {
          selectedGender = selectedOption.value;
          console.log(`選択された性別: ${selectedGender}`);
        // await fetch(`/answer?choice=${encodeURIComponent(selectedOption.value)}`);
          await fetch(`/answer?choice=${encodeURIComponent(selectedGender)}`);
          loadQuestion();
        } else {
          alert('選択肢を選んでください');
        }
      });
      inputContainer.appendChild(nextButton);
    }
  } catch (error) {
    console.error('エラー発生', error);
    alert('質問データの取得に失敗しました');
  }
};

// 「データを送信」ボタンの動作
exportButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/export');
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'answers.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);

      // 送信完了後に「ご協力ありがとうございました」画面に遷移
      questionElement.textContent = 'ご協力ありがとうございました';
      inputContainer.innerHTML = '';
      exportButton.style.display = 'none';
    } else {
      alert('データの送信に失敗しました。');
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
    alert('データの送信中にエラーが発生しました。');
  }
});

exportButton.style.display = 'none';

const checkFinalScreen = () => {
  if (questionElement.textContent === 'ご協力ありがとうございました') {
    exportButton.style.display = 'block';
  } else {
    exportButton.style.display = 'none';
  }
};

setInterval(checkFinalScreen, 500);


const exhibitionInfoButton = document.createElement('button');
exhibitionInfoButton.textContent = '展示情報を送信する';
exhibitionInfoButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/send-exhibition-info');
    const data = await response.json();

    if (data.status === 'ok') {
      alert('展示情報がメールで送信されました');
    } else {
      alert('メールアドレスがありません');
    }
  } catch (error) {
    console.error('エラー:', error);
  }
});

loadQuestion();
