require('dotenv').config();

const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // إضافة helmet لتعزيز الأمان
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const userRoutes = require('./routes/userRoutes');
const announcedChallengeRoutes = require('./routes/announcedChallengeRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const dailyProgressRoutes = require('./routes/dailyProgressRoutes');
const badgePunishmentRoutes = require('./routes/badgePunishmentRoutes');
const aiNotificationRoutes = require('./routes/aiNotificationRoutes');


const app = express(); 
const PORT = process.env.PORT || 8000;

// 🛠️ Connect to database
connectDB();

// 🛡️ Middlewares
app.use(helmet()); // تفعيل helmet لجميع المسارات
app.use(express.json()); 
app.use(cookieParser());
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*";
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // السماح بإرسال الكوكيز
}));

if (process.env.NODE_ENV === 'development') { 
    app.use(morgan('dev'));
}


// 🌍 المسار الأساسي
app.get("/", (req, res) => res.send("Server is running successfully! 🚀"));

require("./tasks/cronJobs"); // تشغيل وظيفة التوثيق الأسبوعي تلقائيًا

// 📌 Routes
app.use('/api/user', userRoutes);
app.use('/api/announced-challenge', announcedChallengeRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/daily-progress', dailyProgressRoutes);
app.use('/api/badge-punishment', badgePunishmentRoutes);
app.use('/api/ai-notification', aiNotificationRoutes);


// 🛑 Error Handlers
app.use(notFound); 
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
