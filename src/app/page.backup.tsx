'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heart, Users, Calendar, BookOpen, CheckCircle2, Moon, Lightbulb, Download, ChevronRight, Send, Plus, Trash2, Phone, AlertTriangle, Target, Flame, Trophy, Star, Book, Search, TrendingUp, Quote, Handshake, User, Bell, Library, Clock, MapPin } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { io, Socket } from 'socket.io-client'

// Recovery Groups
const RECOVERY_GROUPS = [
  { id: 'early-recovery', name: 'Early Recovery (Days 1-30)', description: 'For those in first month of recovery' },
  { id: 'mid-recovery', name: 'Mid Recovery (Days 31-90)', description: 'For those in second and third month' },
  { id: 'long-term', name: 'Long Term (90+ days)', description: 'For those with 3+ months of sobriety' },
  { id: 'young-adults', name: 'Young Adults (18-25)', description: 'Age-specific support for young adults' },
  { id: 'working-professionals', name: 'Working Professionals', description: 'Balance work and recovery' },
  { id: 'community-circle', name: 'Community Recovery Circle', description: 'Peer support and shared experiences' }
]

// Mood options
const MOOD_OPTIONS = [
  { value: 'great', emoji: '😊', label: 'Great', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'good', emoji: '🙂', label: 'Good', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'okay', emoji: '😐', label: 'Okay', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'sad', emoji: '😔', label: 'Sad', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'stressed', emoji: '😓', label: 'Stressed', color: 'bg-purple-100 text-purple-700 border-purple-300' }
]

const STRESS_OPTIONS = ['Low', 'Medium', 'High']

const CATEGORIES = ['reflection', 'gratitude', 'challenge', 'achievement', 'recovery', 'personal', 'work', 'relationships']

const TRIGGER_OPTIONS = [
  'Stress', 'Loneliness', 'Boredom', 'Tiredness', 'Social Pressure',
  'Environmental Cues', 'Emotional Distress', 'Celebration', 'Negative Thoughts',
  'Physical Discomfort', 'Availability', 'Financial Stress', 'Relationship Issues'
]

const translations = {
  en: {
    // Navigation & Tabs
    steps12: '12 Steps',
    dashboard: 'Dashboard',
    dailyTools: 'Daily Tools',
    journal: 'Journal',
    groupChat: 'Group Chat',
    helpRequests: 'Help Requests',
    profile: 'Profile',
    resources: 'Resources',
    // Welcome & Onboarding
    heroTitle: 'Your Recovery Journey',
    heroSubtitle: 'Start your path to sobriety with community support',
    welcomeTitle: 'Welcome to Your Recovery Journey',
    welcomeDesc: 'Your path to sobriety with community support',
    name: 'Name',
    recoveryDate: 'Recovery Date',
    selectGroup: 'Select Recovery Group',
    startJourney: 'Start Your Recovery Journey',
    // Recovery Groups
    earlyRecovery: 'Early Recovery (Days 1-30)',
    earlyRecoveryDesc: 'For those in first month of recovery',
    midRecovery: 'Mid Recovery (Days 31-90)',
    midRecoveryDesc: 'For those in second and third month',
    longTerm: 'Long Term (90+ days)',
    longTermDesc: 'For those with 3+ months of sobriety',
    youngAdults: 'Young Adults (18-25)',
    youngAdultsDesc: 'Age-specific support for young adults',
    workingProfessionals: 'Working Professionals',
    workingProfessionalsDesc: 'Balance work and recovery',
    communityCircle: 'Community Recovery Circle',
    communityCircleDesc: 'Peer support and shared experiences',
    // Mood options
    great: 'Great',
    good: 'Good',
    okay: 'Okay',
    anxious: 'Anxious',
    sad: 'Sad',
    stressed: 'Stressed',
    // Stress levels
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    // Categories
    reflection: 'Reflection',
    gratitude: 'Gratitude',
    challenge: 'Challenge',
    achievement: 'Achievement',
    recovery: 'Recovery',
    personal: 'Personal',
    work: 'Work',
    relationships: 'Relationships',
    // Triggers
    stress: 'Stress',
    loneliness: 'Loneliness',
    boredom: 'Boredom',
    tiredness: 'Tiredness',
    socialPressure: 'Social Pressure',
    environmentalCues: 'Environmental Cues',
    emotionalDistress: 'Emotional Distress',
    celebration: 'Celebration',
    negativeThoughts: 'Negative Thoughts',
    physicalDiscomfort: 'Physical Discomfort',
    availability: 'Availability',
    financialStress: 'Financial Stress',
    relationshipIssues: 'Relationship Issues',
    // Common UI
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    active: 'Active',
    completed: 'Completed',
    pending: 'Pending',
    inProgress: 'In Progress',
    title: 'Title',
    description: 'Description',
    notes: 'Notes',
    date: 'Date',
    time: 'Time',
    priority: 'Priority',
    status: 'Status',
    actions: 'Actions',
    // Buttons & Actions
    startJourneyBtn: 'Start Your Journey',
    viewDetails: 'View Details',
    markComplete: 'Mark as Complete',
    newEntry: 'New Entry',
    send: 'Send',
    connect: 'Connect',
    disconnect: 'Disconnect',
    connected: 'Connected',
    disconnected: 'Disconnected',
    // Stats & Progress
    sobrietyTime: 'Sobriety Time',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    totalDays: 'Total Days',
    completedSteps: 'Completed Steps',
    moodEnergyTrends: 'Mood & Energy Trends',
    recentActivity: 'Recent Activity',
    // Features
    dailyCheckIn: 'Daily Check-in',
    gratitudeJournal: 'Gratitude Journal',
    workTasks: 'Work Tasks',
    dailyGoals: 'Daily Goals',
    personalJournal: 'Personal Journal',
    achievements: 'Achievements',
    crisisSupport: 'Crisis Support',
    getHelpNow: 'Get Help Now',
    // Step-related
    step: 'Step',
    of: 'of',
    meaning: 'Meaning',
    whyImportant: 'Why It\'s Important',
    perspective: 'Perspective',
    commonChallenges: 'Common Challenges',
    overcomingChallenges: 'Overcoming Challenges',
    signsOfProgress: 'Signs of Progress',
    tasks: 'Tasks',
    roleplayScenarios: 'Roleplay Scenarios',
    scenario: 'Scenario',
    tips: 'Tips',
    whatToSay: 'What to Say',
    guidance: 'Guidance',
    practiceWithAICoach: 'Practice with AI Coach',
    // Help Requests
    createHelpRequest: 'Create Help Request',
    helpRequestTitle: 'Help Request Title',
    helpRequestDesc: 'Description',
    category: 'Category',
    urgency: 'Urgency',
    location: 'Location',
    findHelpers: 'Find Helpers',
    availableHelpers: 'Available Helpers',
    matchScore: 'Match Score',
    acceptRequest: 'Accept Request',
    completeRequest: 'Complete Request',
    // Profile
    editProfile: 'Edit Profile',
    bio: 'Bio',
    skills: 'Skills',
    preferences: 'Preferences',
    availableToHelp: 'Available to Help Others',
    averageRating: 'Average Rating',
    totalRatings: 'Total Ratings',
    // Resources
    resourceLibrary: 'Resource Library',
    helpfulMaterials: 'Helpful articles, guides, and recovery materials',
    searchResources: 'Search resources...',
    articles: 'Articles',
    guides: 'Guides',
    exercises: 'Exercises',
    videos: 'Videos',
    views: 'Views',
    helpful: 'Helpful',
    // Language Toggle
    language: 'Language',
    toggleLanguage: 'Change Language',
    switchToArabic: 'العربية',
    switchToEnglish: 'English'
  },
  ar: {
    // Navigation & Tabs
    steps12: 'الخطوات الاثنتا عشرة',
    dashboard: 'لوحة التحكم',
    dailyTools: 'الأدوات اليومية',
    journal: 'المفكرة اليومية',
    groupChat: 'المحادثة الجماعية',
    helpRequests: 'طلبات المساعدة',
    profile: 'الملف الشخصي',
    resources: 'المصادر',
    // Welcome & Onboarding
    heroTitle: 'رحلة التعافي الخاصة بك',
    heroSubtitle: 'ابدأ طريقك نحو الإقلاع عن الإدمان مع دعم المجتمع',
    welcomeTitle: 'مرحباً بك في رحلة التعافي الخاصة بك',
    welcomeDesc: 'طريقك نحو الإقلاع عن الإدمان مع دعم المجتمع',
    name: 'الاسم',
    recoveryDate: 'تاريخ التعافي',
    selectGroup: 'اختر مجموعة التعافي',
    startJourney: 'ابدأ رحلة التعافي',
    // Recovery Groups
    earlyRecovery: 'التعافي المبكر (الأيام 1-30)',
    earlyRecoveryDesc: 'لأولئك في الشهر الأول من التعافي',
    midRecovery: 'التعافي المتوسط (الأيام 31-90)',
    midRecoveryDesc: 'لأولئك في الشهر الثاني والثالث',
    longTerm: 'التعافي على المدى الطويل (90+ يوم)',
    longTermDesc: 'لأولئك لديهم 3+ أشهر من الإقلاع',
    youngAdults: 'الشباب (18-25)',
    youngAdultsDesc: 'دعم محدد للعمر للشباب',
    workingProfessionals: 'المهنيون العاملون',
    workingProfessionalsDesc: 'موازنة العمل والتعافي',
    communityCircle: 'دائرة تعافي المجتمع',
    communityCircleDesc: 'الدعم النظري والمشاركة في الخبرات',
    // Mood options
    great: 'رائع',
    good: 'جيد',
    okay: 'مقبول',
    anxious: 'قلق',
    sad: 'حزين',
    stressed: 'متوتر',
    // Stress levels
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    // Categories
    reflection: 'تأمل',
    gratitude: 'امتنان',
    challenge: 'تحدي',
    achievement: 'إنجاز',
    recovery: 'تعافي',
    personal: 'شخصي',
    work: 'عمل',
    relationships: 'علاقات',
    // Triggers
    stress: 'الضغط',
    loneliness: 'الوحدة',
    boredom: 'الملل',
    tiredness: 'التعب',
    socialPressure: 'الضغط الاجتماعي',
    environmentalCues: 'إشارات البيئة',
    emotionalDistress: 'الضيق العاطفي',
    celebration: 'الاحتفال',
    negativeThoughts: 'الأفكار السلبية',
    physicalDiscomfort: 'الإزعاج الجسدي',
    availability: 'التوفر',
    financialStress: 'الضغط المالي',
    relationshipIssues: 'مشكلات العلاقات',
    // Common UI
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    close: 'إغلاق',
    submit: 'إرسال',
    search: 'بحث',
    filter: 'تصفية',
    all: 'الكل',
    active: 'نشط',
    completed: 'مكتمل',
    pending: 'قيد الانتظار',
    inProgress: 'قيد التنفيذ',
    title: 'العنوان',
    description: 'الوصف',
    notes: 'ملاحظات',
    date: 'التاريخ',
    time: 'الوقت',
    priority: 'الأولوية',
    status: 'الحالة',
    actions: 'إجراءات',
    // Buttons & Actions
    startJourneyBtn: 'ابدأ رحلتك',
    viewDetails: 'عرض التفاصيل',
    markComplete: 'تحديد كمكتمل',
    newEntry: 'إدخال جديد',
    send: 'إرسال',
    connect: 'اتصال',
    disconnect: 'قطع الاتصال',
    connected: 'متصل',
    disconnected: 'غير متصل',
    // Stats & Progress
    sobrietyTime: 'وقت الإقلاع',
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    currentStreak: 'السلسلة الحالية',
    longestStreak: 'أطول سلسلة',
    totalDays: 'إجمالي الأيام',
    completedSteps: 'الخطوات المكتملة',
    moodEnergyTrends: 'اتجاهات المزاج والطاقة',
    recentActivity: 'النشاط الأخير',
    // Features
    dailyCheckIn: 'التسجيل اليومي',
    gratitudeJournal: 'مفكرة الامتنان',
    workTasks: 'مهام العمل',
    dailyGoals: 'الأهداف اليومية',
    personalJournal: 'المفكرة الشخصية',
    achievements: 'الإنجازات',
    crisisSupport: 'دعم الأزمات',
    getHelpNow: 'احصل على المساعدة الآن',
    // Step-related
    step: 'خطوة',
    of: 'من',
    meaning: 'المعنى',
    whyImportant: 'لماذا هذا مهم',
    perspective: 'المنظور',
    commonChallenges: 'التحديات الشائعة',
    overcomingChallenges: 'التغلب على التحديات',
    signsOfProgress: 'علامات التقدم',
    tasks: 'المهام',
    roleplayScenarios: 'سيناريوهات التمثيل',
    scenario: 'السيناريو',
    tips: 'نصائح',
    whatToSay: 'ماذا تقول',
    guidance: 'التوجيه',
    practiceWithAICoach: 'التدرب مع المدرب الذكي',
    // Help Requests
    createHelpRequest: 'إنشاء طلب مساعدة',
    helpRequestTitle: 'عنوان طلب المساعدة',
    helpRequestDesc: 'الوصف',
    category: 'التصنيف',
    urgency: 'الاستعجال',
    location: 'الموقع',
    findHelpers: 'البحث عن مساعدين',
    availableHelpers: 'المساعدين المتوفرين',
    matchScore: 'نقاط المطابقة',
    acceptRequest: 'قبول الطلب',
    completeRequest: 'إكمال الطلب',
    // Profile
    editProfile: 'تعديل الملف الشخصي',
    bio: 'السيرة الذاتية',
    skills: 'المهارات',
    preferences: 'التفضيلات',
    availableToHelp: 'متوفر للمساعدة',
    averageRating: 'متوسط التقييم',
    totalRatings: 'إجمالي التقييمات',
    // Resources
    resourceLibrary: 'مكتبة المصادر',
    helpfulMaterials: 'مقالات وأدلة ومواد تعافي مفيدة',
    searchResources: 'البحث في المصادر...',
    articles: 'مقالات',
    guides: 'أدلة',
    exercises: 'تمارين',
    videos: 'فيديوهات',
    views: 'المشاهدات',
    helpful: 'مفيد',
    // Language Toggle
    language: 'اللغة',
    toggleLanguage: 'تغيير اللغة',
    switchToArabic: 'العربية',
    switchToEnglish: 'English'
  }
}

