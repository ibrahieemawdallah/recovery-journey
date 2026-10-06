/**
 * Real 12-step program content — steps 1–6.
 *
 * Each step carries four teaching layers, not just a slogan:
 *   whatItMeans      — the concept, in plain language
 *   howToWork        — the concrete actions that constitute working the step
 *   example          — a worked example so the user sees what it looks like
 *   completionSigns  — how you know the step is genuinely done
 *
 * Bilingual: every string exists in English and Arabic.
 */

export type StepContent = {
  number: number
  /** The traditional step wording. */
  title: { en: string; ar: string }
  /** One-word handle used in lists and the progress ring. */
  shortTitle: { en: string; ar: string }
  /** The concept, explained plainly. */
  whatItMeans: { en: string; ar: string }
  /** The concrete actions that constitute working this step. */
  howToWork: { en: string[]; ar: string[] }
  /** A worked example, so the abstract becomes visible. */
  example: { en: string; ar: string }
  /** Observable signs the step is genuinely complete — not just ticked. */
  completionSigns: { en: string[]; ar: string[] }
  /** Rough guidance, not a deadline. */
  typicalDuration: { en: string; ar: string }
}

export const STEPS_1_TO_6: StepContent[] = [
  {
    number: 1,
    title: {
      en: 'We admitted we were powerless over our addiction — that our lives had become unmanageable.',
      ar: 'اعترفنا بأننا عاجزون عن التحكم في إدماننا — وأن حياتنا أصبحت غير قابلة للإدارة.',
    },
    shortTitle: { en: 'Powerlessness', ar: 'العجز' },
    whatItMeans: {
      en: 'This step is not about being weak or worthless. It is about ending the argument with reality. Powerlessness means that once you take the first drink, pill, bet, or hit, you cannot reliably predict how much will follow — you have lost the ability to choose the stopping point. "Unmanageable" is the second half: it is the evidence, visible in your life, that the trying has not worked. Together they end the cycle of promising yourself "this time will be different." You are not admitting you are a bad person. You are admitting you have a condition that does not respond to willpower alone, which is exactly what makes a different approach possible.',
      ar: 'هذه الخطوة ليست اعترافاً بالضعف أو انعدام القيمة. هي إنهاء الجدل مع الواقع. العجز يعني أنك بمجرد أن تأخذ أول جرعة أو أول رهان، لا تستطيع أن تتوقع بثقة كم سيأتي بعدها — لقد فقدت القدرة على اختيار نقطة التوقف. أما "غير قابلة للإدارة" فهي النصف الثاني: الدليل الظاهر في حياتك على أن المحاولات لم تنجح. معاً، هما ما ينهي دورة الوعود لنفسك بأن "هذه المرة ستكون مختلفة". أنت لا تعترف بأنك شخص سيئ، بل تعترف بأن لديك حالة لا تستجيب للإرادة وحدها — وهذا بالضبط ما يجعل طريقاً مختلفاً ممكناً.',
    },
    howToWork: {
      en: [
        'Write down specific times you tried to control your use and could not — dates, amounts, what you promised yourself, what actually happened.',
        'List the concrete ways your life became unmanageable: money, work, health, relationships, legal trouble, promises broken.',
        'Notice the pattern of broken promises to yourself. Write how many times you said "never again" and meant it.',
        'Separate "I am powerless over the substance" from "I am powerless over my whole life" — the first is the step, the second is despair.',
        'Say it out loud to one person you trust, in your own words.',
      ],
      ar: [
        'اكتب مرات محددة حاولت فيها التحكم في استخدامك ولم تستطع — التواريخ، الكميات، ما وعدت به نفسك، وما حدث فعلاً.',
        'اكتب الطرق الملموسة التي أصبحت بها حياتك غير قابلة للإدارة: المال، العمل، الصحة، العلاقات، مشاكل قانونية، وعود مكسورة.',
        'لاحظ نمط الوعود المكسورة لنفسك. اكتب كم مرة قلت "لن أكررها أبداً" وكنت صادقاً.',
        'افصل بين "أنا عاجز عن المادة" و"أنا عاجز عن حياتي كلها" — الأولى هي الخطوة، والثانية هي اليأس.',
        'قلها بصوت مسموع لشخص تثق به، بكلماتك أنت.',
      ],
    },
    example: {
      en: 'Ahmed kept a list for two weeks. It had eleven entries, but three mattered. The night he drove his daughter home after drinking and told himself he was "fine." The morning he found empty bottles hidden in the garage that he did not remember buying. The time he promised his wife it was the last time, and believed it completely while saying it. Reading his own list, the pattern was not weakness — it was consistency. Every promise was sincere, and every promise failed the same way. That was his evidence of powerlessness. He had not failed at controlling it; the control had never existed.',
      ar: 'احتفظ أحمد بقائمة لمدة أسبوعين. كان فيها أحد عشر بنداً، لكن ثلاثة كانت هي المهمة. الليلة التي أوصل فيها ابنته إلى البيت بعد الشراب وهو يقول لنفسه إنه "بخير". الصباح الذي وجد فيه زجاجات فارغة مخبأة في الجراج ولا يتذكر أنه اشتراها. المرة التي وعد فيها زوجته أنها الأخيرة، وكان صادقاً تماماً وهو يقولها. وهو يقرأ قائمته، لم يكن النمط ضعفاً — بل كان ثباتاً. كل وعد كان صادقاً، وكل وعد فشل بالطريقة نفسها. كان ذلك دليله على العجز. لم يكن قد فشل في التحكم به؛ التحكم لم يكن موجوداً أصلاً.',
    },
    completionSigns: {
      en: [
        'You can describe specific incidents, not just a general feeling of being out of control.',
        'You have stopped negotiating with yourself about whether you are "really" an addict — the debate is over, and it ended in your favour.',
        'You feel relief rather than shame when you say it out loud. Admitting powerlessness is the first thing that has actually worked.',
        'You no longer believe that the next attempt will succeed through more effort or better intentions.',
      ],
      ar: [
        'تستطيع وصف حوادث محددة، لا مجرد شعور عام بفقدان السيطرة.',
        'توقفت عن الجدال مع نفسك حول ما إذا كنت "حقاً" مدمناً — الجدال انتهى، وانتهى لصالحك.',
        'تشعر بارتياح لا بالعار عندما تقولها بصوت مسموع. الاعتراف بالعجز هو أول شيء نجح فعلاً.',
        'لم تعد تؤمن بأن المحاولة القادمة ستنجح بمزيد من الجهد أو نوايا أفضل.',
      ],
    },
    typicalDuration: {
      en: 'Usually the first thing you do, and often revisited. Most people spend days to a few weeks writing the inventory, then return to it when denial resurfaces.',
      ar: 'عادةً أول ما تفعله، ويُعاد إليه كثيراً. يقضي معظم الناس أياماً إلى بضعة أسابيع في كتابة الجرد، ثم يعودون إليه حين يعود الإنكار.',
    },
  },
  {
    number: 2,
    title: {
      en: 'Came to believe that a Power greater than ourselves could restore us to sanity.',
      ar: 'بدأنا نؤمن بأن قوة أعظم منا قادرة على إعادة sanity إلينا.',
    },
    shortTitle: { en: 'Hope', ar: 'الأمل' },
    whatItMeans: {
      en: 'Step one removed the old solution. Step two replaces it with a possibility. "Came to believe" is deliberately gradual — it is not "believed instantly," and it does not require certainty. It only requires openness. "A Power greater than ourselves" is intentionally undefined: for some it is God, for others it is the group, nature, the collective experience of people who recovered before them, or simply the fact that recovery happens at all. "Sanity" here means something specific — not intelligence, but the ability to see reality clearly and act on it, which addiction specifically destroys. The step asks: can you accept that something outside your own effort might help?',
      ar: 'الخطوة الأولى أزالت الحل القديم. الخطوة الثانية تستبدله باحتمال. عبارة "بدأنا نؤمن" تدريجية عن قصد — فهي ليست "آمنا فوراً"، ولا تشترط اليقين، بل تشترط الانفتاح فقط. و"قوة أعظم منا" غير محددة عن قصد: فهي عند البعض الله، وعند آخرين الجماعة، أو الطبيعة، أو الخبرة الجماعية لمن تعافوا قبلهم، أو ببساطة حقيقة أن التعافي يحدث أصلاً. و"سلامة العقل" هنا تعني شيئاً محدداً — ليست الذكاء، بل القدرة على رؤية الواقع بوضوح والتصرف بناءً عليه، وهي بالضبط ما يدمره الإدمان. السؤال: هل يمكنك تقبّل أن شيئاً خارج جهدك الخاص قد يساعد؟',
    },
    howToWork: {
      en: [
        'Write down what you currently believe about a higher power — including "I don\'t believe in anything." Honesty comes before change.',
        'Separate the question of belief from the question of religion. You are not being asked to join anything.',
        'Find one person who has recovered and ask what changed for them. Their story is evidence the step is asking you to weigh.',
        'Define your own "power greater than yourself" in one sentence. It can be as modest as "the group" or "something I don\'t understand yet."',
        'Notice the difference between hope and certainty. Write one sentence of hope you can actually say without lying.',
      ],
      ar: [
        'اكتب ما تؤمن به حالياً بشأن قوة أعظم — بما في ذلك "أنا لا أؤمن بأي شيء". الصدق يأتي قبل التغيير.',
        'افصل بين سؤال الإيمان وسؤال الدين. لا يُطلب منك الانضمام إلى شيء.',
        'ابحث عن شخص واحد تعافى واسأله ما الذي تغير عنده. قصته دليل تطلب منك الخطوة أن تزنه.',
        'عرّف "قوتك الأعظم" بنفسك في جملة واحدة. يمكن أن تكون متواضعة مثل "الجماعة" أو "شيء لا أفهمه بعد".',
        'لاحظ الفرق بين الأمل واليقين. اكتب جملة أمل واحدة تستطيع قولها دون أن تكذب.',
      ],
    },
    example: {
      en: 'Mona could not say the word "God" without anger — her father had used religion as a weapon. So she did not say it. She wrote instead: "My higher power is the fact that other people have done this. If it worked for them, the door is not closed." That was enough. She did not have to believe in a deity to accept that recovery was real and that she was not the one exception to it. Six months later she described that sentence as the moment she stopped being alone with the problem.',
      ar: 'لم تستطع منى أن تنطق كلمة "الله" دون غضب — فقد استخدم والدها الدين كسلاح. فلم تنطقها. كتبت بدلاً منها: "قوتي الأعظم هي حقيقة أن آخرين فعلوا هذا. إن نجح معهم، فالباب ليس مغلقاً." كان ذلك كافياً. لم يكن عليها أن تؤمن بإله لتتقبل أن التعافي حقيقي وأنها ليست الاستثناء الوحيد. بعد ستة أشهر وصفت تلك الجملة بأنها اللحظة التي توقفت فيها عن أن تكون وحدها مع المشكلة.',
    },
    completionSigns: {
      en: [
        'You can state what your higher power is, in your own words, without embarrassment.',
        'You have moved from "there is no way out" to "there might be a way out, and I am willing to find out."',
        'You are willing to take actions whose outcome you cannot control — this is the practical test of the step.',
        'You can hold hope without needing proof. You no longer demand a guarantee before you begin.',
      ],
      ar: [
        'تستطيع أن تذكر ما هي قوتك الأعظم، بكلماتك، دون إحراج.',
        'انتقلت من "لا يوجد مخرج" إلى "قد يوجد مخرج، وأنا مستعد أن أكتشف".',
        'أنت مستعد لاتخاذ خطوات لا تتحكم في نتائجها — وهذا هو الاختبار العملي للخطوة.',
        'تستطيع أن تحمل الأمل دون أن تطلب دليلاً. لم تعد تطالب بضمان قبل أن تبدأ.',
      ],
    },
    typicalDuration: {
      en: 'Often grows slowly alongside step three. Some people settle it in days; for others it is the work of months.',
      ar: 'غالباً ينمو ببطء مع الخطوة الثالثة. البعض يحسمها في أيام، وآخرون يستغرقون أشهراً.',
    },
  },
  {
    number: 3,
    title: {
      en: 'Made a decision to turn our will and our lives over to the care of God as we understood Him.',
      ar: 'اتخذنا قراراً بتسليم إرادتنا وحياتنا لعناية الله كما فهمناه.',
    },
    shortTitle: { en: 'Surrender', ar: 'التسليم' },
    whatItMeans: {
      en: 'Step two is belief; step three is a decision — and only a decision. You are not required to feel surrendered, or to succeed at it. You are required to choose. "Will and our lives" covers two things: your intentions (what you want and decide) and your circumstances (what happens to you). Turning both over means giving up the exhausting project of controlling everything. It does not mean passivity — you still act, work, and make choices. It means acting without the demand that reality conform to your plan. The relief in this step is enormous: the thing you have been failing to control was never yours to control.',
      ar: 'الخطوة الثانية إيمان، والخطوة الثالثة قرار — مجرد قرار. لا يُطلب منك أن تشعر بالتسليم، ولا أن تنجح فيه، بل يُطلب منك أن تختار. و"إرادتنا وحياتنا" تغطي أمرين: نواياك (ما تريده وتقرره)، وظروفك (ما يحدث لك). تسليم الاثنين يعني التخلي عن المشروع المُنهك للتحكم في كل شيء. وهي لا تعني السلبية — فأنت لا تزال تتحرك وتعمل وتقرر، لكن دون أن تشترط أن يطاوع الواقع خطتك. الراحة في هذه الخطوة هائلة: فالشيء الذي كنت تفشل في التحكم به لم يكن ملكك لتحكم فيه أصلاً.',
    },
    howToWork: {
      en: [
        'Write one sentence, in your own words, of what you are turning over. Keep it concrete: "I turn over whether I ever drink again to something bigger than my willpower."',
        'Identify the specific thing you are still gripping hardest — a relationship, an outcome, a person\'s opinion — and name it.',
        'Say the sentence out loud, once, at the start of your day. The step is a decision you renew, not one you complete.',
        'Distinguish "turning it over" from "giving up." Write down the actions you will still take this week.',
        'When you catch yourself trying to control an outcome, repeat the sentence. Note how often it comes up.',
      ],
      ar: [
        'اكتب جملة واحدة، بكلماتك، عمّا تسلّمه. اجعلها ملموسة: "أسلّم أمر ما إذا كنت سأشرب مرة أخرى لشيء أكبر من إرادتي."',
        'حدد الشيء المحدد الذي لا تزال تتشبث به بأقصى قوة — علاقة، نتيجة، رأي شخص — وسمّه.',
        'قل الجملة بصوت مسموع مرة واحدة في بداية يومك. الخطوة قرار تجدده، لا مهمة تكملها.',
        'فرّق بين "التسليم" و"الاستسلام". اكتب الأفعال التي ستقوم بها هذا الأسبوع.',
        'حين تجد نفسك تحاول التحكم في نتيجة، أعد الجملة. لاحظ كم مرة تتكرر.',
      ],
    },
    example: {
      en: 'Omar had been trying to stay sober by force of will for nine years. Each attempt worked for a while, then collapsed under a bad day. Step three did not add effort — it removed a job. He wrote: "I am not in charge of whether I stay sober. I am in charge of today\'s actions. The outcome is not mine." It sounded like a technicality. It was not. The energy he had been spending on gripping the outcome became available for the actions — meetings, calls, honesty. He described the change as "putting down a weight I had been told was a muscle I needed to build."',
      ar: 'كان عمر يحاول أن يبقى ممتنعاً بقوة الإرادة لتسع سنوات. كل محاولة نجحت لفترة ثم انهارت أمام يوم سيئ. الخطوة الثالثة لم تُضف جهداً — بل أزالت وظيفة. كتب: "أنا لست المسؤول عن ما إذا سأبقى ممتنعاً. أنا مسؤول عن أفعال اليوم. النتيجة ليست ملكي." بدا الأمر كتفصيل لفظي. لم يكن كذلك. الطاقة التي كان ينفقها في التشبث بالنتيجة صارت متاحة للأفعال — الاجتماعات، المكالمات، الصدق. ووصف التغيير بأنه "إنزال ثقل قيل لي إنه عضلة يجب أن أبنيها".',
    },
    completionSigns: {
      en: [
        'You have made the decision in writing, in your own words — not recited someone else\'s phrasing.',
        'You still take action, but you no longer require the outcome to obey you.',
        'You notice the impulse to control, and you can name it as it happens.',
        'Bad days no longer feel like proof that you have failed — they are just days.',
      ],
      ar: [
        'اتخذت القرار كتابةً، بكلماتك — لا بترديد صيغة شخص آخر.',
        'لا تزال تتحرك، لكنك لم تعد تشترط أن تطيعك النتيجة.',
        'تلاحظ الدافع للتحكم، وتستطيع تسميته وقت حدوثه.',
        'الأيام السيئة لم تعد تبدو دليلاً على فشلك — هي مجرد أيام.',
      ],
    },
    typicalDuration: {
      en: 'A single decision, renewed daily. Most people revisit it whenever control resurfaces.',
      ar: 'قرار واحد، يُجدَّد يومياً. يعود إليه معظم الناس كلما عاد التحكم للظهور.',
    },
  },
  {
    number: 4,
    title: {
      en: 'Made a searching and fearless moral inventory of ourselves.',
      ar: 'أجرينا جرداً أخلاقياً دقيقاً وشجاعاً لأنفسنا.',
    },
    shortTitle: { en: 'Inventory', ar: 'الجرد' },
    whatItMeans: {
      en: 'This is the step people fear most, and it is not what it sounds like. It is not self-punishment, and it is not a list of everything wrong with you. It is an honest accounting — the word is borrowed from business: what is actually there, assets and liabilities. The target is your own conduct: your resentments, your fears, your dishonesty, the ways you have hurt people, and the patterns underneath them. Crucially, it looks for your part in things — not to blame you, but because your own conduct is the only part you can change. "Searching" means thorough. "Fearless" means you write it even where you would rather not look.',
      ar: 'هذه أكثر خطوة يخافها الناس، وهي ليست كما تبدو. ليست عقاباً للذات، ولا قائمة بكل ما هو معطوب فيك. هي محاسبة صادقة — والكلمة مستعارة من التجارة: ما هو موجود فعلاً، من أصول وخصوم. والهدف هو سلوكك أنت: استياؤك، مخاوفك، عدم صدقك، الطرق التي أذيت بها الناس، والأنماط التي تحتها. والأهم أنها تبحث عن نصيبك في الأمور — لا لتلومك، بل لأن سلوكك هو الجزء الوحيد القابل للتغيير. و"دقيق" تعني شاملاً، و"شجاع" تعني أن تكتبه حتى حيث لا تحب أن تنظر.',
    },
    howToWork: {
      en: [
        'Make four columns on paper: resentment, the person or thing, my part in it, and what it affected in me (fear, pride, security, pride, sex relations).',
        'List your resentments first — everyone and everything you still carry anger toward, going back as far as you can remember.',
        'For each one, find your part honestly. Sometimes it is 90%, sometimes it is 5%. Write the actual number you believe.',
        'List your fears separately, then ask of each: what would I do differently if this fear were removed?',
        'List the people you have harmed and how. Do not soften it and do not exaggerate it — accuracy is the point.',
        'Write your assets too. An inventory with only liabilities is not an inventory.',
      ],
      ar: [
        'اصنع أربعة أعمدة على الورق: الاستياء، الشخص أو الشيء، نصيبي فيه، وما أثّره فيّ (خوف، كبرياء، أمان، علاقات).',
        'ابدأ بقائمة استيائك — كل شخص وكل شيء لا تزال تحمل تجاهه غضباً، إلى أبعد ما تذكر.',
        'لكل واحد، ابحث عن نصيبك بصدق. أحياناً يكون 90%، وأحياناً 5%. اكتب النسبة التي تؤمن بها فعلاً.',
        'اكتب مخاوفك منفصلة، ثم اسأل عن كل واحد: ماذا كنت سأفعل بشكل مختلف لو أُزيل هذا الخوف؟',
        'اكتب من أذيتهم وكيف. لا تلطّف الأمر ولا تبالغ فيه — الدقة هي الهدف.',
        'اكتب أصولك أيضاً. الجرد الذي فيه خصوم فقط ليس جرداً.',
      ],
    },
    example: {
      en: 'Yousef started his inventory with one name: his brother, who had lent him money and then stopped. He wrote "he humiliated me" and felt finished. But the fourth column asked what it touched in him — and the honest answer was pride, plus a fear that he was seen as a failure. Then he wrote his part. His brother had not humiliated him; his brother had said no. The humiliation was his own shame wearing someone else\'s face. That single correction changed three other entries. By the end, the list was not a verdict — it was a map of where he had been lying to himself.',
      ar: 'بدأ يوسف جرده باسم واحد: أخوه، الذي أقرضه مالاً ثم توقف. كتب "أذلني" وشعر أنه انتهى. لكن العمود الرابع سأل عمّا أثّره فيه — وكانت الإجابة الصادقة: الكبرياء، وخوف من أن يُرى فاشلاً. ثم كتب نصيبه. لم يذله أخوه؛ أخوه قال لا فقط. الإذلال كان عاره هو، مرتدياً وجه شخص آخر. هذا التصحيح الواحد غيّر ثلاثة بنود أخرى. وفي النهاية لم تكن القائمة حكماً — بل خريطة لأماكن كذبه على نفسه.',
    },
    completionSigns: {
      en: [
        'It is written down, not carried in your head. The step says "made," which means on paper.',
        'You have found your own part in things you were certain were entirely someone else\'s fault.',
        'You have listed assets as well as liabilities, and you recognize the list is honest rather than brutal.',
        'You feel lighter, not worse. If it only produced shame, the inventory is incomplete — shame is not the goal, accuracy is.',
        'You can read an entry about someone who hurt you without the heat coming back at full strength.',
      ],
      ar: [
        'الأمر مكتوب، لا محمول في رأسك. الخطوة تقول "أجرينا" أي على ورق.',
        'وجدت نصيبك في أمور كنت متأكداً أنها خطأ الآخر بالكامل.',
        'كتبت أصولك كما كتبت خصومك، وتدرك أن القائمة صادقة لا قاسية.',
        'تشعر بخفة لا بسوء. لو أنتجت عاراً فقط فالجرد ناقص — العار ليس الهدف، الدقة هي الهدف.',
        'تستطيع قراءة بند عن شخص آذاك دون أن يعود الألم بكامل قوته.',
      ],
    },
    typicalDuration: {
      en: 'Commonly one to several weeks of writing. Rushing it defeats the purpose; the writing is where the insight happens.',
      ar: 'عادةً من أسبوع إلى عدة أسابيع من الكتابة. الاستعجال يُفقد الغرض؛ فالكتابة هي مكان الاستبصار.',
    },
  },
  {
    number: 5,
    title: {
      en: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.',
      ar: 'اعترفنا لله، ولأنفسنا، ولإنسان آخر بالطبيعة الدقيقة لأخطائنا.',
    },
    shortTitle: { en: 'Confession', ar: 'الاعتراف' },
    whatItMeans: {
      en: 'Step four put the inventory on paper. Step five takes it out of the dark. The key phrase is "another human being" — this is what separates the step from private self-reflection. Secrets derive their power from being unspoken; once spoken to another person, they become facts rather than weights. "The exact nature" matters: not the sanitized version, and not a performance of how terrible you are either. Three audiences, three functions — to your higher power as an act of honesty, to yourself as an act of ownership, and to another person as an act of trust. The person you tell is not there to judge you, forgive you, or fix you. They are there to hear it.',
      ar: 'الخطوة الرابعة وضعت الجرد على ورق، والخطوة الخامسة تخرجه من الظلام. والعبارة المفتاحية "إنسان آخر" — وهي ما يفصل الخطوة عن التأمل الذاتي الخاص. فالأسرار تستمد قوتها من كونها غير منطوقة؛ وبمجرد أن تُقال لشخص آخر تصبح حقائق لا أثقالاً. و"الطبيعة الدقيقة" مهمة: ليست النسخة المُنقّاة، ولا استعراضاً لمدى سوئك. ثلاثة جماهير بثلاث وظائف — لقوتك الأعظم كفعل صدق، ولنفسك كفعل تملّك، ولشخص آخر كفعل ثقة. والشخص الذي تخبره ليس هناك ليحكم عليك أو يغفر لك أو يصلحك، بل ليسمعك.',
    },
    howToWork: {
      en: [
        'Choose the person carefully: someone who will keep confidence, who has some experience of this, and who will not use it against you.',
        'Read your step-four inventory aloud, in order, without editing. The point is to say it, not to explain it well.',
        'Do not soften and do not dramatize. Read the column as written.',
        'Afterwards, let them respond however they respond. Do not require absolution; you are not asking for it.',
        'Write down what it felt like before, during, and after. Most people describe the after as physically lighter.',
        'If you have no one, this is a legitimate reason to seek out a sponsor or a counsellor — do not skip the step instead.',
      ],
      ar: [
        'اختر الشخص بعناية: شخص يحفظ السر، ولديه خبرة بهذا، ولن يستخدمه ضدك.',
        'اقرأ جرد الخطوة الرابعة بصوت مسموع، بالترتيب، دون تعديل. الهدف أن تقوله، لا أن تشرحه جيداً.',
        'لا تلطّف ولا تبالغ. اقرأ العمود كما هو مكتوب.',
        'بعد ذلك، اتركه يرد كما يرد. لا تشترط الغفران؛ فأنت لا تطلبه.',
        'اكتب كيف شعرت قبل، وأثناء، وبعد. معظم الناس يصفون "بعد" بأنه أخف جسدياً.',
        'إن لم يكن لديك أحد، فهذا سبب مشروع للبحث عن راعٍ أو مستشار — لا أن تتخطى الخطوة.',
      ],
    },
    example: {
      en: 'Layla had carried one secret for fourteen years. She had rehearsed telling it so many times that the words had lost all meaning. When she finally read it to her sponsor, she got halfway through and stopped, certain the response would be disgust. Her sponsor said nothing for a moment, then asked, "Is that all?" Not dismissively — genuinely. Layla described the moment as anticlimactic in the best way. The thing that had organised fourteen years of her life was, out loud, about ninety seconds long. It had been enormous only while it was unsaid.',
      ar: 'حملت ليلى سراً واحداً لأربعة عشر عاماً. كانت قد تدربت على قوله مرات كثيرة حتى فقدت الكلمات معناها. وحين قرأته أخيراً على راعيها، وصلت إلى المنتصف وتوقفت، واثقة أن الرد سيكون اشمئزازاً. صمت راعيها لحظة ثم سأل: "هل هذا كل شيء؟" — لا باستهانة، بل بصدق. ووصفت ليلى اللحظة بأنها مخيبة للآمال على أفضل وجه. الشيء الذي نظّم أربعة عشر عاماً من حياتها استغرق بصوت مسموع نحو تسعين ثانية. لم يكن هائلاً إلا لأنه كان مكتوماً.',
    },
    completionSigns: {
      en: [
        'You have said it out loud to another person, not just written it.',
        'The secret has stopped feeling like a separate entity you carry, and become information about your past.',
        'You did not edit the inventory to manage the listener\'s reaction.',
        'You can think about the content without the familiar tightening in your chest.',
      ],
      ar: [
        'قلته بصوت مسموع لشخص آخر، لا كتبته فقط.',
        'توقف السر عن كونه كياناً منفصلاً تحمله، وأصبح مجرد معلومة عن ماضيك.',
        'لم تعدّل الجرد لتدير رد فعل السامع.',
        'تستطيع التفكير في المحتوى دون ذلك الانقباض المعتاد في صدرك.',
      ],
    },
    typicalDuration: {
      en: 'Usually one sitting, sometimes two. The preparation can take longer than the telling.',
      ar: 'عادةً جلسة واحدة، وأحياناً اثنتان. التحضير قد يستغرق وقتاً أطول من القول نفسه.',
    },
  },
  {
    number: 6,
    title: {
      en: 'Were entirely ready to have God remove all these defects of character.',
      ar: 'صرنا مستعدين تماماً لأن يزيل الله كل عيوب الشخصية هذه.',
    },
    shortTitle: { en: 'Readiness', ar: 'الاستعداد' },
    whatItMeans: {
      en: 'This step is about willingness, not action. Nothing is removed yet — you are only becoming ready. The word "entirely" is the hard part, because most of us want to keep one or two defects. The cleverness that got you through hard times. The anger that feels like protection. The step asks you to notice those and admit you would rather keep them. It also asks you to distinguish a character defect from a personality trait: a defect is a pattern that reliably harms you or others. Being introverted is not a defect. Using silence to punish someone is. The output of this step is a list of what you are ready to release, and honest notes on what you are not.',
      ar: 'هذه الخطوة عن الاستعداد، لا الفعل. لم يُزل شيء بعد — أنت تصبح مستعداً فقط. وكلمة "تماماً" هي الجزء الصعب، لأن معظمنا يريد الاحتفاظ بعيب أو اثنين. الذكاء الذي أخرجك من أوقات صعبة. الغضب الذي يبدو كحماية. الخطوة تطلب منك أن تلاحظ هؤلاء وتعترف بأنك تفضّل الاحتفاظ بهم. كما تطلب أن تفرّق بين عيب الشخصية وسمة الشخصية: العيب نمط يضرك أو يضر الآخرين بشكل موثوق. الانطواء ليس عيباً. أما استخدام الصمت لمعاقبة شخص فهو عيب. ومخرَج هذه الخطوة قائمة بما أنت مستعد لإطلاقه، وملاحظات صادقة بما لست مستعداً له.',
    },
    howToWork: {
      en: [
        'Take the character defects you identified in step four and write them as a plain list of patterns, not as verdicts on yourself.',
        'For each one, write what it has cost you and what it has protected you from. Both are true.',
        'Find the one or two you are secretly unwilling to release. Name them explicitly — pretending willingness you do not have stalls the step.',
        'Separate defects from traits. Cross out anything that is merely a preference, a limitation, or a difference.',
        'Write one sentence of willingness per item: "I am willing to have this removed, even though I do not know what replaces it."',
      ],
      ar: [
        'خذ عيوب الشخصية التي حددتها في الخطوة الرابعة واكتبها كقائمة أنماط واضحة، لا كأحكام عليك.',
        'لكل واحد، اكتب ما كلفك وما حمّاك منه. الاثنان صحيحان.',
        'اعثر على العيب أو العيبين الذين لا ترغب سراً في إطلاقهما. سمّهم بوضوح — فالتظاهر باستعداد غير موجود يُعطّل الخطوة.',
        'افصل العيوب عن السمات. اشطب أي شيء هو مجرد تفضيل أو قيد أو اختلاف.',
        'اكتب جملة استعداد لكل بند: "أنا مستعد لأن يُزال هذا، رغم أنني لا أعرف ما سيحل مكانه."',
      ],
    },
    example: {
      en: 'Karim had four defects on his list and was ready to release three. The fourth was control — the need to run every situation. He wrote honestly: "I am not ready. Control is how I survived a childhood where nothing was predictable." That honesty was the step, not a failure of it. Six weeks later he revisited the line and added: "I am now willing to consider it. I am not there yet." His sponsor told him that sentence was worth more than a false yes, because it was the first time he had told the truth about control rather than performing readiness.',
      ar: 'كان في قائمة كريم أربعة عيوب وكان مستعداً لإطلاق ثلاثة. الرابع كان التحكم — الحاجة لإدارة كل موقف. كتب بصدق: "لست مستعداً. التحكم هو كيف نجوت من طفولة لم يكن فيها شيء متوقع." كان هذا الصدق هو الخطوة، لا فشلاً فيها. بعد ستة أسابيع عاد إلى السطر وأضاف: "أنا الآن مستعد للنظر فيه. لم أصل بعد." أخبره راعيه أن تلك الجملة تساوي أكثر من "نعم" كاذبة، لأنها أول مرة يقول فيها الحقيقة عن التحكم بدل أن يستعرض استعداداً.',
    },
    completionSigns: {
      en: [
        'You have a written list of the patterns you are ready to release.',
        'You have named, out loud or in writing, the ones you are not ready to release — and you are not pretending otherwise.',
        'You can tell the difference between a character defect and a personality trait in your own list.',
        'You feel willingness rather than obligation. If it feels like being forced, the step is not finished.',
      ],
      ar: [
        'لديك قائمة مكتوبة بالأنماط التي أنت مستعد لإطلاقها.',
        'سمّيت، بصوت مسموع أو كتابةً، ما لست مستعداً لإطلاقه — ولم تتظاهر بغير ذلك.',
        'تستطيع التمييز بين عيب الشخصية وسمة الشخصية في قائمتك.',
        'تشعر باستعداد لا بإلزام. إن بدا الأمر إجباراً، فالخطوة لم تنته.',
      ],
    },
    typicalDuration: {
      en: 'Usually short — days, sometimes a single sitting. It is a hinge between the inventory and the asking.',
      ar: 'عادةً قصيرة — أيام، وأحياناً جلسة واحدة. وهي مفصل بين الجرد والطلب.',
    },
  },
]
