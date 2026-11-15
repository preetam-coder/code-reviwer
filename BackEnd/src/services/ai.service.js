const { GoogleGenAI } = require('@google/genai');

const systemInstruction = `You are a senior software engineer reviewing code. Be precise and constructive. Identify correctness bugs, security risks, performance concerns, and maintainability issues. Prioritize findings by severity, explain why each matters, and give actionable fixes or a concise improved example. If the code looks sound, say so and mention any remaining considerations. Format your response in clear Markdown.`;

async function generateContent(code) {
    const apiKey = process.env.GOOGLE_GEMINI_KEY;
    if (!apiKey) {
        const error = new Error('Set GOOGLE_GEMINI_KEY in BackEnd/.env to enable AI reviews.');
        error.code = 'MISSING_API_KEY';
        throw error;
    }

    const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
            timeout: 60000,
            retryOptions: { attempts: 1 },
        },
    });
    const result = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
        contents: `Review this code:\n\n\`\`\`\n${code}\n\`\`\``,
        config: {
            systemInstruction,
            maxOutputTokens: 2000,
            thinkingConfig: { thinkingLevel: 'low' },
        },
    });
    return result.text;
}

module.exports = generateContent;
