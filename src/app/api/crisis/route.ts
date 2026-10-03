import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Crisis intervention data
const CRISIS_RESOURCES = {
  hotlines: [
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      hours: '24/7',
      description: 'Free, confidential, 24/7, 365-day-a-year treatment referral',
      website: 'https://www.samhsa.gov'
    },
    {
      name: 'Suicide Prevention Lifeline',
      phone: '988',
      hours: '24/7',
      description: 'Free, confidential support for people in distress',
      website: 'https://suicidepreventionlifeline.org'
    },
    {
      name: 'Crisis Text Line',
      phone: '741741',
      hours: '24/7',
      description: 'Free, confidential crisis counseling',
      website: 'https://suicidepreventionlifeline.org'
    },
    {
      name: 'Substance Abuse and Mental Health Services',
      phone: '1-800-662-HELP (4357)',
      hours: '24/7',
      description: 'Treatment referral and information',
      website: 'https://www.samhsa.gov'
    },
    {
      name: 'American Society of Addiction Medicine',
      website: 'https://www.asam.org',
      description: 'Find addiction treatment specialists'
    },
    {
      name: 'Psychology Today',
      website: 'https://www.psychologytoday.com',
      description: 'Find therapists specializing in addiction'
    },
    {
      name: 'National Alliance on Mental Illness',
      website: 'https://www.nami.org',
      description: 'Mental health support and resources'
    },
    {
      name: 'FindTreatment.gov',
      website: 'https://findtreatment.gov',
      description: 'Search for addiction treatment facilities'
    }
  ],
  professional_support: [
    {
      name: 'American Society of Addiction Medicine',
      website: 'https://www.asam.org',
      description: 'Find addiction treatment specialists'
    },
    {
      name: 'Psychology Today',
      website: 'https://www.psychologytoday.com',
      description: 'Find therapists specializing in addiction'
    },
    {
      name: 'National Alliance on Mental Illness',
      website: 'https://www.nami.org',
      description: 'Mental health support and resources'
    },
    {
      name: 'FindTreatment.gov',
      website: 'https://findtreatment.gov',
      description: 'Search for addiction treatment facilities'
    }
  ],
  immediate_steps: [
    'Stay where you are - don\'t be alone',
    'Call someone you trust immediately',
    'Remove yourself from the situation',
    'Contact a helpline',
    'Breathe deeply - it can help you think clearly',
    'Remember: this feeling will pass',
    'Use HALT technique: Stop, Observe, Proceed',
    'Wait 15-30 minutes before making any decisions'
  ],
  local_resources: [
    {
      name: 'Emergency Room (ER)',
      phone: '911',
      description: 'Call for emergency help if you\'re in danger'
    },
    {
      name: 'Poison Control',
      phone: '1-800-222-1222',
      description: '24/7 emergency number for poison'
    },
    {
      name: 'Crisis Text Line',
      phone: '988',
      description: 'Crisis support available 24/7'
    }
  ]
}

// Peer support roles
const PEER_ROLES = {
  sponsor: 'Sponsor - Experienced person in recovery guiding someone through the steps',
  mentor: 'Mentor - Professional offering guidance on recovery journey',
  accountability_partner: 'Accountability Partner - Trusted person helping track progress and provide accountability',
  peer_supporter: 'Peer Supporter - Someone further along in recovery offering peer support and shared experiences'
}

// POST /api/crisis/report - Create crisis report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, severity, situation, usedCopingStrategy, outcome } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    // Validate severity
    if (!severity || !['low', 'medium', 'high', 'critical']) {
      return NextResponse.json(
        { success: false, error: 'Severity must be one of: low, medium, high, critical' },
        { status: 400 }
      )
    }

    // Determine if this is a crisis
    const keywords = ['kill', 'die', 'suicide', 'hurt', 'overdose', 'addiction', 'drugs', 'alcohol']
    const messageLower = message.toLowerCase()
    const isCrisis = keywords.some((keyword: string) => messageLower.includes(keyword))

    // Save crisis report to database
    const crisisReport = await db.groupChatMessage.create({
      data: {
        userId,
        userName: 'System', // System-generated
        group: 'crisis',
        message: `CRISIS REPORT - Severity: ${severity}, Situation: ${situation}, Outcome: ${outcome}`
      }
    })

    // In a real app, this would trigger emergency notifications
    // For now, we'll just log it
    console.log('Crisis report logged for user:', userId)

    // Check if user is safe after crisis report
    if (severity === 'critical' && outcome !== 'safe') {
      // In a real app, this would trigger emergency notifications
      // For now, we'll just log it
      console.log('High severity crisis - user may need immediate help')
    }

    return NextResponse.json({
      success: true,
      report: {
        id: crisisReport.id,
        severity,
        situation,
        usedCopingStrategy,
        outcome,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error creating crisis report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create crisis report' },
      { status: 500 }
    )
  }
}

// GET /api/crisis/resources - Get crisis support resources
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      resources: {
        hotlines: CRISIS_RESOURCES.hotlines,
        professional_support: CRISIS_RESOURCES.professional_support,
        immediate_steps: CRISIS_RESOURCES.immediate_steps,
        local_resources: CRISIS_RESOURCES.local_resources
      }
    })
  } catch (error) {
    console.error('Error fetching crisis resources:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch crisis resources' },
      { status: 500 }
    )
  }
}
