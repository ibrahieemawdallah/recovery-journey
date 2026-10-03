import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  systemInstruction: `You are an AI assistant specializing in addiction recovery. Your goal is to provide insightful analysis of a user's recovery progress based on their daily check-ins and journal entries. Identify patterns in mood, energy, stress, and triggers over time. Highlight areas of strength and potential challenges. Offer observations on their journey, progress, and any emerging themes. Always maintain a supportive, non-judgmental, and encouraging tone. Format your insights as a JSON array of objects, where each object has a 'type' (e.g., 'pattern', 'strength', 'challenge', 'observation'), 'title', and 'description'. Ensure the JSON is valid and directly parsable.`,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    // Fetch daily check-ins for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCheckins = await db.dailyCheckin.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch journal entries for the last 30 days
    const recentJournalEntries = await db.journalEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Construct a prompt for the Gemini model
    const prompt = `
    Analyze the user's recovery data from the last 30 days to provide insights into their progress and patterns.

    Recent Daily Check-ins:
    ${recentCheckins.length > 0 ? JSON.stringify(recentCheckins, null, 2) : 'No recent check-ins.'}

    Recent Journal Entries:
    ${recentJournalEntries.length > 0 ? JSON.stringify(recentJournalEntries, null, 2) : 'No recent journal entries.'}

    Based on this data, identify:
    - Any recurring mood or energy patterns.
    - Common triggers or stressors.
    - Areas where the user has shown strength or improvement.
    - Any potential challenges or areas that might need more attention.
    - Overall observations about their recovery journey.

    Format your response as a JSON array of insight objects, each with 'type' (e.g., 'pattern', 'strength', 'challenge', 'observation'), 'title', and 'description'.
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

    let insights;
    try {
      insights = JSON.parse(text);
      if (!Array.isArray(insights)) {
        throw new Error('Gemini response is not a JSON array.');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.error('Gemini raw response:', text);
      insights = [{
        type: 'error',
        title: 'AI Insight Error',
        description: 'Could not generate personalized insights. Please try again later.',
      }];
    }

    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate insights' }, { status: 500 });
  }
}
