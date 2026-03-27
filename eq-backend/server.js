require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Позволяет нашему фронтенду делать запросы к бэкенду
app.use(express.json());

// Подключение к MongoDB (ссылку получим в MongoDB Atlas)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ База данных подключена'))
    .catch(err => console.log('❌ Ошибка БД:', err));

// === СХЕМЫ БАЗЫ ДАННЫХ ===

// 1. Схема для статистики выборов
const StatSchema = new mongoose.Schema({
    choiceId: String, // 'fear' или 'vision'
    count: { type: Number, default: 0 }
});
const Stat = mongoose.model('Stat', StatSchema);

// 2. Схема для Зала Славы (Leaderboard)
const LeaderboardSchema = new mongoose.Schema({
    name: String,
    score: Number,
    date: { type: Date, default: Date.now }
});
const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);

// 3. Схема для Комментариев
const CommentSchema = new mongoose.Schema({
    name: String,
    text: String,
    date: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', CommentSchema);


// === API РОУТЫ ===

// 1. СТАТИСТИКА: Записать выбор и получить общую стату
app.post('/api/stats', async (req, res) => {
    const { choiceId } = req.body;
    try {
        // Увеличиваем счетчик для конкретного выбора (или создаем, если нет)
        await Stat.findOneAndUpdate(
            { choiceId }, 
            { $inc: { count: 1 } }, 
            { upsert: true, new: true }
        );
        
        // Отдаем всю статистику обратно для отображения процентов
        const allStats = await Stat.find();
        res.json(allStats);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 2. LEADERBOARD: Добавить результат и получить ТОП-10
app.post('/api/leaderboard', async (req, res) => {
    const { name, score } = req.body;
    try {
        const newEntry = new Leaderboard({ name, score });
        await newEntry.save();
        
        // Возвращаем ТОП-10 по убыванию очков
        const top10 = await Leaderboard.find().sort({ score: -1 }).limit(10);
        res.json(top10);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получить ТОП-10 без сохранения (для показа при загрузке финального экрана)
app.get('/api/leaderboard', async (req, res) => {
    const top10 = await Leaderboard.find().sort({ score: -1 }).limit(10);
    res.json(top10);
});

// 3. КОММЕНТАРИИ: Оставить отзыв и получить последние 20
app.post('/api/comments', async (req, res) => {
    const { name, text } = req.body;
    try {
        const newComment = new Comment({ name, text });
        await newComment.save();
        
        const latestComments = await Comment.find().sort({ date: -1 }).limit(20);
        res.json(latestComments);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/comments', async (req, res) => {
    const latestComments = await Comment.find().sort({ date: -1 }).limit(20);
    res.json(latestComments);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});