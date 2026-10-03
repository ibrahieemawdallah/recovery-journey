export const RECOVERY_GROUPS = [
  { id: 'early-recovery', name: 'Early Recovery (Days 1-30)', nameAr: 'التعافي المبكر (الأيام 1-30)' },
  { id: 'mid-recovery', name: 'Mid Recovery (Days 31-90)', nameAr: 'التعافي المتوسط (الأيام 31-90)' },
  { id: 'long-term', name: 'Long Term (90+ days)', nameAr: 'التعافي على المدى الطويل (90+ يوم)' },
  { id: 'young-adults', name: 'Young Adults (18-25)', nameAr: 'الشباب (18-25)' },
  { id: 'working-professionals', name: 'Working Professionals', nameAr: 'المهنيون العاملون' },
  { id: 'community-circle', name: 'Community Recovery Circle', nameAr: 'دائرة تعافي المجتمع' },
];

export const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Very Low', labelAr: 'منخفض جداً' },
  { value: 2, emoji: '😟', label: 'Low', labelAr: 'منخفض' },
  { value: 3, emoji: '😐', label: 'Neutral', labelAr: 'محايد' },
  { value: 4, emoji: '🙂', label: 'Good', labelAr: 'جيد' },
  { value: 5, emoji: '😄', label: 'Great', labelAr: 'ممتاز' },
];

export const TRIGGER_OPTIONS = [
  'Stress',
  'Anxiety',
  'Loneliness',
  'Boredom',
  'Anger',
  'Sadness',
  'Social pressure',
  'Celebration',
  'Fatigue',
  'Conflict',
];

export const CATEGORIES = [
  'general',
  'recovery',
  'clinical',
  'journaling',
  'steps',
  'community',
];

export const CLINICAL_PHASES = [
  { id: 'assessment', name: 'Assessment', nameAr: 'التقييم' },
  { id: 'stabilization', name: 'Stabilization', nameAr: 'الاستقرار' },
  { id: 'processing', name: 'Processing', nameAr: 'المعالجة' },
  { id: 'integration', name: 'Integration', nameAr: 'التكامل' },
];

export const SESSION_PROTOCOLS = [
  { id: 'cbt', name: 'Cognitive Behavioral Therapy', nameAr: 'العلاج السلوكي المعرفي' },
  { id: 'dbt', name: 'Dialectical Behavior Therapy', nameAr: 'العلاج السلوكي الجدلي' },
  { id: 'motivational', name: 'Motivational Interviewing', nameAr: 'المقابلة التحفيزية' },
  { id: 'mindfulness', name: 'Mindfulness-Based', nameAr: 'القائم على اليقظة الذهنية' },
];

export const MILESTONES = [
  { days: 1, label: 'First Day', labelAr: 'اليوم الأول' },
  { days: 7, label: 'One Week', labelAr: 'أسبوع واحد' },
  { days: 30, label: 'One Month', labelAr: 'شهر واحد' },
  { days: 60, label: 'Two Months', labelAr: 'شهرين' },
  { days: 90, label: 'Three Months', labelAr: 'ثلاثة أشهر' },
  { days: 180, label: 'Six Months', labelAr: 'ستة أشهر' },
  { days: 365, label: 'One Year', labelAr: 'سنة واحدة' },
];

export const QUOTES = [
  "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would.",
  "One day at a time. One step at a time. One moment at a time.",
  "Your present circumstances don't determine where you can go. They merely determine where you start.",
  "The only impossible journey is the one you never begin.",
  "Progress, not perfection.",
  "You are stronger than you think.",
  "Every day is a new beginning. Take a deep breath and start again.",
  "Recovery is about progress, not perfection.",
  "You don't have to see the whole staircase. Just take the first step.",
  "The best way to predict the future is to create it.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
  "You are never too old to set another goal or to dream a new dream.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
];

export const PERSONAS = [
  { id: 'supportive', name: 'Supportive Coach', nameAr: 'المدرب الداعم' },
  { id: 'challenging', name: 'Challenging Coach', nameAr: 'المدرب المتحدي' },
  { id: 'analytical', name: 'Analytical Coach', nameAr: 'المدرب التحليلي' },
  { id: 'empathetic', name: 'Empathetic Coach', nameAr: 'المدرب المتعاطف' },
];

export const EMOTIONS = [
  'happy', 'sad', 'angry', 'anxious', 'calm', 'excited',
  'frustrated', 'grateful', 'hopeful', 'lonely', 'proud', 'scared',
];

export const HALT_TRIGGERS = [
  { id: 'hungry', name: 'Hungry', nameAr: 'جائع' },
  { id: 'angry', name: 'Angry', nameAr: 'غاضب' },
  { id: 'lonely', name: 'Lonely', nameAr: 'وحيد' },
  { id: 'tired', name: 'Tired', nameAr: 'متعب' },
];

export const COPING_SKILLS = [
  { id: 'deep-breathing', name: 'Deep Breathing', nameAr: 'التنفس العميق', category: 'physical' },
  { id: 'grounding', name: 'Grounding Techniques', nameAr: 'تقنيات التأسيس', category: 'cognitive' },
  { id: 'journaling', name: 'Journaling', nameAr: 'الكتابة', category: 'behavioral' },
  { id: 'exercise', name: 'Exercise', nameAr: 'الرياضة', category: 'physical' },
  { id: 'meditation', name: 'Meditation', nameAr: 'التأمل', category: 'cognitive' },
  { id: 'social-support', name: 'Social Support', nameAr: 'الدعم الاجتماعي', category: 'social' },
  { id: 'distraction', name: 'Distraction', nameAr: 'التشتت', category: 'behavioral' },
  { id: 'self-soothing', name: 'Self-Soothing', nameAr: 'التهدئة الذاتية', category: 'physical' },
];

export const WARNING_SIGNS = [
  'Increased isolation',
  'Skipping meetings',
  'Romanticizing past use',
  'Neglecting self-care',
  'Increased stress',
  'Relationship conflicts',
  'Financial problems',
  'Sleep disturbances',
];

export const HIGH_RISK_SITUATIONS = [
  'Parties or social events with substances',
  'Relationship conflicts',
  'Work stress',
  'Anniversaries of traumatic events',
  'Financial stress',
  'Boredom or loneliness',
  'Celebrations',
];

export const API_ENDPOINTS = {
  chat: '/api/chat',
  checkin: '/api/checkin',
  steps: '/api/steps',
  journal: '/api/journal',
  goals: '/api/goals',
  gratitude: '/api/gratitude',
  achievements: '/api/achievements',
  users: '/api/users',
  resources: '/api/resources',
  crisis: '/api/crisis',
  clinical: '/api/clinical',
  risk: '/api/risk',
  thoughtRecords: '/api/thought-records',
  relapsePlan: '/api/relapse-plan',
  copingSkills: '/api/coping-skills',
  functionalAnalysis: '/api/functional-analysis',
  notifications: '/api/notifications',
  matching: '/api/matching',
  helpRequests: '/api/help-requests',
  sessions: '/api/sessions',
};

export const STORAGE_KEYS = {
  userId: 'userId',
  language: 'language',
  theme: 'theme',
  onboardingComplete: 'onboardingComplete',
};

export const FEATURE_FLAGS = {
  enableAI: true,
  enableCommunity: true,
  enableClinical: true,
  enablePWA: true,
  enableNotifications: true,
};
