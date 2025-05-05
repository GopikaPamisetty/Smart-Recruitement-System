import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./utils/db.js";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import Routes
import userRoute from "./routes/userRoute.js";
import companyRoute from "./routes/companyRoute.js";
import jobRoute from "./routes/jobRoute.js";
import applicationRoute from "./routes/applicationRoute.js";


// Load env
dotenv.config();

// App init
const app = express();
const PORT = process.env.PORT || 8000;

// DB connect
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);




// Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/mock-interview', async (req, res) => {
    try {
        const { role, experience } = req.body;
        if (!role || isNaN(experience)) {
            return res.status(400).json({ error: "Role (string) and experience (number) required" });
        }

        //const prompt = `Generate 1 technical and 1 HR interview question for a ${role} with ${experience} years of experience.`;
        const prompt = `Generate exactly 1 technical interview question and exactly 1 HR interview question for a ${role} with ${experience} years of experience. Respond only with the two questions in plain text. Do not include any labels like "Technical Question" or "HR Question". Just list them one after the other.`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const questions = response.text().split('\n').map(q => q.trim()).filter(Boolean);

        res.status(200).json({ questions });
    } catch (error) {
        console.error("Interview Error:", error);
        res.status(500).json({ error: "Failed to generate questions" });
    }
});

app.post('/api/get-feedback', async (req, res) => {
    try {
        const { responses, role, experience } = req.body;

        if (!responses || !role || !experience) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const feedback = await Promise.all(Object.entries(responses).map(async ([_, { question, answer }]) => {
            const prompt = `
                Analyze for ${role} with ${experience} years:
                Q: ${question}
                A: ${answer}

                Respond ONLY in this JSON format:
                {
                    "question": "original",
                    "userAnswer": "user's answer",
                    "rating": number,
                    "expectedAnswer": "model answer",
                    "feedback": "short feedback",
                    "suggestions": "how to improve"
                }`;

            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json|```/g, '').trim();
            return JSON.parse(text);
        }));

        res.status(200).json(feedback);
    } catch (error) {
        console.error("Feedback Error:", error);
        res.status(500).json({ error: error.message || "Feedback generation failed" });
    }
});

// Health Check
app.get("/", (req, res) => res.send("🚀 Backend is live"));

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
