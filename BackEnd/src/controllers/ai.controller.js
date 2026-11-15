const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {

    const code = req.body?.code;

    if (typeof code !== 'string' || !code.trim()) {
        return res.status(400).json({ error: 'Add some code before requesting a review.' });
    }

    try {
        const review = await aiService(code);
        return res.json({ review });
    } catch (error) {
        console.error('Code review failed:', error);
        if (error.code === 'MISSING_API_KEY') return res.status(503).json({ error: error.message });
        if (error.status === 429 || error.status === 503) {
            return res.status(503).json({ error: 'Gemini is temporarily busy. Please try again in a moment.' });
        }
        if (error.status === 504) {
            return res.status(504).json({ error: 'Gemini took too long to respond. Try again with a smaller code sample.' });
        }
        if (error.status === 400 || error.status === 403) {
            return res.status(502).json({ error: 'Gemini rejected this request. Check that the API key is valid and enabled for the Gemini API.' });
        }
        return res.status(502).json({ error: 'The AI review could not be completed. Please try again.' });
    }

}
