export const translations = {
  en: {
    // Navigation
    home: 'Home',
    steps: 'Steps',
    chat: 'Chat',
    clinical: 'Clinical',
    tools: 'Tools',
    track: 'Track',
    journal: 'Journal',
    profile: 'Profile',
    dashboard: 'Dashboard',
    resources: 'Resources',
    settings: 'Settings',
    onboarding: 'Onboarding',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    close: 'Close',

    // Auth
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',

    // Recovery
    recoveryDate: 'Recovery Date',
    sobrietyCounter: 'Sobriety Counter',
    daysSober: 'Days Sober',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    totalDays: 'Total Days',

    // Check-in
    dailyCheckIn: 'Daily Check-in',
    mood: 'Mood',
    energy: 'Energy',
    stress: 'Stress',
    triggers: 'Triggers',
    notes: 'Notes',
    submitCheckIn: 'Submit Check-in',

    // Steps
    step: 'Step',
    completed: 'Completed',
    markComplete: 'Mark as Complete',
    stepProgress: 'Step Progress',

    // Clinical
    thoughtRecord: 'Thought Record',
    functionalAnalysis: 'Functional Analysis',
    copingSkills: 'Coping Skills',
    relapsePlan: 'Relapse Plan',
    riskAssessment: 'Risk Assessment',
    clinicalSession: 'Clinical Session',

    // Tools
    breathingExercise: 'Breathing Exercise',
    groundingTechnique: 'Grounding Technique',
    copingStrategy: 'Coping Strategy',

    // Crisis
    crisisSupport: 'Crisis Support',
    getHelpNow: 'Get Help Now',
    emergencyContact: 'Emergency Contact',
    hotline: 'Hotline',

    // Community
    helpRequest: 'Help Request',
    helpRequests: 'Help Requests',
    sessions: 'Sessions',
    reviews: 'Reviews',
    notifications: 'Notifications',

    // Profile
    achievements: 'Achievements',
    stats: 'Statistics',
    personalInfo: 'Personal Information',
    preferences: 'Preferences',

    // Settings
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    dailyReminder: 'Daily Reminder',
    crisisContact: 'Crisis Contact',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    steps: 'الخطوات',
    chat: 'المحادثة',
    clinical: 'السريري',
    tools: 'الأدوات',
    track: 'التتبع',
    journal: 'المفكرة',
    profile: 'الملف الشخصي',
    dashboard: 'لوحة التحكم',
    resources: 'المصادر',
    settings: 'الإعدادات',
    onboarding: 'التسجيل',

    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    create: 'إنشاء',
    search: 'بحث',
    filter: 'تصفية',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجاح',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إرسال',
    close: 'إغلاق',

    // Auth
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    signUp: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم',

    // Recovery
    recoveryDate: 'تاريخ التعافي',
    sobrietyCounter: 'عداد التعافي',
    daysSober: 'أيام التعافي',
    currentStreak: 'السلسلة الحالية',
    longestStreak: 'أطول سلسلة',
    totalDays: 'إجمالي الأيام',

    // Check-in
    dailyCheckIn: 'التسجيل اليومي',
    mood: 'المزاج',
    energy: 'الطاقة',
    stress: 'التوتر',
    triggers: 'المحفزات',
    notes: 'ملاحظات',
    submitCheckIn: 'إرسال التسجيل',

    // Steps
    step: 'خطوة',
    completed: 'مكتمل',
    markComplete: 'تحديد كمكتمل',
    stepProgress: 'تقدم الخطوات',

    // Clinical
    thoughtRecord: 'سجل الأفكار',
    functionalAnalysis: 'التحليل الوظيفي',
    copingSkills: 'مهارات التأقلم',
    relapsePlan: 'خطة الانتكاس',
    riskAssessment: 'تقييم المخاطر',
    clinicalSession: 'الجلسة السريرية',

    // Tools
    breathingExercise: 'تمرين التنفس',
    groundingTechnique: 'تقنية التأسيس',
    copingStrategy: 'استراتيجية التأقلم',

    // Crisis
    crisisSupport: 'دعم الأزمات',
    getHelpNow: 'احصل على المساعدة الآن',
    emergencyContact: 'جهة اتصال الطوارئ',
    hotline: 'خط المساعدة',

    // Community
    helpRequest: 'طلب مساعدة',
    helpRequests: 'طلبات المساعدة',
    sessions: 'الجلسات',
    reviews: 'التقييمات',
    notifications: 'الإشعارات',

    // Profile
    achievements: 'الإنجازات',
    stats: 'الإحصائيات',
    personalInfo: 'المعلومات الشخصية',
    preferences: 'التفضيلات',

    // Settings
    language: 'اللغة',
    theme: 'المظهر',
    notifications: 'الإشعارات',
    dailyReminder: 'التذكير اليومي',
    crisisContact: 'جهة اتصال الأزمة',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.en[key] || key;
}
