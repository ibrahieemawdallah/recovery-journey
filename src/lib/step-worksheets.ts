/**
 * Worksheet definitions for the steps that need structured capture.
 *
 * Steps 1–3, 6, 7, 10, 11, 12 are narrative — they use reflections.
 * Steps 4, 5, 8, 9 produce lists, and a textarea is the wrong tool for a list.
 *
 * Each definition declares its columns, so the UI can render a real table and
 * the API can store rows without knowing their shape.
 */

export type WorksheetColumn = {
  /** Key inside the row object. */
  key: string
  /** Column heading, bilingual. */
  label: { en: string; ar: string }
  /** Placeholder / helper text shown in the empty cell. */
  hint?: { en: string; ar: string }
  /** 'text' | 'long' | 'select' | 'number' */
  type: 'text' | 'long' | 'select' | 'number'
  /** For type 'select'. */
  options?: { value: string; label: { en: string; ar: string } }[]
  /** Column width hint for the table layout. */
  width?: string
}

export type WorksheetDef = {
  kind: string
  stepNumber: number
  title: { en: string; ar: string }
  intro: { en: string; ar: string }
  columns: WorksheetColumn[]
  /** A blank row to start from. */
  blankRow: Record<string, string>
  /** Guidance shown under the table. */
  footnote?: { en: string; ar: string }
}

/* ------------------------------------------------------------------ *
 * Step 4 — the four-column moral inventory
 * ------------------------------------------------------------------ */
const INVENTORY: WorksheetDef = {
  kind: 'inventory',
  stepNumber: 4,
  title: { en: 'Four-column inventory', ar: 'الجرد الرباعي' },
  intro: {
    en: 'Column 1 is the resentment. Column 2 is who or what it is against. Column 3 is the honest answer to "what is my part in this?" — sometimes 90%, sometimes 5%. Column 4 is what it touched in you: pride, security, ambition, or your relationships.',
    ar: 'العمود الأول هو الاستياء. الثاني من أو ما هو ضده. الثالث هو الجواب الصادق على "ما نصيبي في هذا؟" — أحياناً 90% وأحياناً 5%. الرابع هو ما أثّره فيك: الكبرياء، الأمان، الطموح، أو علاقاتك.',
  },
  columns: [
    {
      key: 'resentment',
      label: { en: 'The resentment', ar: 'الاستياء' },
      hint: { en: 'What are you angry or resentful about?', ar: 'ما الذي تغضب منه أو تستاء منه؟' },
      type: 'text',
      width: '26%',
    },
    {
      key: 'against',
      label: { en: 'Against whom', ar: 'ضد من' },
      hint: { en: 'Person or thing', ar: 'شخص أو شيء' },
      type: 'text',
      width: '18%',
    },
    {
      key: 'myPart',
      label: { en: 'My part in it', ar: 'نصيبي فيه' },
      hint: { en: 'Be honest — it is rarely 0%', ar: 'كن صادقاً — نادراً ما يكون 0%' },
      type: 'long',
      width: '28%',
    },
    {
      key: 'affected',
      label: { en: 'What it affected', ar: 'ما أثّره فيّ' },
      type: 'select',
      width: '28%',
      options: [
        { value: 'pride', label: { en: 'Pride / self-esteem', ar: 'الكبرياء / تقدير الذات' } },
        { value: 'security', label: { en: 'Security / money', ar: 'الأمان / المال' } },
        { value: 'ambition', label: { en: 'Ambition / work', ar: 'الطموح / العمل' } },
        { value: 'relationships', label: { en: 'Relationships / love', ar: 'العلاقات / الحب' } },
        { value: 'fear', label: { en: 'Fear', ar: 'الخوف' } },
      ],
    },
  ],
  blankRow: { resentment: '', against: '', myPart: '', affected: '' },
  footnote: {
    en: 'Do not soften it and do not exaggerate it. Accuracy is the point — an inventory is a map, not a verdict.',
    ar: 'لا تلطّفه ولا تبالغ فيه. الدقة هي الهدف — الجرد خريطة، لا حكم.',
  },
}

/* ------------------------------------------------------------------ *
 * Step 4b — fears, listed separately
 * ------------------------------------------------------------------ */
