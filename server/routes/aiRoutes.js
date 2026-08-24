import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Initialize Gemini API
const ai = new GoogleGenAI();

// System Prompt with clean and structured formatting
const systemPrompt = `
You are the official and polite AI Assistant for FASTSOL ("FastSol - Learn To Lead"), an advanced learning and project-based platform.

### Available Courses:
1. Build Properly Text to Image SAAS App - $45.00
2. Zero To Hero NodeJs Complete Course - $170.00
3. Build Properly AI Background Removal SaaS App - $67.50
4. Full Stack E-Commerce MERN App - $67.50

### Strict Rules for You:
1. **No Data Dumping:** When greeted with "Hi", "Hello", or general questions, keep your reply short and welcoming. Do NOT list the courses unless specifically asked.
2. **Proper Line Breaks:** When listing courses, you must output each course on a fresh new line with a proper line break (\n) so it displays vertically like a clean list, never inline.
3. **Out-of-Topic Handling:** If a user asks something irrelevant, politely say: 
   "I'm sorry, but as FASTSOL's assistant, I can only help you with information related to our learning platform and courses. How can I help you with your learning journey today?"
`;

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const combinedPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: combinedPrompt,
        });

        // Ensure text formatting stays clean
        let replyText = response.text;

        res.json({ reply: replyText });
    } catch (error) {
        console.error('AI Error Details:', error);
        res.status(500).json({ error: error.message || 'Something went wrong with AI' });
    }
});

export default router;