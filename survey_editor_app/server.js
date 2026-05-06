const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const questionsFilePath = path.join(__dirname, "../shared/questions.json");

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.get('/api/questions', (req, res) => {
  const questions = loadQuestions();
  res.json(questions);
});

app.post('/api/edit-question', (req, res) => {
  const { index, newQuestion } = req.body;
  const questions = loadQuestions();
  questions[index].question = newQuestion;
  saveQuestions(questions);
  res.json({ success: true });
});

app.post('/api/delete-question', (req, res) => {
  const { index } = req.body;
  let questions = loadQuestions();
  questions.splice(index, 1);
  saveQuestions(questions);
  res.json({ success: true });
});

app.post('/api/add-question', (req, res) => {
  const { question, inputType } = req.body;
  let questions = loadQuestions();
  questions.push({ question, inputType });
  saveQuestions(questions);
  res.json({ success: true });
});


// 質問リストを取得
app.get("/questions", (req, res) => {
    try {
        const data = fs.readFileSync(questionsFilePath, "utf-8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Error loading questions:", error);
        res.status(500).json({ error: "Failed to load questions" });
    }
});

// 質問を削除
app.delete("/questions/:index", (req, res) => {
    try {
        const index = parseInt(req.params.index, 10);
        let questions = JSON.parse(fs.readFileSync(questionsFilePath, "utf-8"));

        if (index < 0 || index >= questions.length) {
            return res.status(400).json({ error: "Invalid index" });
        }

        questions.splice(index, 1);
        fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2), "utf-8");

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ error: "Failed to delete question" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