const FEARS: WorksheetDef = {
  kind: 'fear',
  stepNumber: 4,
  title: { en: 'Fear inventory', ar: 'جرد المخاوف' },
  intro: {
    en: 'List your fears separately, then ask of each: what would I do differently if this fear were removed? That question is where the freedom is.',
    ar: 'اكتب مخاوفك منفصلة، ثم اسأل عن كل واحد: ماذا كنت سأفعل بشكل مختلف لو أُزيل هذا الخوف؟ ذلك السؤال هو مكان الحرية.',
  },
  columns: [
    {
      key: 'fear',
      label: { en: 'The fear', ar: 'الخوف' },
      hint: { en: 'I am afraid that…', ar: 'أنا خائف من أن…' },
      type: 'text',
      width: '34%',
    },
    {
      key: 'why',
      label: { en: 'Why I have it', ar: 'لماذا لديّ' },
      hint: { en: 'Where it came from', ar: 'من أين جاء' },
      type: 'long',
      width: '33%',
    },
    {
      key: 'without',
      label: { en: 'What I would do without it', ar: 'ما سأفعله بدونها' },
      hint: { en: 'If it were gone tomorrow', ar: 'لو اختفى غداً' },
      type: 'long',
      width: '33%',
    },
  ],
  blankRow: { fear: '', why: '', without: '' },
}

/* ------------------------------------------------------------------ *
 * Step 6/7 — character defects and their replacements
 * ------------------------------------------------------------------ */
const DEFECTS: WorksheetDef = {
  kind: 'defects',
  stepNumber: 6,
  title: { en: 'Defects and their replacements', ar: 'العيوب وبدائلها' },
  intro: {
    en: 'A defect is a pattern that reliably harms you or others — not a personality trait. For each, name what it has cost you, what it has protected you from, and the opposite practice that would replace it. Step 7 is asking for the removal; the replacement is how it actually happens.',
    ar: 'العيب نمط يضرك أو يضر الآخرين بشكل موثوق — وليس سمة شخصية. لكل عيب، سمِّ ما كلفك، وما حمّاك منه، والممارسة المعاكسة التي ستحل مكانه. الخطوة السابعة هي طلب الإزالة؛ والبديل هو كيف يحدث ذلك فعلاً.',
  },
  columns: [
    {
      key: 'defect',
      label: { en: 'The defect', ar: 'العيب' },
      hint: { en: 'e.g. control, dishonesty, self-pity', ar: 'مثل التحكم، عدم الصدق، الشفقة على الذات' },
      type: 'text',
      width: '22%',
    },
    {
      key: 'cost',
      label: { en: 'What it cost me', ar: 'ما كلفني' },
      type: 'long',
      width: '26%',
    },
    {
      key: 'protected',
      label: { en: 'What it protected me from', ar: 'ما حمّاني منه' },
      type: 'long',
      width: '26%',
    },
    {
      key: 'replacement',
      label: { en: 'The opposite practice', ar: 'الممارسة المعاكسة' },
      hint: { en: 'Self-pity → gratitude', ar: 'الشفقة → الامتنان' },
      type: 'text',
      width: '26%',
    },
  ],
  blankRow: { defect: '', cost: '', protected: '', replacement: '' },
  footnote: {
    en: 'If you are not willing to release one of these, say so here rather than pretending. Honest unwillingness is further along than a false yes.',
    ar: 'إن لم تكن مستعداً لإطلاق أحدها، قل ذلك هنا بدل التظاهر. الاستعداد غير الصادق أهون من "نعم" كاذبة.',
  },
}

/* ------------------------------------------------------------------ *
 * Step 8 — the amends list (people harmed)
 * ------------------------------------------------------------------ */
