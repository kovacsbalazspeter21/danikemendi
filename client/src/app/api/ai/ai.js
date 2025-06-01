/*
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
*/

import OpenAI from 'openai';
/*import dotenv from 'dotenv';*/

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  console.log('🚀 API route meghívva!');
  
  try {
    // API kulcs ellenőrzése
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ Nincs API kulcs!');
      return Response.json(
        { error: 'OpenAI API kulcs nincs beállítva' }, 
        { status: 500 }
      );
    }

    const { messages } = await request.json();
    console.log('📨 Kapott üzenetek:', messages);
    
    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Érvénytelen üzenet formátum' }, 
        { status: 400 }
      );
    }

    console.log('🤖 OpenAI hívás...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-2025-04-14",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    console.log('✅ OpenAI válasz:', result);

    return Response.json({ result });

  } catch (error) {
    console.error('❌ API hiba:', error);
    
    return Response.json(
      { error: 'Hiba: ' + error.message }, 
      { status: 500 }
    );
  }
}

// GET endpoint teszteléshez
export async function GET() {
  return Response.json({ 
    message: 'AI API működik!', 
    timestamp: new Date().toISOString() 
  });
}
