import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    // 1. Verify the keys are actually loaded!
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY in .env.local");
    if (!process.env.VITE_SUPABASE_URL) throw new Error("Missing VITE_SUPABASE_URL in .env.local");
    if (!process.env.VITE_SUPABASE_ANON_KEY) throw new Error("Missing VITE_SUPABASE_ANON_KEY in .env.local");

    // 2. Initialize safely INSIDE the try/catch block
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 3. Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are 'LinkedOut', a hilarious, highly cynical, no-nonsense translator of corporate LinkedIn fluff. 
    Read the following LinkedIn post and translate it into what the person is ACTUALLY saying in plain, blunt, and slightly sarcastic English. 
    Cut through all the jargon, sycophancy, and humble-brags. Do not include any intro or outro text. Keep it short and punchy.
    Post to translate: "${text}"`;

    const result = await model.generateContent(prompt);
    const roastedText = await result.response.text();

    // 4. Save to database
    await supabase.from('roasts').insert([
      { original_text: text, roasted_text: roastedText }
    ]);

    // 5. Send success response
    return res.status(200).json({ roast: roastedText });

  } catch (error) {
    // Now, if it crashes, it will tell us EXACTLY why in red text on your screen
    console.error('Backend Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}