const AMENDS: WorksheetDef = {
  kind: 'amends',
  stepNumber: 8,
  title: { en: 'List of persons harmed', ar: 'قائمة من أذيناهم' },
  intro: {
    en: 'Everyone you have harmed, whether or not they know. Write what you did — not how you felt about it. Then mark your willingness honestly; "not willing" is a valid entry and belongs on the list.',
    ar: 'كل من أذيته، سواء علم أم لم يعلم. اكتب ما فعلته — لا ما شعرت به تجاهه. ثم حدد استعدادك بصدق؛ "غير مستعد" إجابة صحيحة ومكانها في القائمة.',
  },
  columns: [
    {
      key: 'person',
      label: { en: 'Person', ar: 'الشخص' },
      hint: { en: 'Name', ar: 'الاسم' },
      type: 'text',
      width: '20%',
    },
    {
      key: 'harm',
      label: { en: 'What I did', ar: 'ما فعلته' },
      hint: { en: 'The specific act, not the feeling', ar: 'الفعل المحدد، لا الشعور' },
      type: 'long',
      width: '38%',
    },
    {
      key: 'willingness',
      label: { en: 'Willingness', ar: 'الاستعداد' },
      type: 'select',
      width: '20%',
      options: [
        { value: 'willing', label: { en: 'Willing', ar: 'مستعد' } },
        { value: 'unsure', label: { en: 'Unsure', ar: 'غير متأكد' } },
        { value: 'unwilling', label: { en: 'Not willing', ar: 'غير مستعد' } },
      ],
    },
    {
      key: 'caution',
      label: { en: 'Caution', ar: 'تحذير' },
      type: 'select',
      width: '22%',
      options: [
        { value: 'none', label: { en: 'Safe to approach', ar: 'آمن للتواصل' } },
        { value: 'would_harm', label: { en: 'Contact would cause new harm', ar: 'التواصل سيسبب ضرراً جديداً' } },
      ],
    },
  ],
  blankRow: { person: '', harm: '', willingness: '', caution: '' },
  footnote: {
    en: 'Some people on this list should never be contacted — contacting them would cause fresh harm. They stay on the list; step 9 decides the method.',
    ar: 'بعض من في هذه القائمة لا يجب التواصل معهم أبداً — التواصل سيسبب ضرراً جديداً. يبقون في القائمة؛ والخطوة التاسعة تحدد الطريقة.',
  },
}

/* ------------------------------------------------------------------ *
 * Step 9 — the amends action log
 * ------------------------------------------------------------------ */
const AMENDS_ACTION: WorksheetDef = {
  kind: 'amends_action',
  stepNumber: 9,
  title: { en: 'Amends log', ar: 'سجل التعويضات' },
  intro: {
    en: 'For each amends you make: what you said, what you did to repair it, and how it landed. The amend should benefit the other person more than it benefits you, and it should not create new damage.',
    ar: 'لكل تعويض تقدّمه: ما قلته، وما فعلته للإصلاح، وكيف كان الأثر. يجب أن يفيد التعويض الطرف الآخر أكثر مما يفيدك، وألا يُنشئ ضرراً جديداً.',
  },
  columns: [
    {
      key: 'person',
      label: { en: 'Person', ar: 'الشخص' },
      type: 'text',
      width: '18%',
    },
    {
      key: 'what',
      label: { en: 'What I said / did', ar: 'ما قلته / فعلته' },
      type: 'long',
      width: '34%',
    },
    {
      key: 'status',
      label: { en: 'Status', ar: 'الحالة' },
      type: 'select',
      width: '20%',
      options: [
        { value: 'planned', label: { en: 'Planned', ar: 'مخطط' } },
        { value: 'done', label: { en: 'Done', ar: 'تم' } },
        { value: 'refused', label: { en: 'Refused by them', ar: 'رفضه الطرف الآخر' } },
        { value: 'written_only', label: { en: 'Written, not sent', ar: 'مكتوب، لم يُرسل' } },
      ],
    },
    {
      key: 'outcome',
      label: { en: 'How it landed', ar: 'كيف كان الأثر' },
      type: 'long',
      width: '28%',
    },
  ],
  blankRow: { person: '', what: '', status: '', outcome: '' },
  footnote: {
    en: 'Expect some people to refuse or respond with anger. That is theirs to decide and does not mean you did it wrong.',
    ar: 'توقع أن يرفض البعض أو يردوا بغضب. ذلك قرارهم ولا يعني أنك أخطأت.',
  },
}

export const WORKSHEETS: WorksheetDef[] = [
  INVENTORY,
  FEARS,
  DEFECTS,
  AMENDS,
  AMENDS_ACTION,
]

/** All worksheets attached to a given step. */
export function worksheetsForStep(stepNumber: number): WorksheetDef[] {
  return WORKSHEETS.filter((w) => w.stepNumber === stepNumber)
}
