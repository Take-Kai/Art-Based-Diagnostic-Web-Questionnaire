const path = require("path");

/*
document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions(); // サーバーから質問を取得
});
*/

const questionList = document.getElementById("questionList");
const editor = document.getElementById("editor");
const editQuestionInput = document.getElementById("editQuestion");
const editInputType = document.getElementById("editInputType");
const editOptionsInput = document.getElementById("editOptions");
const saveButton = document.getElementById("saveQuestion");
const deleteButton = document.getElementById("deleteQuestion");
let editingIndex = null; // 現在編集中の質問のインデックス


const questionsFilePath = path.join(__dirname, "../shared/questions.json");


/*
// 1. 質問一覧を取得して表示
async function fetchQuestions() {
  try {
      const response = await fetch('/api/questions');
      const questions = await response.json();
      displayQuestions(questions);
  } catch (error) {
      console.error("質問データの取得に失敗しました:", error);
  }
}
*/

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

// 2. 質問一覧を表示
function displayQuestions(questions) {
  questionList.innerHTML = ""; // 一旦クリア

  questions.forEach((q, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
          ${index + 1}. ${q.question} (${q.inputType})
          <button onclick="editQuestion(${index})">編集</button>
      `;
      questionList.appendChild(li);
  });
}

// 3. 編集モードを開く
function editQuestion(index) {
  fetch('/api/questions')
      .then(res => res.json())
      .then(questions => {
          const q = questions[index];
          editingIndex = index;
          editQuestionInput.value = q.question;
          editInputType.value = q.inputType || "text";
          editOptionsInput.value = q.options ? q.options.join(",") : "";
          editor.style.display = "block"; // エディタを表示
      });
}

// 4. 質問を更新
saveButton.addEventListener("click", () => {
  const updatedQuestion = editQuestionInput.value;
  const updatedInputType = editInputType.value;
  const updatedOptions = editOptionsInput.value.split(",").map(opt => opt.trim());

  fetch('/api/edit-question', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          index: editingIndex,
          question: updatedQuestion,
          inputType: updatedInputType,
          options: updatedInputType === "radio" ? updatedOptions : null
      })
  }).then(() => {
      editor.style.display = "none"; // 編集画面を閉じる
      fetchQuestions(); // 更新後の質問を再取得
  });
});

// 5. 質問を削除
deleteButton.addEventListener("click", () => {
  if (!confirm("本当に削除しますか？")) return;

  fetch('/api/delete-question', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: editingIndex })
  }).then(() => {
      editor.style.display = "none"; // 編集画面を閉じる
      fetchQuestions(); // 質問を再取得
  });
});

// 6. 新しい質問を追加
document.getElementById("addQuestion").addEventListener("click", () => {
  const newQuestion = prompt("新しい質問を入力してください:");
  if (!newQuestion) return;

  const inputType = prompt("回答タイプを入力してください (text / radio / yesno)");
  if (!inputType) return;

  const options = inputType === "radio"
      ? prompt("選択肢をカンマ区切りで入力してください:").split(",").map(opt => opt.trim())
      : null;

  fetch('/api/add-question', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQuestion, inputType, options })
  }).then(() => fetchQuestions());
});