// 12 Steps - Comprehensive with detailed guidance
const TWELVE_STEPS = [
  {
    number: 1,
    title: 'We admitted we were powerless over addiction—that our lives had become unmanageable',
    description: 'The first and most important step in recovery is admitting that we cannot control our addiction. This is not about weakness - it\'s about honesty.',
    meaning: 'This step requires deep, radical honesty with ourselves. We must face the truth that our addiction is stronger than our willpower alone.',
    whyImportant: 'Until we admit powerlessness, we keep fighting a battle we cannot win. This admission creates space for real help and transformation.',
    perspective: 'Admitting powerlessness is actually an act of strength, not weakness. When we finally recognize our limitations, we open ourselves to help from others, our support system, and the recovery community that have walked this path before us.',
    commonChallenges: [
      'Feeling like admitting powerlessness means you\'re weak or a failure',
      'Fear of what others will think',
      'Believing you can "handle it" this time',
      'Shame about past behaviors'
    ],
    overcomingChallenges: [
      'Remember that every person in recovery started here',
      'This admission is between you and yourself first, then you can share when ready',
      'Powerlessness is the beginning of freedom, not an end',
      'Shame loses its power when spoken'
    ],
    signsOfProgress: [
      'You can say "I have an addiction" without shame',
      'You stop trying to control the uncontrollable',
      'You\'re willing to listen to others\' experiences',
      'You recognize patterns in your behavior'
    ],
    tasks: [
      'Write down all the ways addiction has negatively impacted your life (relationships, finances, health, career, self-esteem)',
      'Make a list of times you tried to quit or control your use but couldn\'t',
      'Identify specific areas where you feel completely powerless',
      'Write about the moment you realized "I can\'t do this alone"',
      'Acknowledge that you need help and write down what kind of help you need',
      'Make a commitment to yourself that you will ask for help when you need it',
      'Share your admission with at least one trusted person (sponsor, therapist, family member)'
    ],
    roleplayScenarios: [
      {
        title: 'Admitting Powerlessness to a Loved One',
        scenario: 'You are speaking with a family member or close friend about your addiction for the first time. This is a vulnerable moment.',
        tips: [
          'Choose a private, calm setting where you won\'t be interrupted',
          'Be completely honest about your struggles - don\'t minimize',
          'Share specific examples of how addiction has affected your life',
          'Express your desire to change and your fear about the process',
          'Ask for their support, not judgment',
          'Let them know this admission is a step toward healing',
          'Be prepared for their reaction - it may take time for them to process'
        ],
        whatToSay: [
          '"I need to tell you something important. I\'ve been struggling with addiction, and I\'ve realized I can\'t handle it alone anymore."',
          '"My addiction has affected my life in many ways, and I\'m finally ready to admit that I need help."',
          '"I\'ve tried to stop on my own many times, but I can\'t. I\'m powerless over this, and I need support."',
          '"This is hard for me to say, but I love you enough to be honest with you about my addiction."'
        ],
        guidance: "Asking for help takes enormous courage. Remember, you're not alone in this journey. The act of admission itself is a powerful step toward recovery. Prepare yourself emotionally - their reaction may be shock, anger, sadness, or relief. Whatever their initial response, know that you've taken a brave first step."
      },
      {
        title: 'Admitting Powerlessness in a Support Group',
        scenario: 'You\'re at your first support group meeting and it\'s your turn to share. You need to admit your powerlessness to the group.',
        tips: [
          'Remember that everyone in that room has been where you are',
          'Keep it simple - you don\'t need to share your entire life story',
          'Focus on your feelings and your realization, not just the details of using',
          'Be honest about your fears and uncertainties',
          'Listen to others sharing their experiences',
          'Realize that your admission will help others feel less alone'
        ],
        whatToSay: [
          '"Hi, I\'m [Name], and I\'m an addict. I finally realized that I can\'t control this on my own."',
          '"I came here because I\'ve tried everything to stop and nothing works. I\'m powerless over my addiction."',
          '"I\'ve been fighting this for years, thinking I could beat it alone. I can\'t anymore. I need help."',
          '"I\'m scared but I\'m here because I finally admitted that I\'m not in control anymore."'
        ],
        guidance: "Support group meetings are one of the safest places to make this admission. You'll find empathy, not judgment. Your honesty will resonate with others and create connections that are crucial for recovery. Take your time, breathe, and speak from your heart."
      }
    ]
  },
  {
    number: 2,
    title: 'Came to believe that a Power greater than ourselves could restore us to sanity',
    description: 'This step is about finding hope and believing that recovery is possible through something greater than our individual willpower.',
    meaning: 'We open ourselves to the possibility of help and healing from sources beyond our own limited abilities.',
    whyImportant: 'Without hope and belief in something greater, recovery feels impossible. This step plants the seed of possibility.',
    perspective: 'A "Power greater than ourselves" means different things to different people. It can be a support system, the collective wisdom of recovery communities, nature\'s healing power, the strength of human connection, or spiritual beliefs you hold. What matters is believing that recovery is possible and that you don\'t have to do it alone.',
    commonChallenges: [
      'Struggling with the concept of "Higher Power" if you\'re not religious',
      'Past disappointments making it hard to trust anything',
      'Feeling like this step requires belief you don\'t have yet',
      'Confusion about what this "Power" actually means'
    ],
    overcomingChallenges: [
      'Start with what you CAN believe - even if it\'s just "the group\'s wisdom"',
      'This step says "came to believe" - it\'s a process, not instant faith',
      'Your Higher Power can be as unique as you are',
      'Look for evidence of help from sources outside yourself in the past'
    ],
    signsOfProgress: [
      'You\'re starting to see glimpses of hope',
      'You notice help coming from unexpected places',
      'You\'re more open to listening to others\' recovery stories',
      'You feel less alone in your struggle'
    ],
    tasks: [
      'Reflect on what "greater than yourself" might mean for you personally',
      'Write about times in your life when you received help from others or something beyond yourself',
      'Consider what gives you hope about recovery - write it down in detail',
      'Think about people you admire who found recovery and what helped them',
      'Write down three sources of strength or support you can turn to',
      'List qualities you\'d want in a "Higher Power" - these might reflect what you need',
      'Spend time in nature or in settings that make you feel connected to something larger',
      'Read recovery stories of others who found hope'
    ],
    roleplayScenarios: [
      {
        title: 'Exploring Your Higher Power with a Sponsor',
        scenario: 'You\'re meeting with a sponsor and discussing what a Higher Power means to you. You\'re uncertain and want to explore the concept.',
        tips: [
          'Be honest about your doubts and uncertainties',
          'Ask questions - sponsors have been through this process',
          'Share what you do believe, even if it seems small',
          'Listen to how others understand this step without feeling pressure to agree',
          'Take time to find what resonates with you personally',
          'Remember this is YOUR journey, not anyone else\'s'
        ],
        whatToSay: [
          '"I\'m having trouble with the concept of a Higher Power. Can you help me understand this better?"',
          '"I\'m not religious, so this step is confusing for me. What does it mean for someone like me?"',
          '"I want to believe something can help me, but I\'m not sure what that is yet."',
          '"Can you tell me about your experience with Step 2? How did you come to believe?"'
        ],
        guidance: "Step 2 is about possibility, not certainty. It's okay to come to believe gradually - that's why the step says 'came to believe' and not 'immediately believed.' Your sponsor can help you explore what works for you. There's no right or wrong way to understand a Higher Power."
      }
    ]
  },
  {
    number: 3,
    title: 'Made a decision to turn our will and our lives over to the care of a Power greater than ourselves',
    description: 'This is the action step where we actively choose to trust and follow guidance from our Higher Power and recovery support system.',
    meaning: 'We make a conscious decision to surrender our control and follow a path of recovery that has worked for others.',
    whyImportant: 'Decision transforms hope into action. We stop fighting and start allowing help to guide us.',
    perspective: 'Turning our will over doesn\'t mean being passive or giving up. It means being open to guidance, willing to follow proven recovery principles, and trusting that something wiser than our addicted mind can lead us toward healing. It\'s about collaboration, not capitulation.',
    commonChallenges: [
      'Fear of losing control over your life',
      'Not knowing what "turning it over" actually looks like in practice',
      'Wanting immediate results and getting frustrated',
      'Reverting to old patterns of trying to control everything'
    ],
    overcomingChallenges: [
      'Start with small decisions - turn one thing over at a time',
      'Ask others how they practice this step in daily life',
      'Notice when "your will" has led to trouble vs. when following guidance helped',
      'This is a daily practice, not a one-time decision',
      'Trust the process, even when you can\'t see the outcome'
    ],
    signsOfProgress: [
      'You pause before making important decisions and consider guidance',
      'You\'re more willing to try suggestions from your support network',
      'You notice when your "addict thinking" is trying to take over',
      'You feel less burdened by having to figure everything out alone'
    ],
    tasks: [
      'Write a personal decision statement: "I turn my will and my life over to..."',
      'Identify situations where your "will" has clearly made things worse',
      'Make a list of recovery principles you\'re willing to follow (honesty, open-mindedness, willingness)',
      'Practice pausing and asking for guidance before making decisions',
      'Each morning, write one thing you\'re turning over for the day',
      'Each evening, reflect on when you followed guidance and when you didn\'t',
      'Create a recovery plan with specific actions you\'re committing to follow',
      'Share your decision with someone in your support network'
    ],
    roleplayScenarios: [
      {
        title: 'Turning Over a Difficult Decision',
        scenario: 'You\'re facing a challenging situation and need to practice turning your will over. You\'re talking with your sponsor about it.',
        tips: [
          'Describe the situation honestly, including what you want to do',
          'Share your fears about not being in control',
          'Ask for their perspective and guidance',
          'Be willing to follow advice even if it\'s not what you initially wanted',
          'Notice how you feel when you let go of trying to control the outcome',
          'Remember that turning over doesn\'t mean abdicating responsibility'
        ],
        whatToSay: [
          '"I\'m in a difficult situation and I keep trying to control everything, but it\'s not working. Can you help me turn this over?"',
          '"My addict mind wants to do X, but I know that\'s not right. Help me follow a better path."',
          '"I\'m scared about this decision. What would you suggest I do?"',
          '"I\'m turning this situation over - please help me see what the right action is."'
        ],
        guidance: "Turning over your will is like asking for directions when you're lost. It doesn't mean you stop driving - it means you follow a better route. Practice this with small decisions first, then work up to bigger ones. The more you do it, the easier and more natural it becomes."
      }
    ]
  },
  {
    number: 4,
    title: 'Made a searching and fearless moral inventory of ourselves',
    description: 'This step involves taking a thorough, honest look at ourselves - our character, behaviors, resentments, fears, and patterns.',
    meaning: 'We examine every aspect of our lives with brutal honesty, without judgment but with complete truth.',
    whyImportant: 'We cannot heal what we won\'t acknowledge. This inventory reveals the patterns and wounds that need attention.',
    perspective: 'A moral inventory is not about self-condemnation - it\'s about self-awareness. By examining our resentments, fears, harms done to others, and character defects without judgment, we can identify what\'s working, what needs to change, and what needs healing. This inventory is a tool for freedom, not shame.',
    commonChallenges: [
      'Fear of what you\'ll find when you look deeply',
      'Getting overwhelmed by all there is to inventory',
      'Wanting to skip the "fearless" part and stay in comfort zones',
      'Slipping into shame and guilt instead of using this information constructively'
    ],
    overcomingChallenges: [
      'Work with a sponsor or therapist - don\'t do this step alone',
      'Take it one category at a time - resentments, fears, harms, etc.',
      'Remember the goal is awareness and healing, not self-punishment',
      'Write without censoring yourself - you can always edit later',
      'Set aside dedicated time for this work'
    ],
    signsOfProgress: [
      'You can look at your past behavior with curiosity instead of just shame',
      'You notice patterns in your relationships and choices',
      'You understand your resentments better and what they reveal about you',
      'You see how your fears have driven your decisions'
    ],
    tasks: [
      'Create inventory categories: Resentments, Fears, Harms Done, Sex/Relationships, Assets (what\'s good about you)',
      'For each resentment: Who did you resent? What did they do? What part of self was affected? Where was this wrong?',
      'For each fear: What are you afraid of? Why? What would happen if this fear came true?',
      'List all people you\'ve harmed and how - be specific and thorough',
      'Examine your character defects: Dishonesty, selfishness, fear, resentment, etc.',
      'Also list your assets and good qualities - this isn\'t just about what\'s "wrong" with you',
      'Review how your addiction affected each area: career, relationships, finances, health, spirituality',
      'Be fearless - don\'t skip anything because it\'s uncomfortable'
    ],
    roleplayScenarios: [
      {
        title: 'Discussing Your Inventory with a Sponsor',
        scenario: 'You\'ve completed part of your moral inventory and are reviewing it with your sponsor. This is vulnerable work.',
        tips: [
          'Share what you\'ve written honestly, without minimizing',
          'Notice any resistance to sharing certain items - explore why',
          'Ask for their perspective on patterns they notice',
          'Be willing to look at things you might have missed',
          'Remember that everything can be worked through',
          'Take breaks if it gets overwhelming - this is deep emotional work'
        ],
        whatToSay: [
          '"I\'ve been working on my resentments inventory, and I\'ve noticed some patterns."',
          '"This part of my inventory is really hard for me to talk about."',
          '"When I look at my fears, I see how much they\'ve controlled my life."',
          '"I\'m surprised by what I found when I listed the people I\'ve harmed."'
        ],
        guidance: "Sharing your inventory is as important as writing it. Your sponsor can help you see patterns you might miss and provide perspective without judgment. Remember that everything you discover in this inventory can be addressed, healed, and transformed. This is how we break free from the past."
      }
    ]
  },
  {
    number: 5,
    title: 'Admitted to our Higher Power, to ourselves, and to another human being the exact nature of our wrongs',
    description: 'We share our moral inventory with another person, bringing our secrets and shame into the light.',
    meaning: 'Speaking our truth out loud breaks the power of secrecy and shame that keeps us trapped.',
    whyImportant: 'Secrets keep us sick. Sharing them with a safe person begins the healing process.',
    perspective: 'This step is often feared, yet it\'s incredibly freeing. When we speak our darkest truths to another person who listens without judgment, we realize we\'re not alone and we\'re not defined by our worst moments. The exact nature of our wrongs becomes clear, and we can finally start addressing them directly.',
    commonChallenges: [
      'Intense fear of judgment or rejection',
      'Believing your secrets are too terrible to share',
      'Fear of burdening the person you\'re telling',
      'Getting overwhelmed and wanting to quit mid-process'
    ],
    overcomingChallenges: [
      'Choose your listener carefully - someone who has done this step themselves',
      'Take it one section at a time if needed',
      'Remember that everything you share will be received with compassion',
      'Trust that you\'re in safe hands - others have heard much worse',
      'Focus on how free you\'ll feel when it\'s done'
    ],
    signsOfProgress: [
      'You feel lighter after each sharing session',
      'Your secrets no longer have power over you',
      'You can talk about your past without being overwhelmed',
      'You feel more connected to the person you shared with'
    ],
    tasks: [
      'Choose a safe person to share with (sponsor, therapist, clergy)',
      'Set up regular times to share - don\'t try to do it all at once',
      'Read directly from your written inventory',
      'Be thorough - don\'t skip items because they\'re uncomfortable',
          'Listen without interrupting to their feedback',
      'Allow yourself to feel the emotions that come up',
      'After sharing, reflect on what it was like to speak your truth'
    ],
    roleplayScenarios: [
      {
        title: 'Starting Your Fifth Step',
        scenario: 'You\'re about to begin sharing your fifth step with your sponsor. You\'re nervous but ready.',
        tips: [
          'Start by stating your intention and any fears you have',
          'Take your time - there\'s no rush',
          'If you get emotional, that\'s okay - pause if needed',
          'Remember that your sponsor is there to help, not judge',
          'Trust the process - thousands have done this before you'
        ],
        whatToSay: [
          '"I\'m ready to share my fifth step. I\'m nervous but I\'m going to do it anyway."',
          '"Before I start, I want to say that I\'m afraid of being judged."',
          '"Here is my moral inventory. I\'m going to read through it."',
          '"Some parts are really hard for me to say, but I\'m committed to being thorough."'
        ],
        guidance: "The anticipation of the fifth step is often worse than the step itself. You'll find immense relief in speaking your truth. Your sponsor knows exactly what you're going through - they've done their own fifth step and heard many others. You are safe, and you are doing the work that will set you free."
      }
    ]
  },
  {
    number: 6,
    title: 'Were entirely ready to have our Higher Power remove all these defects of character',
    description: 'We become willing to let go of the character defects we\'ve identified and be transformed.',
    meaning: 'Readiness means we\'re no longer defending our character defects but wanting them gone.',
    whyImportant: 'We can\'t change what we\'re still attached to. This step prepares us for real transformation.',
    perspective: 'This step is about readiness, not immediate change. We acknowledge that our character defects no longer serve us and we\'re willing to be different. It\'s the crucial moment where we stop saying "this is just who I am" and start saying "I\'m ready to change."',
    commonChallenges: [
      'Still wanting to hold onto some defects because they feel familiar',
      'Believing some defects are actually strengths',
      'Fear of who you\'ll be without these patterns',
      'Thinking you need to fix yourself before you can be ready'
    ],
    overcomingChallenges: [
      'Ask yourself: "Does this truly serve me or my recovery?"',
      'Look at how these defects have caused problems in your life',
      'Remember that you\'re not losing yourself - you\'re becoming your best self',
      'Trust that something better awaits when these defects are removed',
      'Be willing to be entirely ready - no exceptions'
    ],
    signsOfProgress: [
      'You can honestly say you want these defects gone',
      'You stop making excuses for harmful behaviors',
      'You\'re open to transformation even when it\'s uncomfortable',
      'You notice when defects arise and don\'t like it anymore'
    ],
    tasks: [
      'Review your inventory and list all character defects identified',
      'For each defect, write why you\'ve held onto it (fear, familiarity, perceived benefit)',
      'Write about how each defect has harmed you and others',
      'Pray or meditate on being willing to let go',
      'Write a statement: "I am entirely ready to have removed..." and list them',
      'Share your readiness with your sponsor or support person',
      'Notice any resistance - explore what\'s behind it'
    ],
    roleplayScenarios: [
      {
        title: 'Expressing Readiness for Change',
        scenario: 'You\'re discussing Step 6 with your sponsor and working through any resistance to letting go of character defects.',
        tips: [
          'Be honest about any defects you\'re struggling to release',
          'Explore why you\'ve held onto them - what do you think you gain?',
          'Ask your sponsor to help you see these defects clearly',
          'Remind yourself of the harm these defects have caused',
          'Focus on the freedom you\'ll feel when they\'re gone'
        ],
        whatToSay: [
          '"I\'m ready to let go of most of my defects, but I\'m struggling with..."',
          '"I\'m afraid that if I let go of this defect, I won\'t be myself anymore."',
          '"I can see clearly how this defect has hurt me, and I\'m ready for it to go."',
          '"Help me understand why I\'m so attached to this particular character defect."'
        ],
        guidance: "Step 6 is about willingness, not about doing the changing yourself. That comes in the next step. For now, focus entirely on being ready - willing, open, no longer defending these patterns. Your sponsor can help you see where you're holding back and why."
      }
    ]
  },
  {
    number: 7,
    title: 'Humbly asked our Higher Power to remove our shortcomings',
    description: 'We ask for help in removing our character defects, with humility and surrender.',
    meaning: 'We actively seek transformation from a source greater than ourselves.',
    whyImportant: 'We cannot remove these defects by willpower alone - we need help beyond ourselves.',
    perspective: 'This step is about humble asking, not demanding or bargaining. We acknowledge that we need help and we ask for it with sincerity. The key word is "humbly" - recognizing our need without self-condemnation. We\'re asking to be changed, not to be punished.',
    commonChallenges: [
      'Not knowing how to "ask" or what to say',
      'Feeling unworthy of help',
      'Expecting instant results and getting frustrated',
      'Confusion about what part is yours vs. what\'s the Higher Power\'s',
      'Reverting to trying to fix yourself by willpower'
    ],
    overcomingChallenges: [
      'Simply and sincerely ask - it doesn\'t need to be elaborate',
          'Remember that your worthiness isn\'t the issue - your willingness is',
      'This is a daily practice, not a one-time fix',
      'Your part is the asking and then taking right action',
      'Be patient - transformation happens gradually'
    ],
    signsOfProgress: [
      'You regularly ask for help with your character defects',
      'You notice changes in your behaviors over time',
      'You\'re quicker to apologize and make amends',
      'You react differently in situations that used to trigger your defects'
    ],
    tasks: [
      'Create a daily practice of asking for removal of shortcomings',
      'Be specific about which defects you\'re asking to have removed',
      'Ask with humility - recognizing your need without self-loathing',
      'After asking, pay attention to prompts and intuitions about right action',
      'Notice when you act from defects vs. when you act from your better self',
      'Keep a journal of changes you notice over time',
      'Share your experience with this step with your sponsor'
    ],
    roleplayScenarios: [
      {
        title: 'Practicing Daily Prayer for Step 7',
        scenario: 'You\'re developing your Step 7 practice and discussing how to make it a meaningful daily habit.',
        tips: [
          'Find words that feel authentic to you - no need for formal religious language',
          'Make it personal and specific to your defects',
          'Be consistent - same time each day if possible',
          'Combine the asking with action on your part',
          'Notice the difference between asking and demanding'
        ],
        whatToSay: [
          '"I\'m working on my daily Step 7 practice. How did you make it meaningful?"',
          '"Can you help me find the right words to ask humbly?"',
          '"I\'m asking for help, but I\'m not sure what action I should take."',
          '"This feels strange to me. How do I make this genuine?"'
        ],
        guidance: "Your Step 7 practice should feel authentic to you. Some people use formal prayers, others speak conversationally, some write it down. What matters is the sincere asking from a place of humility. Your Higher Power isn't looking for perfect words - just a willing heart."
      }
    ]
  },
  {
    number: 8,
    title: 'Made a list of all persons we had harmed, and became willing to make amends to them all',
    description: 'We identify everyone we\'ve harmed and prepare ourselves to make things right.',
    meaning: 'We face the harm we\'ve caused others and prepare to take responsibility.',
    whyImportant: 'Unresolved harms create guilt and shame that block recovery. Making amends frees everyone.',
    perspective: 'This step is about preparation, not action yet. We create a thorough list and work on becoming willing to make amends. Willingness is key - we may not feel ready yet, but we work toward it. This list helps us see the full scope of harm we\'ve caused.',
    commonChallenges: [
      'Feeling overwhelmed by how many people you\'ve harmed',
      'Fear of facing those you\'ve hurt',
      'Reluctance to include certain people because they hurt you too',
      'Not wanting to make amends because it\'s uncomfortable or risky'
    ],
    overcomingChallenges: [
      'Take it one person at a time - no rush to do it all at once',
      'Focus on YOUR harm, not theirs - this isn\'t about blame',
      'Talk through each person with your sponsor',
      'Remember that willingness develops - it doesn\'t have to be there instantly',
          'Trust that the process works, even when it\'s hard'
    ],
    signsOfProgress: [
      'You can look at each person on your list without avoiding',
      'You\'re more concerned about their well-being than your own comfort',
      'You can see the harm you caused clearly',
      'You\'re becoming willing, even if reluctantly'
    ],
    tasks: [
      'Go through your inventory and list every person you\'ve harmed',
      'For each person, write specifically how you harmed them',
      'Note any circumstances that might affect how you make amends',
      'Separate your list into those you can make amends to now vs. those to wait on',
          'Work on willingness for each person, especially the hard ones',
      'Discuss your list thoroughly with your sponsor',
      'Don\'t make any amends yet - this step is preparation only'
    ],
    roleplayScenarios: [
      {
        title: 'Working Through Your Amends List',
        scenario: 'You\'ve created your list of people harmed and are reviewing it with your sponsor, working through any resistance.',
        tips: [
          'Be thorough - don\'t leave anyone off because it\'s uncomfortable',
          'For each person, focus only on your actions, not theirs',
          'Notice your level of willingness - where is it strong, where is it weak?',
          'Ask for help with people you\'re resistant to making amends to',
          'Trust that becoming willing is part of the process'
        ],
        whatToSay: [
          '"I\'ve made my list, but I\'m really struggling with being willing to make amends to..."',
          '"This person really hurt me too. Do I still need to make amends?"',
          '"I\'m overwhelmed by how many people are on my list."',
          '"Can you help me become willing to make amends to this person?"'
        ],
        guidance: "Making a thorough list requires honesty and courage. Include everyone you've harmed, regardless of how they treated you. This is about YOUR side of the street. Your sponsor will help you work through resistance and determine the right timing for each amend. Remember, you're preparing now - action comes in the next step."
      }
    ]
  },
  {
    number: 9,
    title: 'Made direct amends to such people wherever possible, except when to do so would injure them or others',
    description: 'We actually make the amends we\'ve prepared for, with wisdom and care.',
    meaning: 'We take action to repair the harm we\'ve caused, when it\'s safe and appropriate.',
    whyImportant: 'Actions speak louder than words. Making amends transforms guilt into freedom.',
    perspective: 'This is where the rubber meets the road. We actually do what we\'ve prepared for. But crucially, we do it wisely - not causing further harm. Some amends happen face-to-face, some in writing, some indirectly. We don\'t make amends to get forgiveness (we can\'t control that) but to do what\'s right.',
    commonChallenges: [
      'Fear of rejection or anger from those you\'ve harmed',
      'Not knowing what to say',
      'Wanting to explain or justify your actions',
      'Facing people you haven\'t seen in years',
      'Worrying about making things worse'
    ],
    overcomingChallenges: [
      'Work with your sponsor to plan each amend carefully',
      'Keep it simple - apologize, acknowledge the harm, offer to repair',
          'Don\'t explain or justify - just take responsibility',
      'Accept whatever response you get with grace',
      'Some amends may need to be indirect - write a letter, make a donation, etc.'
    ],
    signsOfProgress: [
      'You\'re able to make amends without defending yourself',
      'You feel lighter after each amend, regardless of the response',
      'You\'re more aware of how your actions affect others in the present',
      'You\'ve made significant progress on your amends list'
    ],
    tasks: [
      'Work with your sponsor to determine which amends are safe to make now',
      'Plan what you\'ll say for each amend - keep it brief and sincere',
      'Make amends directly when possible - face-to-face or phone',
      'Use written amends when direct contact isn\'t possible or safe',
      'Don\'t expect or ask for forgiveness - just do what\'s right',
      'After each amend, note how it felt and what you learned',
      'Continue making amends until your list is complete'
    ],
    roleplayScenarios: [
      {
        title: 'Making a Direct Amends',
        scenario: 'You\'re about to make a direct amend to someone you\'ve harmed. You\'ve prepared what you\'ll say.',
        tips: [
          'Choose the right time and place - private and calm',
          'Keep it brief and sincere - no long explanations',
          'Acknowledge exactly what you did wrong',
          'Offer to make things right if appropriate',
          'Don\'t expect any particular response',
          'Accept their reaction, whatever it is, with grace'
        ],
        whatToSay: [
          '"I need to apologize to you for something I did. When I [specific action], I harmed you by [how it harmed]. I\'m sorry."',
          '"I\'ve been thinking about how I treated you, and I want to make amends. I was wrong when I [specific action]."',
          '"I owe you an apology for [specific harm]. I\'m sorry and I want to make it right."',
          '"I\'ve done a lot of work on myself, and I realize how much I hurt you when I [specific action]. I\'m truly sorry."'
        ],
        guidance: "Making amends is powerful but scary work. Preparation is key. Know what you'll say, keep it simple, and focus on taking responsibility rather than explaining yourself. Their reaction is not your concern - you're doing this for your recovery, not to get a specific response. Each amend lightens your load."
      }
    ]
  },
  {
    number: 10,
    title: 'Continued to take personal inventory and when we were wrong promptly admitted it',
    description: 'We make ongoing self-reflection a daily practice, quickly acknowledging when we\'re wrong.',
    meaning: 'Recovery doesn\'t end - we stay aware of ourselves and honest about our mistakes.',
    whyImportant: 'This step prevents the accumulation of new resentments and harms that could jeopardize recovery.',
    perspective: 'Step 10 is about maintenance - keeping our recovery clean day by day. Instead of letting things build up, we address them promptly. This daily inventory keeps us self-aware, humble, and connected to our values. It\'s about catching things early, before they become big problems.',
    commonChallenges: [
      'Forgetting to do daily inventory',
      'Resisting admitting when you\'re wrong',
      'Letting days go by without addressing issues',
      'Feeling like you\'re always admitting fault'
    ],
    overcomingChallenges: [
      'Make it a daily habit - same time each day',
      'Keep it simple - doesn\'t need to take long',
      'Remember that prompt admission prevents bigger problems',
          'Notice the relief you feel when you admit quickly',
      'Balance this with acknowledging when you do things right too'
    ],
    signsOfProgress: [
      'You regularly review your day and catch mistakes quickly',
      'You\'re comfortable admitting when you\'re wrong',
      'You don\'t let resentments build up',
      'Others notice you\'re quicker to apologize'
    ],
    tasks: [
      'Set aside time each day for a brief inventory',
      'Ask yourself: Where was I resentful? selfish? dishonest? afraid?',
      'When you identify being wrong, admit it promptly to yourself and others',
          'Notice when your character defects show up and acknowledge them',
      'Also acknowledge what you did well each day',
      'Share your struggles with this step with your sponsor',
      'Use journaling to track patterns you notice'
    ],
    roleplayScenarios: [
      {
        title: 'Promptly Admitting a Mistake',
        scenario: 'You\'ve made a mistake and need to practice Step 10 by admitting it right away.',
        tips: [
          'Don\'t wait - admit it as soon as you realize it',
          'Keep it simple - no long explanations',
          'Be specific about what you did wrong',
          'If you\'ve harmed someone, make amends promptly',
          'Notice how much lighter you feel when you don\'t carry the mistake',
          'Practice this regularly - it gets easier'
        ],
        whatToSay: [
          '"I need to admit that I was wrong. When I [what you did], I shouldn\'t have. I\'m sorry."',
          '"I made a mistake. I [what you did], and that was wrong of me."',
          '"I want to acknowledge that I was out of line. Here\'s what happened..."',
          '"I just realized I messed up. I want to admit it and fix it."'
        ],
        guidance: "The beauty of Step 10 is in the 'promptly' part. Admitting mistakes right away prevents them from growing into big issues. It also builds trust with others - they see you're committed to honesty and integrity. Make this a daily practice, and you'll find recovery much smoother."
      }
    ]
  },
  {
    number: 11,
    title: 'Sought through prayer and meditation to improve our conscious contact with our Higher Power, praying only for knowledge of His will for us and the power to carry that out',
    description: 'We develop a regular practice of prayer and meditation to strengthen our connection with our Higher Power.',
    meaning: 'We actively cultivate our spiritual life and seek guidance for our recovery journey.',
    whyImportant: 'A strong spiritual connection provides ongoing support, wisdom, and strength for recovery.',
    perspective: 'This step is about building and maintaining your relationship with your Higher Power. Prayer is speaking to that Power, meditation is listening. The goal isn\'t perfection but regular practice. We seek knowledge of what\'s right for us and the strength to do it - not to control outcomes but to act wisely.',
    commonChallenges: [
      'Not knowing how to pray or meditate',
      'Distracted mind during meditation',
      'Feeling like you\'re "doing it wrong"',
      'Inconsistency in practice',
      'Not feeling anything during practice'
    ],
    overcomingChallenges: [
      'Start simple - even 5 minutes counts',
      'Find a method that works for you - there\'s no right way',
          'Be patient with yourself - it takes practice',
      'Use guided meditations if helpful',
      'Focus on showing up regularly, not on having profound experiences'
    ],
    signsOfProgress: [
      'You have a regular prayer/meditation practice',
      'You feel more connected to your Higher Power',
      'You notice guidance coming through in your life',
      'You turn to your practice when stressed or struggling'
    ],
    tasks: [
      'Establish a regular time for daily prayer and meditation',
      'Experiment with different types of prayer and meditation',
      'Keep it simple at first - consistency matters more than length',
      'Journal about your experiences and insights',
      'Pray specifically for knowledge of what\'s right and the power to do it',
      'Include gratitude in your practice',
      'Share your spiritual journey with your sponsor or support group'
    ],
    roleplayScenarios: [
      {
        title: 'Developing Your Spiritual Practice',
        scenario: 'You\'re working on establishing a regular Step 11 practice and discussing approaches with your sponsor.',
        tips: [
          'Be honest about what feels authentic and what doesn\'t',
          'Don\'t compare your practice to others\'',
          'Start small and build gradually',
          'Experiment until you find what works',
          'Make it a non-negotiable part of your daily routine'
        ],
        whatToSay: [
          '"I\'m trying to develop my prayer and meditation practice, but I\'m not sure what\'s right for me."',
          '"Can you share how you practice Step 11? What works for you?"',
          '"I struggle with consistency in my spiritual practice. Any suggestions?"',
          '"I\'m not feeling anything when I meditate. Is that normal?"'
        ],
        guidance: "There's no right way to do Step 11 - what matters is finding what works for you and doing it consistently. Some people use formal prayers, others speak conversationally. Some meditate in silence, others use guided practices. The key is regular connection with your Higher Power and listening for guidance."
      }
    ]
  },
  {
    number: 12,
    title: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to other addicts and to practice these principles in all our affairs',
    description: 'Having experienced transformation through working the steps, we help others and live by recovery principles.',
    meaning: 'We share what we\'ve learned with others and apply recovery principles to every area of life.',
    whyImportant: 'Service keeps us connected to purpose and helps prevent relapse by focusing on helping others.',
    perspective: 'This step is about giving back and living integrated recovery. The "spiritual awakening" isn\'t necessarily dramatic - it\'s the cumulative result of working all the steps. We carry the message not by preaching but by living example and being available to help others. Recovery principles apply everywhere, not just in addiction-specific situations.',
    commonChallenges: [
      'Feeling not "ready" or "good enough" to help others',
      'Not knowing how to carry the message',
      'Forgetting to apply principles outside recovery contexts',
      'Thinking you\'re done with the steps now',
      'Burnout from helping too much'
    ],
    overcomingChallenges: [
      'You help by sharing your experience, not by being perfect',
      'Just being present and listening is powerful help',
      'Look for opportunities in everyday life to apply principles',
      'Remember the steps are a practice, not a one-time achievement',
      'Balance service with self-care'
    ],
    signsOfProgress: [
      'You\'re actively helping others in recovery',
      'You apply recovery principles in work, relationships, all areas',
      'Others come to you for support',
      'You feel connected to a larger purpose',
      'You regularly practice all the steps, not just the first 11'
    ],
    tasks: [
      'Find ways to be of service - welcome newcomers, share at meetings, sponsor others',
      'Look for opportunities to carry the message in your daily life',
      'Apply honesty, open-mindedness, willingness in all situations',
      'Continue working the steps regularly - they\'re circular, not linear',
      'Stay connected to your recovery community',
      'Be available to help others who are struggling',
      'Share your experience, strength, and hope freely'
    ],
    roleplayScenarios: [
      {
        title: 'Helping a Newcomer',
        scenario: 'A newcomer to recovery has approached you for help. This is your chance to practice Step 12.',
        tips: [
          'Share your experience, not advice unless asked',
          'Listen more than you talk',
          'Remember what it was like when you were new',
          'Be hopeful without minimizing their struggle',
          'Offer practical support - meeting info, phone number, presence',
          'Don\'t try to fix everything - just be there'
        ],
        whatToSay: [
          '"Welcome. I remember what it was like when I was new. What\'s going on with you?"',
          '"I\'d be happy to share what worked for me. Everyone\'s path is different, but here\'s my experience..."',
          '"Is there anything specific I can help you with today?"',
          '"You don\'t have to figure this all out at once. Take it one step at a time."'
        ],
        guidance: "Carrying the message isn't about being an expert or having all the answers. It's about sharing your experience, strength, and hope. Just being there and listening is powerful. Remember how much it meant when someone helped you when you were new. Pay it forward with the same compassion and support you received."
      }
    ]
  }
]

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [recoveryDate, setRecoveryDate] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [sobrietyDays, setSobrietyDays] = useState(0)
  const [sobrietyHours, setSobrietyHours] = useState(0)
  const [sobrietyMinutes, setSobrietyMinutes] = useState(0)
  const [selectedStep, setSelectedStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [groupChatInput, setGroupChatInput] = useState('')
  const [groupMessages, setGroupMessages] = useState<{userId: string, userName: string, message: string, timestamp: string}[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnectedToGroup, setIsConnectedToGroup] = useState(false)
  const [showRoleplay, setShowRoleplay] = useState(false)
  const [selectedRoleplay, setSelectedRoleplay] = useState<any>(null)
  const [gratitudeInput, setGratitudeInput] = useState('')
  const [gratitudeList, setGratitudeList] = useState<{id: string, entry: string}[]>([])
  const [workTasks, setWorkTasks] = useState<{id: string, title: string, completed: boolean}[]>([])
  const [newWorkTask, setNewWorkTask] = useState('')
  const [showCrisis, setShowCrisis] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('steps')

  // NEW: Enhanced daily check-in
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [checkInMood, setCheckInMood] = useState('')
  const [checkInEnergy, setCheckInEnergy] = useState(5)
  const [checkInStress, setCheckInStress] = useState('Medium')
  const [checkInTriggers, setCheckInTriggers] = useState<string[]>([])
  const [checkInNotes, setCheckInNotes] = useState('')
  const [checkInHistory, setCheckInHistory] = useState<any[]>([])

  // NEW: Journal features
  const [showJournal, setShowJournal] = useState(false)
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [journalMood, setJournalMood] = useState('')
  const [journalTags, setJournalTags] = useState<string[]>([])
  const [journalCategory, setJournalCategory] = useState('reflection')
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [journalSearch, setJournalSearch] = useState('')

  // NEW: Goals
  const [showGoals, setShowGoals] = useState(false)
  const [newGoal, setNewGoal] = useState('')
  const [goalPriority, setGoalPriority] = useState('medium')
  const [goals, setGoals] = useState<any[]>([])

  // NEW: Achievements & Stats
  const [achievements, setAchievements] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [dailyQuote, setDailyQuote] = useState('')

  // NEW: Help Requests & Matching
  const [showHelpRequest, setShowHelpRequest] = useState(false)
  const [helpRequests, setHelpRequests] = useState<any[]>([])
  const [matchedHelpers, setMatchedHelpers] = useState<any[]>([])
  const [newHelpTitle, setNewHelpTitle] = useState('')
  const [newHelpDescription, setNewHelpDescription] = useState('')
  const [newHelpCategory, setNewHelpCategory] = useState('emotional')
  const [newHelpUrgency, setNewHelpUrgency] = useState('medium')
  const [newHelpLocation, setNewHelpLocation] = useState('')

  // NEW: Profile Management
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileBio, setProfileBio] = useState('')
  const [profileSkills, setProfileSkills] = useState<string[]>([])
  const [profileLocation, setProfileLocation] = useState('')
  const [profileAvailable, setProfileAvailable] = useState(false)

  // NEW: Resources Library
  const [resources, setResources] = useState<any[]>([])
  const [resourceSearch, setResourceSearch] = useState('')
  const [resourceCategory, setResourceCategory] = useState('')
  const [selectedResource, setSelectedResource] = useState<any>(null)

  // NEW: Notifications
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Language toggle
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [isRTL, setIsRTL] = useState(false)

  // Update RTL based on language
  useEffect(() => {
    setIsRTL(language === 'ar')
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  // Helper function to get translation
  const t = (key: string) => translations[language][key as keyof typeof translations.en] || key

  // Load user data on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId')
    if (savedUserId) {
      setUserId(savedUserId)
      loadUserData(savedUserId)
    }
    // Load daily quote
    fetchDailyQuote()
  }, [])

  const fetchDailyQuote = async () => {
    try {
      const response = await fetch('/api/achievements/quote')
      const data = await response.json()
      if (data.success) {
        setDailyQuote(data.quote)
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
    }
  }

  const loadUserData = async (uid: string) => {
    try {
      setLoading(true)

      // Fetch all user data in parallel
      const [userRes, gratitudeRes, tasksRes, checkinRes, journalRes, goalsRes, achievementsRes] = await Promise.all([
        fetch(`/api/users?email=${uid}`),
        fetch(`/api/gratitude?userId=${uid}`),
        fetch(`/api/worktasks?userId=${uid}`),
        fetch(`/api/checkin?userId=${uid}`),
        fetch(`/api/journal?userId=${uid}`),
        fetch(`/api/goals?userId=${uid}`),
        fetch(`/api/achievements?userId=${uid}`)
      ])

      const [userData, gratitudeData, tasksData, checkinData, journalData, goalsData, achievementsData] = await Promise.all([
        userRes.json(),
        gratitudeRes.json(),
        tasksRes.json(),
        checkinRes.json(),
        journalRes.json(),
        goalsRes.json(),
        achievementsRes.json()
      ])

      if (userData.success && userData.user) {
        const user = userData.user
        setUserName(user.name || '')
        setRecoveryDate(user.recoveryDate ? user.recoveryDate.split('T')[0] : '')
        setSelectedGroup(user.selectedGroup || '')
        setCompletedSteps(user.stepProgress?.filter((p: any) => p.completed).map((p: any) => p.stepNumber) || [])

        if (gratitudeData.success) {
          setGratitudeList(gratitudeData.gratitudes || [])
        }

        if (tasksData.success) {
          setWorkTasks(tasksData.tasks || [])
        }

        if (checkinData.success) {
          setCheckInHistory(checkinData.checkins || [])
        }

        if (journalData.success) {
          setJournalEntries(journalData.entries || [])
        }

        if (goalsData.success) {
          setGoals(goalsData.goals || [])
        }

        if (achievementsData.success) {
          setAchievements(achievementsData.userAchievements || [])
          setUserStats(achievementsData.stats || {})
        }

        setIsOnboarded(true)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate sobriety time
  useEffect(() => {
    if (isOnboarded && recoveryDate) {
      const calculateSobriety = () => {
        const start = new Date(recoveryDate)
        const now = new Date()
        const diff = now.getTime() - start.getTime()

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        setSobrietyDays(days)
        setSobrietyHours(hours)
        setSobrietyMinutes(minutes)
      }

      calculateSobriety()
      const interval = setInterval(calculateSobriety, 60000)
      return () => clearInterval(interval)
    }
  }, [isOnboarded, recoveryDate])

  // Connect to group chat
  useEffect(() => {
    if (isOnboarded && selectedGroup && !socket) {
      const newSocket = io('/?XTransformPort=3003')

      newSocket.on('connect', () => {
        setIsConnectedToGroup(true)
      })

      newSocket.on('disconnect', () => {
        setIsConnectedToGroup(false)
      })

      newSocket.on('receive-message', (data: {userId: string, userName: string, message: string, timestamp: string}) => {
        setGroupMessages(prev => [...prev, data])
      })

      setSocket(newSocket)
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [isOnboarded, selectedGroup])

  // Fetch profile, help requests, resources when tab changes
  useEffect(() => {
    if (!isOnboarded || !userId) return

    if (activeTab === 'help') {
      fetchHelpRequests()
    }

    if (activeTab === 'profile') {
      fetchUserProfile()
    }

    if (activeTab === 'resources') {
      fetchResources()
    }
  }, [activeTab, isOnboarded, userId])

  const handleOnboard = async () => {
    if (!userName || !recoveryDate || !selectedGroup) return

    try {
      setLoading(true)
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email: `user-${Date.now()}@recovery.app`,
          recoveryDate,
          selectedGroup
        })
      })

      const data = await response.json()
      if (data.success && data.user) {
        const newUserId = data.user.id
        setUserId(newUserId)
        localStorage.setItem('userId', newUserId)
        setIsOnboarded(true)
      }
    } catch (error) {
      console.error('Error onboarding:', error)
      alert('Failed to save user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStepComplete = async (stepNumber: number) => {
    try {
      const isCompleted = completedSteps.includes(stepNumber)
      const response = await fetch('/api/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          stepNumber,
          completed: !isCompleted
        })
      })

      const data = await response.json()
      if (data.success) {
        setCompletedSteps(prev => {
          if (isCompleted) {
            return prev.filter(s => s !== stepNumber)
          }
          return [...prev, stepNumber]
        })
        // Refresh achievements
        await fetchAchievements()
      }
    } catch (error) {
      console.error('Error updating step progress:', error)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`/api/achievements?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setAchievements(data.userAchievements || [])
        setUserStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  const handleCheckIn = async () => {
    if (!checkInMood) return

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          mood: checkInMood,
          energy: checkInEnergy,
          stress: checkInStress,
          triggers: checkInTriggers,
          notes: checkInNotes
        })
      })

      const data = await response.json()
      if (data.success) {
        setCheckInHistory([data.checkin, ...checkInHistory])
        setShowCheckIn(false)
        setCheckInMood('')
        setCheckInEnergy(5)
        setCheckInStress('Medium')
        setCheckInTriggers([])
        setCheckInNotes('')
        await fetchAchievements()
      }
    } catch (error) {
      console.error('Error checking in:', error)
    }
  }

  const handleAddJournal = async () => {
    if (!journalContent.trim() || !userId) return

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: journalTitle,
          content: journalContent,
          mood: journalMood,
          tags: journalTags,
          category: journalCategory
        })
      })

      const data = await response.json()
      if (data.success) {
        setJournalEntries([data.entry, ...journalEntries])
        setJournalTitle('')
        setJournalContent('')
        setJournalTags([])
        setShowJournal(false)
        await fetchAchievements()
      }
    } catch (error) {
      console.error('Error adding journal:', error)
    }
  }

  const handleAddGoal = async () => {
    if (!newGoal.trim() || !userId) return

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: newGoal,
          priority: goalPriority
        })
      })

      const data = await response.json()
      if (data.success) {
        setGoals([data.goal, ...goals])
        setNewGoal('')
        setGoalPriority('medium')
        setShowGoals(false)
      }
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const toggleGoal = async (goalId: string) => {
    const goal = goals.find((g: any) => g.id === goalId)
    if (!goal) return

    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: goalId,
          completed: !goal.completed
        })
      })

      const data = await response.json()
      if (data.success) {
        setGoals(goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g))
        await fetchAchievements()
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !userName) return

    const userMessage = chatInput.trim()
    setChatMessages([...chatMessages, { role: 'user', content: userMessage }])
    setChatInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: userMessage,
          history: chatMessages
        })
      })

      const data = await response.json()
      if (data.response) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (error) {
      console.error('Error sending chat:', error)
      const fallbackResponses = [
        "I hear you, and your feelings are valid. Recovery is a journey.",
        "Remember, you're not alone. Many people have faced similar moments.",
        "Let's focus on what you can control right now - this moment.",
        "Taking it one step at a time is the best approach.",
        "Each day of sobriety is a new opportunity for growth.",
      ]
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
    }
  }

  const sendGroupMessage = () => {
    if (!groupChatInput.trim() || !socket) return

    setGroupChatInput('')
    socket.emit('send-message', {
      userId,
      userName,
      group: selectedGroup,
      message: groupChatInput.trim()
    })
  }

  const handleAddGratitude = async () => {
    if (!gratitudeInput.trim() || !userId) return

    try {
      const response = await fetch('/api/gratitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          entry: gratitudeInput.trim()
        })
      })

      const data = await response.json()
      if (data.success) {
        setGratitudeList([{ id: data.gratitude.id, entry: data.gratitude.entry }, ...gratitudeList])
        setGratitudeInput('')
        await fetchAchievements()
      }
    } catch (error) {
      console.error('Error adding gratitude:', error)
    }
  }

  const addWorkTask = () => {
    if (!newWorkTask.trim() || !userId) return

    setWorkTasks([...workTasks, {
      id: Date.now().toString(),
      title: newWorkTask.trim(),
      completed: false
    }])
    setNewWorkTask('')
  }

  const toggleWorkTask = (taskId: string) => {
    setWorkTasks(workTasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteWorkTask = (taskId: string) => {
    setWorkTasks(workTasks.filter(t => t.id !== taskId))
  }

  // Filter journal entries based on search
  const filteredJournalEntries = journalEntries.filter((entry: any) => {
    if (!journalSearch) return true
    const searchLower = journalSearch.toLowerCase()
    const title = entry.title?.toLowerCase() || ''
    const content = entry.content.toLowerCase()
    const tags = entry.tags ? JSON.parse(entry.tags) : []
    return title.includes(searchLower) ||
           content.includes(searchLower) ||
           tags.some((t: string) => t.toLowerCase().includes(searchLower))
  })

  // NEW: Help Requests Handlers
  const handleCreateHelpRequest = async () => {
    if (!newHelpTitle.trim() || !newHelpDescription.trim() || !userId) return

    try {
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: userId,
          title: newHelpTitle.trim(),
          description: newHelpDescription.trim(),
          category: newHelpCategory,
          urgency: newHelpUrgency,
          location: newHelpLocation.trim() || null
        })
      })

      const data = await response.json()
      if (data.success) {
        setHelpRequests([data.helpRequest, ...helpRequests])
        setMatchedHelpers(data.matches || [])
        setNewHelpTitle('')
        setNewHelpDescription('')
        setNewHelpLocation('')
        setShowHelpRequest(false)
      }
    } catch (error) {
      console.error('Error creating help request:', error)
    }
  }

  const fetchHelpRequests = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/help-requests?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setHelpRequests(data.helpRequests || [])
      }
    } catch (error) {
      console.error('Error fetching help requests:', error)
    }
  }

  // NEW: Profile Handlers
  const handleUpdateProfile = async () => {
    if (!userId) return

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userId,
          bio: profileBio.trim() || null,
          skills: profileSkills.length > 0 ? profileSkills : null,
          location: profileLocation.trim() || null,
          isAvailable: profileAvailable
        })
      })

      const data = await response.json()
      if (data.success) {
        setUserProfile(data.user)
        setShowProfileEdit(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const fetchUserProfile = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/users?email=${userId}`)
      const data = await response.json()
      if (data.success && data.user) {
        setUserProfile(data.user)
        setProfileBio(data.user.bio || '')
        setProfileSkills(data.user.skills ? JSON.parse(data.user.skills) : [])
        setProfileLocation(data.user.location || '')
        setProfileAvailable(data.user.isAvailable || false)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // NEW: Resources Handlers
  const fetchResources = async () => {
    try {
      const searchParams = new URLSearchParams()
      if (resourceSearch) searchParams.append('search', resourceSearch)
      if (resourceCategory) searchParams.append('category', resourceCategory)

      const response = await fetch(`/api/resources?${searchParams}`)
      const data = await response.json()
      if (data.success) {
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  }

  // NEW: Notifications Handler
  const fetchNotifications = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/notifications?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const selectedStepData = TWELVE_STEPS.find(s => s.number === selectedStep)

  // Onboarding Screen
  if (!isOnboarded) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-2xl border-2">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t('heroTitle')}
            </CardTitle>
            <CardDescription>
              {t('heroSubtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Recovery Date</label>
              <Input
                type="date"
                value={recoveryDate}
                onChange={(e) => setRecoveryDate(e.target.value)}
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Choose Your Support Group</label>
              <ScrollArea className="h-64 rounded-md border p-4">
                <div className="space-y-3">
                  {RECOVERY_GROUPS.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedGroup === group.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-semibold">{group.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{group.description}</div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Button
              onClick={handleOnboard}
              disabled={!userName || !recoveryDate || !selectedGroup || loading}
              className="w-full py-6 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {loading ? 'Saving...' : 'Begin Your Recovery Journey'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800">
      {/* Crisis Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setShowCrisis(true)}
          variant="destructive"
          size="lg"
          className="shadow-lg animate-pulse"
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          SOS Help
        </Button>
      </div>

      {/* Crisis Modal */}
      {showCrisis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full border-red-500 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400 flex items-center gap-2">
                <Phone className="w-8 h-8" />
                Crisis Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">If you are in crisis, please reach out for help immediately:</p>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-semibold text-lg mb-2">SAMHSA National Helpline</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">1-800-662-HELP (4357)</p>
                <p className="text-sm mt-2">Free, confidential, 24/7, 365-day-a-year treatment referral</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setShowCrisis(false)} className="flex-1">
                  I am safe for now
                </Button>
                <Button
                  onClick={() => window.open('tel:1-800-662-4357')}
                  variant="destructive"
                  className="flex-1"
                >
                  Call Helpline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Quote Banner */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-4 border-b">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <Quote className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <p className="text-sm italic text-purple-800 dark:text-purple-200">"{dailyQuote}"</p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Recovery Journey
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('welcomeDesc')}, {userName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <Button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <span className="text-sm font-semibold">
                  {language === 'ar' ? 'English' : 'العربية'}
                </span>
              </Button>

              {/* Achievements Badge */}
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400">
                <Flame className="w-5 h-5 mr-2" />
                {userStats?.currentStreak || 0} {t('days')} {t('currentStreak')}
              </Badge>

              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('sobrietyTime')}</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {sobrietyDays}{t('days')} {sobrietyHours}h {sobrietyMinutes}m
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main dir={isRTL ? 'rtl' : 'ltr'} className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 lg:w-5/6 mx-auto mb-8 gap-2">
            <TabsTrigger value="steps" className="text-xs sm:text-sm">{t('steps12')}</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm">{t('dashboard')}</TabsTrigger>
            <TabsTrigger value="daily" className="text-xs sm:text-sm">{t('dailyTools')}</TabsTrigger>
            <TabsTrigger value="journal" className="text-xs sm:text-sm">{t('journal')}</TabsTrigger>
            <TabsTrigger value="group" className="text-xs sm:text-sm">{t('groupChat')}</TabsTrigger>
            <TabsTrigger value="help" className="text-xs sm:text-sm">{t('helpRequests')}</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">{t('profile')}</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm">{t('resources')}</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Mood Chart */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    Mood & Energy Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={checkInHistory.slice(-7).map((h: any) => ({
                      date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      mood: MOOD_OPTIONS.findIndex((m: any) => m.value === h.mood),
                      energy: h.energy || 5
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} dot={{ fill: '#8884d8' }} />
                      <Line yAxisId="right" type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-emerald-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="grid grid-cols-3 gap-4">
                      {achievements.length > 0 ? achievements.map((achievement: any) => (
                        <div key={achievement.id} className={`p-4 rounded-lg border-2 text-center ${achievement.color}`}>
                          <div className="text-4xl mb-2">{achievement.icon}</div>
                          <div className="font-semibold text-sm">{achievement.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</div>
                        </div>
                      )) : (
                        <div className="col-span-3 text-center text-gray-500 dark:text-gray-400 py-8">
                          <p>Complete steps and check in daily to unlock achievements!</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Stats Summary */}
              <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-emerald-500" />
                    Recovery Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{userStats?.completedSteps || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Steps Completed</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userStats?.journalCount || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Journal Entries</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{userStats?.gratitudeCount || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Gratitude Entries</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{userStats?.completedGoals || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Goals Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 12 Steps Tab */}
          <TabsContent value="steps">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-500" />
                  12-Step Recovery Journey
                </CardTitle>
                <CardDescription>
                  Work through steps with guidance and practical exercises
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {TWELVE_STEPS.map((step) => (
                    <div key={step.number} className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          completedSteps.includes(step.number)
                            ? 'bg-green-500'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {completedSteps.includes(step.number) ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{step.number}</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>

                          <Button
                            onClick={() => handleStepComplete(step.number)}
                            variant={completedSteps.includes(step.number) ? "outline" : "default"}
                            className="mb-4"
                          >
                            {completedSteps.includes(step.number) ? 'Mark as Incomplete' : 'Mark as Complete'}
                          </Button>

                          <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div>
                              <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Meaning</h4>
                              <p className="text-sm">{step.meaning}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                                <Moon className="w-4 h-4" />
                                Perspective
                              </h4>
                              <p className="text-sm">{step.perspective}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Tasks</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {step.tasks.map((task, idx) => (
                                  <li key={idx} className="text-sm">{task}</li>
                                ))}
                              </ul>
                            </div>

                            {step.roleplayScenarios && step.roleplayScenarios.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4" />
                                  Roleplay Scenarios
                                </h4>
                                <div className="space-y-2">
                                  {step.roleplayScenarios.map((scenario, idx) => (
                                    <Button
                                      key={idx}
                                      onClick={() => {
                                        setSelectedRoleplay(scenario)
                                        setShowRoleplay(true)
                                      }}
                                      variant="outline"
                                      className="w-full text-left justify-start"
                                    >
                                      <ChevronRight className="w-4 h-4 mr-2" />
                                      {scenario.title}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Tools Tab */}
          <TabsContent value="daily">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Daily Check-in */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    Daily Check-in
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showCheckIn ? (
                    <Button onClick={() => setShowCheckIn(true)} className="w-full">
                      Check In Now
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">How are you feeling?</label>
                        <div className="grid grid-cols-3 gap-2">
                          {MOOD_OPTIONS.map((mood) => (
                            <button
                              key={mood.value}
                              onClick={() => setCheckInMood(mood.value)}
                              className={`p-4 rounded-lg border-2 text-center transition-all ${
                                checkInMood === mood.value
                                  ? `border-2 ring-2 ring-${mood.value} ${mood.color}`
                                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                              }`}
                            >
                              <div className="text-3xl">{mood.emoji}</div>
                              <div className="text-sm font-medium">{mood.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Energy Level (1-10)</label>
                        <Input
                          type="range"
                          min="1"
                          max="10"
                          value={checkInEnergy}
                          onChange={(e) => setCheckInEnergy(parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-center text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                          {checkInEnergy}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Stress Level</label>
                        <div className="flex gap-2">
                          {STRESS_OPTIONS.map((stress) => (
                            <button
                              key={stress}
                              onClick={() => setCheckInStress(stress)}
                              className={`flex-1 p-3 rounded-lg border-2 ${
                                checkInStress === stress
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              {stress}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Triggers (optional)</label>
                        <div className="flex flex-wrap gap-2">
                          {TRIGGER_OPTIONS.map((trigger) => (
                            <button
                              key={trigger}
                              onClick={() => {
                                setCheckInTriggers(prev =>
                                  prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
                                )
                              }}
                              className={`px-3 py-2 rounded-lg border-2 text-sm ${
                                checkInTriggers.includes(trigger)
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              {trigger}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          value={checkInNotes}
                          onChange={(e) => setCheckInNotes(e.target.value)}
                          placeholder="Any additional notes..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => setShowCheckIn(false)} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={handleCheckIn} className="flex-1">
                          Save Check-in
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gratitude Journal */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-emerald-500" />
                    Gratitude Journal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={gratitudeInput}
                      onChange={(e) => setGratitudeInput(e.target.value)}
                      placeholder="What are you grateful for today?"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGratitude()}
                    />
                    <Button onClick={handleAddGratitude}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {gratitudeList.map((entry, idx) => (
                        <div key={idx} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <p className="text-sm">{entry.entry}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Work Tasks */}
              <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    Work Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newWorkTask}
                      onChange={(e) => setNewWorkTask(e.target.value)}
                      placeholder="Add a new task..."
                      onKeyPress={(e) => e.key === 'Enter' && addWorkTask()}
                    />
                    <Button onClick={addWorkTask}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>

                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {workTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleWorkTask(task.id)}
                            className="w-5 h-5"
                          />
                          <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                          </span>
                          <Button
                            onClick={() => deleteWorkTask(task.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Goals Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-500" />
                    Daily Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add a new goal..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                    />
                    <Button onClick={handleAddGoal}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>

                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {goals.map((goal: any) => (
                        <div key={goal.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <input
                            type="checkbox"
                            checked={goal.completed}
                            onChange={() => toggleGoal(goal.id)}
                            className="w-5 h-5"
                          />
                          <span className={`flex-1 ${goal.completed ? 'line-through text-gray-400' : ''}`}>
                            {goal.title}
                          </span>
                          <Badge className={`ml-auto ${goal.priority === 'high' ? 'bg-red-100 text-red-700' : goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {goal.priority}
                          </Badge>
                          <Button
                            onClick={() => toggleGoal(goal.id)}
                            variant="ghost"
                            size="sm"
                          >
                            {goal.completed ? '↩️' : '✅'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-6 h-6 text-emerald-500" />
                  Personal Journal
                </CardTitle>
                <div className="flex gap-2">
                  <Input
                    value={journalSearch}
                    onChange={(e) => setJournalSearch(e.target.value)}
                    placeholder="Search entries..."
                    className="max-w-xs"
                  />
                  <Button onClick={() => setShowJournal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  {filteredJournalEntries.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <p className="mb-4">Your journal is empty.</p>
                      <p>Write about your thoughts, feelings, and recovery journey.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredJournalEntries.map((entry: any) => (
                        <div key={entry.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              {entry.title && <h3 className="font-semibold text-lg mb-1">{entry.title}</h3>}
                              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{entry.content}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {entry.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {entry.category}
                                  </Badge>
                                )}
                                {entry.mood && (
                                  <Badge className="text-xs" style={{ backgroundColor: getMoodColor(entry.mood) }}>
                                    {entry.mood}
                                  </Badge>
                                )}
                                {entry.tags && JSON.parse(entry.tags).map((tag: string) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Journal Entry Modal */}
            {showJournal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>New Journal Entry</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title (optional)</label>
                      <Input
                        value={journalTitle}
                        onChange={(e) => setJournalTitle(e.target.value)}
                        placeholder="Entry title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Content *</label>
                      <Textarea
                        value={journalContent}
                        onChange={(e) => setJournalContent(e.target.value)}
                        placeholder="Write your thoughts here..."
                        rows={5}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mood</label>
                      <div className="grid grid-cols-6 gap-2">
                        {MOOD_OPTIONS.map((mood) => (
                          <button
                            key={mood.value}
                            onClick={() => setJournalMood(mood.value)}
                            className={`p-2 rounded-lg border-2 text-center ${journalMood === mood.value ? mood.color : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            {mood.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={journalCategory}
                        onChange={(e) => setJournalCategory(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tags (press Enter to add)</label>
                      <Input
                        value={journalTags.join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          setJournalTags(tags)
                        }}
                        placeholder="recovery, reflection, gratitude..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setShowJournal(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleAddJournal} className="flex-1">
                        Save Entry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Group Chat Tab */}
          <TabsContent value="group">
            <Card className="shadow-lg h-[700px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6 text-emerald-500" />
                    Group Chat
                  </h3>
                  <Badge variant={isConnectedToGroup ? "default" : "secondary"}>
                    {isConnectedToGroup ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 mb-4 p-4 border rounded-lg">
                  {groupMessages.map((msg, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.userName}</span>
                        <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">{msg.message}</p>
                    </div>
                  ))}
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={groupChatInput}
                    onChange={(e) => setGroupChatInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendGroupMessage()}
                  />
                  <Button onClick={sendGroupMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Help Requests Tab */}
          <TabsContent value="help">
            <div className="grid gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Handshake className="w-6 h-6 text-emerald-500" />
                      Help Requests & Matching
                    </CardTitle>
                    <Button onClick={() => setShowHelpRequest(!showHelpRequest)}>
                      {showHelpRequest ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" />New Request</>}
                    </Button>
                  </div>
                  <CardDescription>Request help from the community or help others</CardDescription>
                </CardHeader>

                {showHelpRequest && (
                  <CardContent className="border-t">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          value={newHelpTitle}
                          onChange={(e) => setNewHelpTitle(e.target.value)}
                          placeholder="Brief title of your request"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          value={newHelpDescription}
                          onChange={(e) => setNewHelpDescription(e.target.value)}
                          placeholder="Describe what you need help with..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <select
                            value={newHelpCategory}
                            onChange={(e) => setNewHelpCategory(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="emotional">Emotional Support</option>
                            <option value="practical">Practical Help</option>
                            <option value="advice">Advice & Guidance</option>
                            <option value="mentorship">Mentorship</option>
                            <option value="accountability">Accountability Partner</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Urgency</label>
                          <select
                            value={newHelpUrgency}
                            onChange={(e) => setNewHelpUrgency(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Location (optional)</label>
                        <Input
                          value={newHelpLocation}
                          onChange={(e) => setNewHelpLocation(e.target.value)}
                          placeholder="City, region, or nearby"
                        />
                      </div>

                      <Button onClick={handleCreateHelpRequest} className="w-full">
                        Submit Help Request
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* My Help Requests */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">My Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-96">
                      {helpRequests.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No help requests yet</p>
                      ) : (
                        <div className="space-y-3">
                          {helpRequests.map((req) => (
                            <div key={req.id} className="p-3 border rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-sm">{req.title}</h4>
                                <Badge className={
                                  req.urgency === 'urgent' ? 'bg-red-500' :
                                  req.urgency === 'high' ? 'bg-orange-500' :
                                  req.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }>{req.urgency}</Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{req.description}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Badge variant="outline">{req.category}</Badge>
                                <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                              </div>
                              <Badge variant={req.status === 'completed' ? 'default' : 'secondary'} className="mt-2">
                                {req.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Available Helpers / Matches */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Available Helpers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-96">
                      {matchedHelpers.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Create a help request to find matches</p>
                      ) : (
                        <div className="space-y-3">
                          {matchedHelpers.map((helper) => (
                            <div key={helper.id} className="p-3 border rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-sm">{helper.name}</h4>
                                {helper.averageRating > 0 && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{helper.averageRating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                              {helper.bio && <p className="text-xs text-gray-600 mb-2">{helper.bio}</p>}
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                {helper.location && <span><MapPin className="w-3 h-3 inline mr-1" />{helper.location}</span>}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <div className="flex items-center gap-1 text-xs">
                                  <Badge className={helper.isAvailable ? 'bg-green-500' : 'bg-gray-500'}>
                                    {helper.isAvailable ? 'Available' : 'Busy'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="shadow-lg max-w-2xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6 text-emerald-500" />
                    My Profile
                  </CardTitle>
                  <Button onClick={() => setShowProfileEdit(!showProfileEdit)}>
                    {showProfileEdit ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
                <CardDescription>Manage your profile and helper availability</CardDescription>
              </CardHeader>

              <CardContent>
                {!showProfileEdit ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <p className="text-lg">{userName || 'Not set'}</p>
                    </div>

                    {userProfile?.bio && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <p className="text-gray-700">{userProfile.bio}</p>
                      </div>
                    )}

                    {userProfile?.skills && JSON.parse(userProfile.skills).length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(userProfile.skills).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {userProfile?.location && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <p className="text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />{userProfile.location}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Badge className={userProfile?.isAvailable ? 'bg-green-500' : 'bg-gray-500'}>
                        {userProfile?.isAvailable ? 'Available to help' : 'Not available'}
                      </Badge>
                      {userProfile?.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{userProfile.averageRating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({userProfile.totalRatings} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <Textarea
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        placeholder="Tell others about yourself..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                      <Input
                        value={profileSkills.join(', ')}
                        onChange={(e) => setProfileSkills(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        placeholder="emotional support, mentoring, practical help..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <Input
                        value={profileLocation}
                        onChange={(e) => setProfileLocation(e.target.value)}
                        placeholder="City, state, or region"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="available"
                        checked={profileAvailable}
                        onChange={(e) => setProfileAvailable(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="available" className="text-sm">Available to help others</label>
                    </div>

                    <Button onClick={handleUpdateProfile} className="w-full">
                      Save Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Library className="w-6 h-6 text-emerald-500" />
                  Resource Library
                </CardTitle>
                <CardDescription>Helpful articles, guides, and recovery materials</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex gap-2">
                    <Input
                      value={resourceSearch}
                      onChange={(e) => setResourceSearch(e.target.value)}
                      placeholder="Search resources..."
                      className="flex-1"
                    />
                    <select
                      value={resourceCategory}
                      onChange={(e) => setResourceCategory(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="">All Categories</option>
                      <option value="articles">Articles</option>
                      <option value="guides">Guides</option>
                      <option value="exercises">Exercises</option>
                      <option value="videos">Videos</option>
                    </select>
                  </div>
                </div>

                <ScrollArea className="max-h-96">
                  {resources.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No resources found</p>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {resources.map((resource) => (
                        <div key={resource.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Book className="w-3 h-3" />{resource.views}
                            </div>
                          </div>
                          <h4 className="font-semibold mb-2">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                          <div className="flex items-center justify-between">
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                              >
                                View Resource <ChevronRight className="w-3 h-3" />
                              </a>
                            )}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>👍 {resource.helpful}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Roleplay Scenario Modal */}
      {showRoleplay && selectedRoleplay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowRoleplay(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                <Lightbulb className="w-6 h-6 inline mr-2" />
                {selectedRoleplay.title}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowRoleplay(false)}>
                <span className="text-2xl">&times;</span>
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Scenario Description */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Scenario</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedRoleplay.scenario}</p>
              </div>

              {/* Tips */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Key Tips
                </h3>
                <ul className="space-y-2">
                  {selectedRoleplay.tips && selectedRoleplay.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to Say */}
              {selectedRoleplay.whatToSay && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Book className="w-5 h-5 text-blue-500" />
                    What to Say
                  </h3>
                  <div className="space-y-2">
                    {selectedRoleplay.whatToSay.map((phrase: string, idx: number) => (
                      <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-gray-700 dark:text-gray-300 italic">"{phrase}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guidance */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Guidance
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedRoleplay.guidance}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowRoleplay(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowRoleplay(false)
                    // Navigate to chat tab for AI coaching on this scenario
                    setActiveTab('group')
                    setChatInput([
                      { role: 'system', content: `I want to practice the roleplay scenario: "${selectedRoleplay.title}". Scenario: ${selectedRoleplay.scenario}. Can you help me prepare?` }
                    ])
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Practice with AI Coach
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer dir={isRTL ? 'rtl' : 'ltr'} className="bg-white dark:bg-gray-900 border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>{t('welcomeDesc')} • {language === 'ar' ? 'رحلتك' : 'Your Path'}</p>
        </div>
      </footer>
    </div>
  )
}

function getMoodColor(mood: string): string {
  const colors: Record<string, string> = {
    'great': '#86efac',
    'good': '#3b82f6',
    'okay': '#fcd34d',
    'anxious': '#fb923c',
    'sad': '#ef4444',
    'stressed': '#8b5cf6'
  }
  return colors[mood] || '#e5e7eb'
}
