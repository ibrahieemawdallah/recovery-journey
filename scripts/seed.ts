import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create breathing exercises
  const breathingExercises = [
    {
      name: '4-7-8 Breathing',
      nameAr: 'تنفس 4-7-8',
      pattern: '4-7-8',
      duration: 180,
      description: 'A calming breath technique: inhale for 4, hold for 7, exhale for 8.',
      category: 'calming',
      steps: JSON.stringify([
        'Sit comfortably with your back straight',
        'Place the tip of your tongue behind your upper front teeth',
        'Exhale completely through your mouth',
        'Close your mouth and inhale through your nose for 4 seconds',
        'Hold your breath for 7 seconds',
        'Exhale completely through your mouth for 8 seconds',
        'Repeat 3-4 times',
      ]),
    },
    {
      name: 'Box Breathing',
      nameAr: 'تنفس الصندوق',
      pattern: 'box',
      duration: 240,
      description: 'Equal parts inhale, hold, exhale, hold — each for 4 seconds.',
      category: 'calming',
      steps: JSON.stringify([
        'Sit comfortably',
        'Exhale completely',
        'Inhale through your nose for 4 seconds',
        'Hold your breath for 4 seconds',
        'Exhale for 4 seconds',
        'Hold empty for 4 seconds',
        'Repeat 4-5 times',
      ]),
    },
    {
      name: 'Coherent Breathing',
      nameAr: 'التنفس المتماسك',
      pattern: 'coherent',
      duration: 300,
      description: 'Breathe at 5 breaths per minute for maximum calm and focus.',
      category: 'calming',
      steps: JSON.stringify([
        'Sit or lie down comfortably',
        'Breathe in slowly for 5 seconds',
        'Breathe out slowly for 5 seconds',
        'Continue for 5-10 minutes',
        'Focus on the rhythm of your breath',
      ]),
    },
    {
      name: 'Energizing Breath',
      nameAr: 'التنفس المنشط',
      pattern: 'energizing',
      duration: 120,
      description: 'Quick, rhythmic breathing to boost energy and alertness.',
      category: 'energizing',
      steps: JSON.stringify([
        'Sit up straight',
        'Take quick, sharp breaths through your nose',
        'Inhale and exhale at equal pace',
        'Continue for 30 seconds',
        'Rest and breathe normally',
        'Repeat 2-3 times if needed',
      ]),
    },
    {
      name: 'Grounding Breath',
      nameAr: 'التنفس التأسيسي',
      pattern: 'grounding',
      duration: 180,
      description: 'Deep breathing combined with grounding affirmations.',
      category: 'grounding',
      steps: JSON.stringify([
        'Sit with your feet flat on the floor',
        'Take a deep breath in for 4 seconds',
        'Hold for 4 seconds',
        'Exhale slowly for 6 seconds',
        'With each exhale, say "I am safe" or "I am here"',
        'Repeat 5 times',
      ]),
    },
  ];

  for (const exercise of breathingExercises) {
    await prisma.breathingExercise.upsert({
      where: { id: exercise.name.toLowerCase().replace(/\s+/g, '-') },
      update: exercise,
      create: { id: exercise.name.toLowerCase().replace(/\s+/g, '-'), ...exercise },
    });
  }

  console.log(`Created ${breathingExercises.length} breathing exercises`);

  // Create sample resources
  const resources = [
    {
      authorId: 'system',
      title: 'Understanding Addiction',
      description: 'A comprehensive guide to understanding addiction as a disease.',
      content: 'Addiction is a complex condition, a brain disease that is manifested by compulsive substance use despite harmful consequence. People with addiction (severe substance use disorder) have an intense focus on using a certain substance(s), such as alcohol or drugs, to the point that it takes over their life.',
      category: 'education',
      tags: JSON.stringify(['addiction', 'education', 'basics']),
      published: true,
    },
    {
      authorId: 'system',
      title: 'The 12 Steps Explained',
      description: 'A detailed explanation of each of the 12 steps of recovery.',
      content: 'The 12 steps are a set of guiding principles for recovery from addiction, compulsion, or other behavioral problems. Originally proposed by Alcoholics Anonymous (AA) as a method of recovery from alcoholism, the steps have been adapted for various other programs.',
      category: '12-steps',
      tags: JSON.stringify(['12-steps', 'recovery', 'program']),
      published: true,
    },
    {
      authorId: 'system',
      title: 'Coping with Cravings',
      description: 'Practical strategies for managing and overcoming cravings.',
      content: 'Cravings are a normal part of recovery. They are intense desires for a substance that can feel overwhelming. However, cravings are temporary and will pass. Here are some strategies: delay, distract, drink water, talk to someone, take a walk, practice deep breathing.',
      category: 'coping',
      tags: JSON.stringify(['cravings', 'coping', 'strategies']),
      published: true,
    },
    {
      authorId: 'system',
      title: 'Building a Support Network',
      description: 'How to build and maintain a strong support network in recovery.',
      content: 'A strong support network is crucial for long-term recovery. This includes family, friends, sponsors, therapists, and support groups. Do not be afraid to reach out and ask for help when you need it.',
      category: 'community',
      tags: JSON.stringify(['support', 'network', 'community']),
      published: true,
    },
    {
      authorId: 'system',
      title: 'Relapse Prevention',
      description: 'Understanding and preventing relapse in recovery.',
      content: 'Relapse is a return to substance use after a period of abstinence. It is a common part of the recovery process, not a sign of failure. Key strategies include identifying triggers, developing coping skills, maintaining a support network, and seeking professional help when needed.',
      category: 'relapse',
      tags: JSON.stringify(['relapse', 'prevention', 'recovery']),
      published: true,
    },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.title.toLowerCase().replace(/\s+/g, '-') },
      update: resource,
      create: { id: resource.title.toLowerCase().replace(/\s+/g, '-'), ...resource },
    });
  }

  console.log(`Created ${resources.length} resources`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
