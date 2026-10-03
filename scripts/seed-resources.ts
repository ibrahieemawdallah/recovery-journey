import { db } from '../src/lib/db'

const resources = [
  {
    title: 'Understanding Triggers and Cravings',
    description: 'Learn how to identify and manage common triggers that lead to cravings.',
    content: 'Triggers are situations, emotions, or people that make you want to use substances. Common triggers include stress, anxiety, boredom, and social pressure. This guide helps you recognize your triggers and develop healthy coping strategies.',
    category: 'articles',
    tags: JSON.stringify(['triggers', 'cravings', 'prevention']),
    url: 'https://www.samhsa.gov/find-help/recovery'
  },
  {
    title: 'Building a Support Network',
    description: 'Practical steps for creating and maintaining a strong support system.',
    content: 'A strong support network is crucial for recovery. This includes family, friends, support groups, sponsors, and healthcare professionals. Learn how to reach out, set boundaries, and nurture these important relationships.',
    category: 'guides',
    tags: JSON.stringify(['support', 'relationships', 'community']),
    url: null
  },
  {
    title: 'Mindfulness Meditation for Recovery',
    description: 'Guided mindfulness exercises to reduce stress and increase self-awareness.',
    content: 'Mindfulness helps you stay present and aware of your thoughts and feelings without judgment. These exercises can reduce stress, manage cravings, and improve overall wellbeing.',
    category: 'exercises',
    tags: JSON.stringify(['mindfulness', 'meditation', 'stress']),
    url: null
  },
  {
    title: 'Healthy Coping Strategies',
    description: 'Alternative ways to deal with difficult emotions and situations.',
    content: 'Instead of turning to substances, try these healthy coping mechanisms: exercise, deep breathing, talking to a friend, journaling, creative activities, spending time in nature, and practicing self-care.',
    category: 'articles',
    tags: JSON.stringify(['coping', 'strategies', 'wellness']),
    url: null
  },
  {
    title: 'Nutrition and Recovery',
    description: 'How proper nutrition supports your physical and mental recovery.',
    content: 'Recovery affects your body\'s nutritional needs. Eating balanced meals, staying hydrated, and avoiding excessive caffeine and sugar can help restore your health and support your recovery journey.',
    category: 'articles',
    tags: JSON.stringify(['nutrition', 'health', 'wellness']),
    url: 'https://www.niaaa.nih.gov/'
  },
  {
    title: 'Sleep Hygiene in Recovery',
    description: 'Tips for improving sleep quality during recovery.',
    content: 'Sleep disturbances are common in recovery. This guide covers creating a bedtime routine, managing your sleep environment, and addressing insomnia naturally.',
    category: 'guides',
    tags: JSON.stringify(['sleep', 'health', 'wellness']),
    url: null
  },
  {
    title: 'Finding Your Purpose',
    description: 'Discovering meaning and direction in life beyond addiction.',
    content: 'Recovery is an opportunity to rediscover who you are and what matters to you. Explore your values, interests, and goals to build a fulfilling life that supports your sobriety.',
    category: 'articles',
    tags: JSON.stringify(['purpose', 'goals', 'growth']),
    url: null
  },
  {
    title: 'Dealing with Relapse',
    description: 'What to do if you experience a setback and how to prevent future ones.',
    content: 'Relapse is often part of the recovery process. Learn how to handle it without shame, get back on track, and strengthen your relapse prevention plan for the future.',
    category: 'guides',
    tags: JSON.stringify(['relapse', 'prevention', 'recovery']),
    url: 'https://www.samhsa.gov/'
  }
]

async function seedResources() {
  try {
    console.log('Seeding resources...')

    for (const resource of resources) {
      await db.resource.create({
        data: resource
      })
      console.log(`Created: ${resource.title}`)
    }

    console.log('Resources seeded successfully!')
  } catch (error) {
    console.error('Error seeding resources:', error)
  } finally {
    await db.$disconnect()
  }
}

seedResources()
