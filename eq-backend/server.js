require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Проверка наличия MONGO_URI
if (!process.env.MONGO_URI) {
    console.error("Критическая ошибка: Переменная MONGO_URI не задана в окружении!");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ База данных подключена'))
    .catch(err => console.error('❌ Ошибка БД:', err));

// Схемы
const Stat = mongoose.model('Stat', new mongoose.Schema({
    choiceId: String,
    count: { type: Number, default: 0 }
}));

const Leaderboard = mongoose.model('Leaderboard', new mongoose.Schema({
    name: String,
    score: Number,
    date: { type: Date, default: Date.now }
}));

const Comment = mongoose.model('Comment', new mongoose.Schema({
    name: String,
    text: String,
    date: { type: Date, default: Date.now }
}));

// Роуты
app.get('/', (req, res) => res.send('API is active. Use /api/stats, /api/leaderboard or /api/comments'));

app.post('/api/stats', async (req, res) => {
    const { choiceId } = req.body;
    if (!choiceId) return res.status(400).json({ error: 'choiceId is required' });
    try {
        await Stat.findOneAndUpdate({ choiceId }, { $inc: { count: 1 } }, { upsert: true });
        res.json(await Stat.find());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/leaderboard', async (req, res) => {
    try {
        const newEntry = new Leaderboard(req.body);
        await newEntry.save();
        res.json(await Leaderboard.find().sort({ score: -1 }).limit(10));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/leaderboard', async (req, res) => {
    res.json(await Leaderboard.find().sort({ score: -1 }).limit(10));
});

app.post('/api/comments', async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.json(await Comment.find().sort({ date: -1 }).limit(20));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/comments', async (req, res) => {
    res.json(await Comment.find().sort({ date: -1 }).limit(20));
});

const PORT = process.env.PORT || 10000; // Render предпочитает 10000
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));