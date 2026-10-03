import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  systemInstruction: `You are an AI assistant specializing in addiction recovery. Your goal is to provide personalized, empathetic, and actionable recommendations based on a user's recent recovery data. Analyze their check-ins and journal entries to identify patterns, potential triggers, and areas for growth. Offer suggestions for coping strategies, goal setting, and relevant resources. Always maintain a supportive, non-judgmental, and encouraging tone. Format your recommendations as a JSON array of objects, where each object has a 'type' (e.g., 'resource', 'goal', 'insight'), 'title', and 'description'. For 'resource' types, include a 'category' (e.g., 'articles', 'videos', 'support_groups'). For 'goal' types, include a 'priority' (e.g., 'high', 'medium', 'low'). For 'insight' types, the description should be a concise observation.`,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    // Fetch recent daily check-ins for the user
    const recentCheckins = await db.dailyCheckin.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5, // Get the 5 most recent check-ins
    });

    // Fetch recent journal entries for the user
    const recentJournalEntries = await db.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5, // Get the 5 most recent journal entries
    });

    // Construct a prompt for the Gemini model
    const prompt = `
    The user's recent recovery data is as follows:

    Recent Daily Check-ins:
    ${recentCheckins.length > 0 ? JSON.stringify(recentCheckins, null, 2) : 'No recent check-ins.'}

    Recent Journal Entries:
    ${recentJournalEntries.length > 0 ? JSON.stringify(recentJournalEntries, null, 2) : 'No recent journal entries.'}

    Based on this data, please provide personalized recommendations for the user's recovery journey.
    Focus on identifying patterns, potential triggers, and areas for growth.
    Offer suggestions for coping strategies, goal setting, and relevant resources.
    Format your response as a JSON array of recommendation objects, each with 'type', 'title', 'description', and optionally 'category' for resources or 'priority' for goals.
    Ensure the JSON is valid and directly parsable.
    `;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    let recommendations;
    try {
      // Attempt to parse the JSON response from Gemini
      recommendations = JSON.parse(text);
      // Basic validation to ensure it's an array
      if (!Array.isArray(recommendations)) {
        throw new Error('Gemini response is not a JSON array.');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.error('Gemini raw response:', text);
      // Fallback to a default recommendation or error message if parsing fails
      recommendations = [{
        type: 'insight',
        title: 'AI Recommendation Error',
        description: 'Could not generate personalized recommendations. Please try again later.',
      }];
    }

    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
