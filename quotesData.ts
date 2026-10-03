import { Language, Quote, QuoteCategory } from '../types';

export const CATEGORIES: { id: Exclude<QuoteCategory, 'all'>; icon: string }[] = [
  { id: 'devotional', icon: 'Sun' },
  { id: 'love', icon: 'Heart' },
  { id: 'sad', icon: 'CloudRain' },
  { id: 'festivals', icon: 'Sparkles' },
  { id: 'attitude', icon: 'Crown' },
  { id: 'friendship', icon: 'Users' },
  { id: 'calm', icon: 'Feather' },
  { id: 'motivation', icon: 'Flame' },
  { id: 'healing', icon: 'HeartHandshake' },
  { id: 'success', icon: 'Compass' },
  { id: 'gratitude', icon: 'Sun' },
  { id: 'wisdom', icon: 'BookOpen' },
  { id: 'courage', icon: 'Shield' },
  { id: 'evening', icon: 'Moon' },
];

export const INITIAL_QUOTES: Quote[] = [
  // 1. CALM & PEACE
  {
    id: 'calm-1',
    text: 'Smile, breathe and go slowly. There is nowhere to arrive except the present moment.',
    author: 'Thich Nhat Hanh',
    category: 'calm',
    tags: ['breath', 'mindfulness', 'presence'],
    moodRecommendation: ['anxious', 'overwhelmed', 'peaceful'],
    context: 'From Peace Is Every Step',
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'मुस्कुराओ, गहरी सांस लो और धीमे चलो। वर्तमान क्षण के अलावा कहीं और पहुंचने की आवश्यकता नहीं है।',
        author: 'थिच नहत हान',
        context: 'पीस इज़ एवरी स्टेप से',
      },
      bn: {
        text: 'একটু হাসুন, গভীর শ্বাস নিন এবং ধীরে চলুন। বর্তমান মুহূর্ত ছাড়া পৌঁছানোর মতো আর কোনো স্থান নেই।',
        author: 'থিচ নাট হান',
      },
      es: {
        text: 'Sonríe, respira y ve despacio. No hay ningún lugar al que llegar excepto el momento presente.',
        author: 'Thich Nhat Hanh',
      },
      fr: {
        text: 'Souris, respire et marche lentement. Il n’y a nulle part où aller sinon dans l’instant présent.',
        author: 'Thích Nhất Hạnh',
      },
      de: {
        text: 'Lächle, atme und gehe langsam. Es gibt keinen Ort, an dem man ankommen muss, außer im gegenwärtigen Moment.',
        author: 'Thich Nhat Hanh',
      },
    },
  },
  {
    id: 'calm-hi-1',
    text: 'धीरे-धीरे रे मना, धीरे सब कुछ होय। माली सींचे सौ घड़ा, ऋतु आए फल होय॥',
    author: 'कबीर दास (Kabir Das)',
    category: 'calm',
    tags: ['sabr', 'patience', 'timing', 'peace'],
    moodRecommendation: ['anxious', 'overwhelmed', 'reflective'],
    context: 'कबीर दोहावली',
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Slowly, oh mind, everything happens in its own time. The gardener pours a hundred pots of water, but the tree bears fruit only in season.',
        author: 'Kabir Das',
        context: 'Kabir Dohavali',
      },
      bn: {
        text: 'ধৈর্য ধরো মন, সবকিছু নিজের নিয়মেই ঘটে। মালী শত ঘড়া জল ঢাললেও ফল ধরে কেবল ঋতু আসলেই।',
        author: 'কবীর দাস',
      },
      es: {
        text: 'Con calma, oh mente, todo llega a su debido tiempo. El jardinero puede regar cien vasijas, pero el fruto solo brota en su estación.',
        author: 'Kabir Das',
      },
      fr: {
        text: 'Doucement, ô mon esprit, chaque chose a son temps. Le jardinier verse cent cruches d’eau, mais le fruit n’apparaît qu’à sa saison.',
        author: 'Kabir Das',
      },
      de: {
        text: 'Langsam, o Geist, alles geschieht zu seiner Zeit. Der Gärtner mag hundert Krüge gießen, doch die Frucht wächst erst in ihrer Saison.',
        author: 'Kabir Das',
      },
    },
  },
  {
    id: 'calm-bn-1',
    text: 'নদীর এপার কহে ছাড়িয়া নিশ্বাস, ওপারেতে সর্বসুখ আমার বিশ্বাস। নিজের ভেতরের শান্তিতেই আসল আনন্দ নিহিত।',
    author: 'রবীন্দ্রনাথ ঠাকুর (Rabindranath Tagore)',
    category: 'calm',
    tags: ['shanti', 'contentment', 'inner-peace'],
    moodRecommendation: ['reflective', 'peaceful', 'calm'],
    originalLanguage: 'bn',
    translations: {
      en: {
        text: 'The riverbank sighs believing all happiness lies on the far shore. True peace is found only in the serenity within yourself.',
        author: 'Rabindranath Tagore',
      },
      hi: {
        text: 'नदी का यह किनारा सोचता है कि सारा सुख उस पार है। परंतु सच्चा सुख और शांति केवल अपने भीतर के ठहराव में है।',
        author: 'रवींद्रनाथ टैगोर',
      },
      es: {
        text: 'La orilla del río suspira creyendo que la dicha reside en la otra ribera. La verdadera paz habita en la serenidad interior.',
        author: 'Rabindranath Tagore',
      },
      fr: {
        text: 'La rive du fleuve soupire, croyant que tout le bonheur est sur l’autre rive. La vraie paix réside dans la quiétude intérieure.',
        author: 'Rabindranath Tagore',
      },
      de: {
        text: 'Das Flussufer seufzt im Glauben, alles Glück liege drüben. Wahrer Frieden liegt allein in der inneren Stille.',
        author: 'Rabindranath Tagore',
      },
    },
  },
  {
    id: 'calm-2',
    text: 'Silence is not the absence of sound, but the presence of stillness where you can hear yourself think.',
    author: 'Pico Iyer',
    category: 'calm',
    tags: ['silence', 'stillness', 'clarity'],
    moodRecommendation: ['overwhelmed', 'reflective'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'मौन आवाज़ की कमी नहीं है, बल्कि उस ठहराव की उपस्थिति है जहाँ आप अपनी आत्मा की आवाज़ सुन सकते हैं।',
        author: 'पिको अय्यर',
      },
      bn: {
        text: 'নীরবতা শব্দের অনুপস্থিতি নয়, বরং এমন এক স্থিরতা যেখানে আপনি নিজের চিন্তার গভীরতা শুনতে পান।',
        author: 'পিকো আইয়ার',
      },
      es: {
        text: 'El silencio no es la ausencia de sonido, sino la presencia de quietud donde puedes escucharte pensar.',
        author: 'Pico Iyer',
      },
      fr: {
        text: 'Le silence n’est pas l’absence de son, mais la présence d’une quiétude où l’on s’entend penser.',
        author: 'Pico Iyer',
      },
      de: {
        text: 'Stille ist nicht die Abwesenheit von Lauten, sondern die Gegenwart von Ruhe, in der man sich selbst denken hört.',
        author: 'Pico Iyer',
      },
    },
  },

  // 2. MOTIVATION
  {
    id: 'mot-1',
    text: 'The secret of getting ahead is getting started. Break your complex overwhelming tasks into small manageable tasks.',
    author: 'Mark Twain',
    category: 'motivation',
    tags: ['action', 'start', 'momentum'],
    moodRecommendation: ['energized', 'overwhelmed'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'आगे बढ़ने का सबसे बड़ा रहस्य शुरुआत करना है। अपने जटिल और भारी कार्यों को छोटे, सरल हिस्सों में बांटिए।',
        author: 'मार्क ट्वेन',
      },
      bn: {
        text: 'এগিয়ে যাওয়ার আসল রহস্য হলো শুরু করা। বড় এবং কঠিন কাজকে ছোট ছোট সহজ অংশে ভাগ করে শুরু করুন।',
        author: 'মার্ক টোয়েন',
      },
      es: {
        text: 'El secreto para salir adelante es comenzar. Divide tus tareas abrumadoras en pasos pequeños y manejables.',
        author: 'Mark Twain',
      },
      fr: {
        text: 'Le secret pour avancer, c’est de commencer. Décomposez vos tâches lourdes en petites étapes faciles.',
        author: 'Mark Twain',
      },
      de: {
        text: 'Das Geheimnis des Erfolgs ist das Anfangen. Teile überwältigende Aufgaben in kleine, machbare Schritte.',
        author: 'Mark Twain',
      },
    },
  },
  {
    id: 'mot-hi-1',
    text: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।',
    author: 'स्वामी विवेकानंद (Swami Vivekananda)',
    category: 'motivation',
    tags: ['strength', 'awakening', 'purpose'],
    moodRecommendation: ['energized', 'reflective'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Arise, awake, and stop not until the goal is reached.',
        author: 'Swami Vivekananda',
      },
      bn: {
        text: 'ওঠো, জাগো এবং লক্ষ্য না পৌঁছানো পর্যন্ত থেমো না।',
        author: 'স্বামী বিবেকানন্দ',
      },
      es: {
        text: 'Levántate, despierta y no te detengas hasta alcanzar la meta.',
        author: 'Swami Vivekananda',
      },
      fr: {
        text: 'Lève-toi, réveille-toi et ne t’arrête pas avant d’avoir atteint ton but.',
        author: 'Swami Vivekananda',
      },
      de: {
        text: 'Steh auf, erwache und halte nicht an, bis das Ziel erreicht ist.',
        author: 'Swami Vivekananda',
      },
    },
  },
  {
    id: 'mot-bn-1',
    text: 'বল বীর— বল উন্নত মম শির! শির নেহারি আমারি, নতশির ওই শিখর হিমাদ্রির!',
    author: 'কাজী নজরুল ইসলাম (Kazi Nazrul Islam)',
    category: 'motivation',
    tags: ['bidrohi', 'courage', 'heroism'],
    moodRecommendation: ['energized', 'melancholic'],
    context: 'বিদ্রোহী কবিতা',
    originalLanguage: 'bn',
    translations: {
      en: {
        text: 'Proclaim, Hero, proclaim: My head is ever held high! Looking upon my head, the Himalayan peak bows down in respect!',
        author: 'Kazi Nazrul Islam',
        context: 'The Rebel Poem',
      },
      hi: {
        text: 'कहो वीर, कहो: मेरा मस्तक सदा उन्नत है! मेरे इस स्वाभिमानी शीश को देखकर हिमालय की चोटियां भी नतमस्तक हो जाती हैं!',
        author: 'काज़ी नज़रुल इस्लाम',
      },
      es: {
        text: '¡Proclama, valiente: mi cabeza siempre se mantiene erguida! ¡Al ver mi dignidad, hasta la cumbre más alta se inclina!',
        author: 'Kazi Nazrul Islam',
      },
      fr: {
        text: 'Proclame, ô héros : ma tête est toujours haute ! En voyant ma dignité, même les cimes les plus fières s’inclinent !',
        author: 'Kazi Nazrul Islam',
      },
      de: {
        text: 'Verkünde, Held: Mein Haupt ist stets erhoben! Vor meiner Würde beugt sich selbst der höchste Gipfel!',
        author: 'Kazi Nazrul Islam',
      },
    },
  },
  {
    id: 'mot-2',
    text: 'You have power over your mind - not outside events. Realize this, and you will find great strength.',
    author: 'Marcus Aurelius',
    category: 'motivation',
    tags: ['stoicism', 'strength', 'focus'],
    moodRecommendation: ['anxious', 'energized', 'reflective'],
    context: 'Meditations, Book IV',
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'आपका नियंत्रण अपने विचारों पर है, बाहरी घटनाओं पर नहीं। इस सत्य को समझें, और आपको अपार आंतरिक शक्ति मिलेगी।',
        author: 'मार्कस ऑरेलियस',
        context: 'मेडिटेशन्स, पुस्तक IV',
      },
      bn: {
        text: 'আপনার নিয়ন্ত্রণ কেবল নিজের মনের ওপর, বাইরের ঘটনার ওপর নয়। এটি উপলব্ধি করলেই আপনি অসীম আত্মশক্তি খুঁজে পাবেন।',
        author: 'মার্কাস অরেলিয়াস',
      },
      es: {
        text: 'Tienes poder sobre tu mente, no sobre los acontecimientos externos. Comprende esto y encontrarás una fuerza inmensa.',
        author: 'Marco Aurelio',
      },
      fr: {
        text: 'Tu as le pouvoir sur ton esprit, pas sur les événements extérieurs. Comprends cela, et tu trouveras une force immense.',
        author: 'Marc Aurèle',
      },
      de: {
        text: 'Du hast Macht über deinen Geist, nicht über äußere Ereignisse. Erkenne dies, und du wirst unendliche Stärke finden.',
        author: 'Mark Aurel',
      },
    },
  },

  // 3. HEALING & COMPASSION
  {
    id: 'heal-1',
    text: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.',
    author: 'Buddha',
    category: 'healing',
    tags: ['self-love', 'grace', 'worthiness'],
    moodRecommendation: ['melancholic', 'anxious', 'grateful'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'पूरे ब्रह्मांड में किसी भी अन्य व्यक्ति की तरह, आप स्वयं भी अपने प्रेम, सम्मान और करुणा के पूर्ण हकदार हैं।',
        author: 'भगवान बुद्ध',
      },
      bn: {
        text: 'সমগ্র মহাবিশ্বে যে কারো মতোই, আপনি নিজেও নিজের ভালোবাসা, স্নেহ এবং যত্নের সম্পূর্ণ দাবিদার।',
        author: 'গৌতম বুদ্ধ',
      },
      es: {
        text: 'Tú mismo, tanto como cualquier ser en todo el universo, mereces tu propio amor y afecto.',
        author: 'Buda',
      },
      fr: {
        text: 'Toi-même, autant que quiconque dans l’univers entier, mérites ton propre amour et ta tendresse.',
        author: 'Bouddha',
      },
      de: {
        text: 'Du selbst verdienst deine Liebe und Zuneigung genauso sehr wie jeder andere im gesamten Universum.',
        author: 'Buddha',
      },
    },
  },
  {
    id: 'heal-hi-1',
    text: 'कोई पत्थर की मूरत है, किसी पत्थर में मूरत है। खुद को तराशो तो तुम में भी खुदा की सूरत है।',
    author: 'रहमान (Rahman / Sufi Wisdom)',
    category: 'healing',
    tags: ['self-worth', 'healing', 'inner-beauty'],
    moodRecommendation: ['melancholic', 'reflective'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Some see only a stone; some discover a sculpture within. Chisel away your self-doubt, and you will find divine grace within yourself.',
        author: 'Sufi Wisdom',
      },
      bn: {
        text: 'কেউ দেখে শুধুই পাথর, কেউ খোঁজে পাথরের ভেতরের রূপ। আত্মসংশয় দূর করে নিজেকে চিনলে নিজের মধ্যেই পরম সৌন্দর্যের প্রকাশ ঘটে।',
        author: 'সুফি বাণী',
      },
      es: {
        text: 'Algunos ven solo una piedra; otros descubren la escultura en su interior. Pule tus dudas y hallarás la gracia divina en ti.',
        author: 'Sabiduría Sufí',
      },
      fr: {
        text: 'Certains ne voient qu’une pierre ; d’autres découvrent la sculpture qu’elle renferme. Sculpte tes doutes et trouve la grâce en toi.',
        author: 'Sagesse Soufie',
      },
      de: {
        text: 'Manche sehen nur einen Stein; andere erkennen die Skulptur darin. Befreie dich vom Selbstzweifel und entdecke die göttliche Anmut in dir.',
        author: 'Sufi Weisheit',
      },
    },
  },
  {
    id: 'heal-es-1',
    text: 'La memoria del corazón elimina los malos recuerdos y magnifica los buenos, y gracias a ese artificio, logramos sobrellevar el pasado.',
    author: 'Gabriel García Márquez',
    category: 'healing',
    tags: ['heart', 'healing', 'acceptance'],
    moodRecommendation: ['melancholic', 'reflective'],
    context: 'El amor en los tiempos del cólera',
    originalLanguage: 'es',
    translations: {
      en: {
        text: 'The memory of the heart eliminates the bad and magnifies the good, and thanks to this artifice, we manage to endure and heal from the past.',
        author: 'Gabriel García Márquez',
      },
      hi: {
        text: 'हृदय की स्मृति कड़वी यादों को मिटा देती है और सुखद पलों को संजो लेती है; इसी वरदान से हम अपने अतीत के घावों को भर पाते हैं।',
        author: 'गेब्रियल गार्सिया मार्केज़',
      },
      bn: {
        text: 'হৃদয়ের স্মৃতি সমস্ত তিক্ততাকে মুছে ভালো মুহূর্তগুলোকে উজ্জ্বল করে রাখে, যার ফলে আমরা অতীতের ক্ষত কাটিয়ে নতুন করে বাঁচতে পারি।',
        author: 'গাব্রিয়েল গার্সিয়া মার্কেস',
      },
      fr: {
        text: 'La mémoire du cœur efface les mauvais souvenirs et magnifie les bons, nous permettant ainsi de surmonter le passé.',
        author: 'Gabriel García Márquez',
      },
      de: {
        text: 'Das Gedächtnis des Herzens löscht das Schlechte und vergrößert das Gute, und dank dieses Zaubers können wir die Vergangenheit heilen.',
        author: 'Gabriel García Márquez',
      },
    },
  },
  {
    id: 'heal-2',
    text: 'Be gentle with yourself. You are doing the best you can with the knowledge and energy you have right now.',
    author: 'Kristin Neff',
    category: 'healing',
    tags: ['self-compassion', 'gentleness', 'patience'],
    moodRecommendation: ['overwhelmed', 'melancholic'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'अपने प्रति दयालु रहें। इस समय आपके पास जितनी समझ और ऊर्जा है, आप उसी के साथ अपना सर्वश्रेष्ठ प्रयास कर रहे हैं।',
        author: 'क्रिस्टिन नेफ',
      },
      bn: {
        text: 'নিজের প্রতি সদয় হোন। আপনার কাছে এই মুহূর্তে যেটুকু সামর্থ্য ও শক্তি আছে, আপনি তার সেরা ব্যবহারই করছেন।',
        author: 'ক্রিস্টিন নেফ',
      },
      es: {
        text: 'Sé amable contigo mismo. Estás haciendo lo mejor que puedes con el conocimiento y la energía que tienes ahora.',
        author: 'Kristin Neff',
      },
      fr: {
        text: 'Sois doux avec toi-même. Tu fais de ton mieux avec l’énergie et les connaissances dont tu disposes aujourd’hui.',
        author: 'Kristin Neff',
      },
      de: {
        text: 'Sei nachsichtig mit dir selbst. Du tust dein Bestes mit dem Wissen und der Energie, die dir heute zur Verfügung stehen.',
        author: 'Kristin Neff',
      },
    },
  },

  // 4. SUCCESS & FOCUS
  {
    id: 'succ-hi-1',
    text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    author: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    category: 'success',
    tags: ['karma', 'focus', 'detachment', 'duty'],
    moodRecommendation: ['anxious', 'energized', 'reflective'],
    context: 'अध्याय 2, श्लोक 47',
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'You have a right only to perform your prescribed duty, but never to the fruits of action. Do not let the outcome be your motive, nor remain inactive.',
        author: 'Bhagavad Gita',
        context: 'Chapter 2, Verse 47',
      },
      bn: {
        text: 'কর্মে তোমার অধিকার আছে, কিন্তু তার ফলে কখনোই নয়। ফলের আকাঙ্ক্ষা যেন তোমার কর্মের কারণ না হয়, আবার নিষ্ক্রিয়তায়ও যেন মন না যায়।',
        author: 'শ্রীমদ্ভগবদ্গীতা',
      },
      es: {
        text: 'Tienes derecho al trabajo, pero nunca a los frutos del trabajo. No dejes que el fruto sea tu motivación, ni te entregues a la inacción.',
        author: 'Bhagavad Gita',
      },
      fr: {
        text: 'Tu as droit à l’action, mais jamais aux fruits de tes actes. Ne sois pas guidé par la récompense, et ne sombre pas dans l’inaction.',
        author: 'Bhagavad Gita',
      },
      de: {
        text: 'Dein Recht ist allein auf das Handeln, niemals auf die Früchte. Lass nicht das Ergebnis dein Motiv sein, noch verharre in Untätigkeit.',
        author: 'Bhagavad Gita',
      },
    },
  },
  {
    id: 'succ-1',
    text: 'Simplicity is about subtracting the obvious and adding the meaningful.',
    author: 'John Maeda',
    category: 'success',
    tags: ['simplicity', 'craft', 'focus'],
    moodRecommendation: ['reflective', 'energized'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'सादगी का अर्थ व्यर्थ चीज़ों को हटाना और सार्थक चीज़ों को जोड़ना है।',
        author: 'जॉन माएदा',
      },
      bn: {
        text: 'সরলতার আসল অর্থ হলো অপ্রয়োজনীয় জিনিস বাদ দেওয়া এবং অর্থবহ বিষয় যুক্ত করা।',
        author: 'জন মায়েদা',
      },
      es: {
        text: 'La simplicidad consiste en restar lo obvio y añadir lo significativo.',
        author: 'John Maeda',
      },
      fr: {
        text: 'La simplicité consiste à soustraire l’évident et à ajouter le signifiant.',
        author: 'John Maeda',
      },
      de: {
        text: 'Einfachheit bedeutet, das Offensichtliche wegzunehmen und das Bedeutungsvolle hinzuzufügen.',
        author: 'John Maeda',
      },
    },
  },
  {
    id: 'succ-2',
    text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'James Clear',
    category: 'success',
    tags: ['systems', 'habits', 'execution'],
    moodRecommendation: ['energized'],
    context: 'Atomic Habits',
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'आप अपने लक्ष्यों के स्तर तक नहीं उठते, बल्कि अपनी दैनिक आदतों और प्रणालियों के स्तर पर टिकते हैं।',
        author: 'जेम्स क्लियर',
        context: 'एटॉमिक हैबिट्स',
      },
      bn: {
        text: 'আপনি শুধু লক্ষ্যের জোরে ওপরে ওঠেন না, আপনি স্থির থাকেন আপনার প্রতিদিনের অভ্যাস ও পদ্ধতির জোরে।',
        author: 'জেমস ক্লিয়ার',
      },
      es: {
        text: 'No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.',
        author: 'James Clear',
      },
      fr: {
        text: 'Vous ne vous élevez pas au niveau de vos objectifs. Vous retombez au niveau de vos systèmes.',
        author: 'James Clear',
      },
      de: {
        text: 'Du steigst nicht auf das Niveau deiner Ziele. Du fällst auf das Niveau deiner Systeme.',
        author: 'James Clear',
      },
    },
  },

  // 5. GRATITUDE & JOY
  {
    id: 'grat-1',
    text: 'Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity.',
    author: 'Melody Beattie',
    category: 'gratitude',
    tags: ['contentment', 'abundance', 'clarity'],
    moodRecommendation: ['grateful', 'peaceful'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'कृतज्ञता हमारे पास जो है उसे पर्याप्त और उससे भी अधिक बना देती है। यह इनकार को स्वीकार्यता में और भ्रम को स्पष्टता में बदल देती है।',
        author: 'मेलोडी बीटी',
      },
      bn: {
        text: 'কৃতজ্ঞতা আমাদের যা আছে তাকেই পর্যাপ্ত এবং প্রাচুর্যময় করে তোলে। এটি বিশৃঙ্খলাকে শৃঙ্খলায় এবং বিভ্রান্তিকে স্পষ্টতায় রূপান্তর করে।',
        author: 'মেলোডি বিটি',
      },
      es: {
        text: 'La gratitud convierte lo que tenemos en suficiente, y más. Transforma la negación en aceptación, el caos en orden y la confusión en claridad.',
        author: 'Melody Beattie',
      },
      fr: {
        text: 'La gratitude transforme ce que nous avons en abondance. Elle transforme le déni en acceptation, le chaos en ordre et la confusion en clarté.',
        author: 'Melody Beattie',
      },
      de: {
        text: 'Dankbarkeit verwandelt das, was wir haben, in genug und mehr. Sie wandelt Leugnung in Annahme, Chaos in Ordnung und Verwirrung in Klarheit.',
        author: 'Melody Beattie',
      },
    },
  },
  {
    id: 'grat-bn-1',
    text: 'আনন্দধারা বহিছে ভুবনে, দিনরজনী কত অমৃতরস ঝরিতেছে। চোখ মেলিয়া শুধু হৃদয়ে অনুভব করো।',
    author: 'রবীন্দ্রনাথ ঠাকুর (Rabindranath Tagore)',
    category: 'gratitude',
    tags: ['ananda', 'joy', 'nature', 'presence'],
    moodRecommendation: ['grateful', 'peaceful'],
    originalLanguage: 'bn',
    translations: {
      en: {
        text: 'A stream of joy flows through the world day and night, showering sweet nectar. Open your awareness and feel it within your heart.',
        author: 'Rabindranath Tagore',
      },
      hi: {
        text: 'संसार में दिन-रात आनंद की अविरल धारा बह रही है। बस अपनी आंखें खोलें और हृदय से इस अनुकंपा को महसूस करें।',
        author: 'रवींद्रनाथ टैगोर',
      },
      es: {
        text: 'Un torrente de alegría fluye por el mundo día y noche. Abre tu percepción y siéntelo en lo profundo de tu corazón.',
        author: 'Rabindranath Tagore',
      },
      fr: {
        text: 'Un flot de joie traverse le monde jour et nuit. Ouvre ton regard et ressens-le au fond de ton cœur.',
        author: 'Rabindranath Tagore',
      },
      de: {
        text: 'Ein Strom der Freude fließt Tag und Nacht durch die Welt. Öffne deine Sinne und spüre ihn in deinem Herzen.',
        author: 'Rabindranath Tagore',
      },
    },
  },
  {
    id: 'grat-2',
    text: 'When you arise in the morning, think of what a precious privilege it is to be alive—to breathe, to think, to enjoy, to love.',
    author: 'Marcus Aurelius',
    category: 'gratitude',
    tags: ['morning', 'privilege', 'presence'],
    moodRecommendation: ['grateful', 'energized'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'जब आप सुबह उठें, तो सोचें कि जीवित रहना कितना अनमोल सौभाग्य है—सांस लेना, सोचना, आनंद लेना और प्रेम करना।',
        author: 'मार्कस ऑरेलियस',
      },
      bn: {
        text: 'সকালে ঘুম থেকে উঠে ভাবুন বেঁচে থাকা কত বড় আশীর্বাদ—শ্বাস নেওয়া, চিন্তা করা, আনন্দ পাওয়া এবং ভালোবাসা প্রকাশ করা।',
        author: 'মার্কাস অরেলিয়াস',
      },
      es: {
        text: 'Cuando te levantes por la mañana, piensa en el precioso privilegio que es estar vivo: respirar, pensar, disfrutar, amar.',
        author: 'Marco Aurelio',
      },
      fr: {
        text: 'Quand tu te lèves le matin, pense au précieux privilège d’être en vie : respirer, penser, apprécier, aimer.',
        author: 'Marc Aurèle',
      },
      de: {
        text: 'Wenn du am Morgen erwachst, denke daran, welch kostbares Privileg es ist zu leben – zu atmen, zu denken, zu genießen, zu lieben.',
        author: 'Mark Aurel',
      },
    },
  },

  // 6. WISDOM & PHILOSOPHY
  {
    id: 'wis-hi-1',
    text: 'बड़ा हुआ तो क्या हुआ जैसे पेड़ खजूर। पंथी को छाया नहीं फल लागे अति दूर॥',
    author: 'कबीर दास (Kabir Das)',
    category: 'wisdom',
    tags: ['humility', 'compassion', 'wisdom'],
    moodRecommendation: ['reflective', 'calm'],
    context: 'कबीर दोहा',
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Of what use is being great if like a date palm tree, you give no shade to the weary traveler and your fruits hang too far out of reach?',
        author: 'Kabir Das',
      },
      bn: {
        text: 'খেজুর গাছের মতো বিশাল হয়ে লাভ কি, যে ক্লান্ত পথিককে ছায়া দেয় না আর যার ফলও অনেক দূরে ধরে? নম্রতাই আসল মহত্ত্ব।',
        author: 'কবীর দাস',
      },
      es: {
        text: '¿De qué sirve ser grande si, como la palmera, no das sombra al caminante fatigado y tus frutos cuelgan inalcanzables?',
        author: 'Kabir Das',
      },
      fr: {
        text: 'À quoi bon être grand si, comme le palmier, on n’offre aucune ombre au voyageur et que nos fruits restent inaccessibles ?',
        author: 'Kabir Das',
      },
      de: {
        text: 'Was nützt Größe, wenn man wie eine Dattelpalme dem Wanderer keinen Schatten spendet und die Früchte unerreichbar hängen?',
        author: 'Kabir Das',
      },
    },
  },
  {
    id: 'wis-1',
    text: 'Muddy water is best cleared by leaving it alone.',
    author: 'Alan Watts',
    category: 'wisdom',
    tags: ['non-action', 'clarity', 'tao'],
    moodRecommendation: ['anxious', 'reflective', 'calm'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'गंदले पानी को साफ करने का सबसे बेहतरीन तरीका है उसे बिना छेड़े शांत छोड़ देना।',
        author: 'एलन वॉट्स',
      },
      bn: {
        text: 'ঘোলা জল পরিষ্কার করার সবচেয়ে সহজ উপায় হলো তাকে নাড়াচাড়া না করে স্থির হতে দেওয়া।',
        author: 'অ্যালান ওয়াটস',
      },
      es: {
        text: 'El agua turbia se aclara mejor dejándola en paz.',
        author: 'Alan Watts',
      },
      fr: {
        text: 'L’eau boueuse s’éclaircit mieux lorsqu’on la laisse reposer.',
        author: 'Alan Watts',
      },
      de: {
        text: 'Trübes Wasser wird am besten klar, wenn man es in Ruhe lässt.',
        author: 'Alan Watts',
      },
    },
  },
  {
    id: 'wis-2',
    text: 'We suffer more often in imagination than in reality.',
    author: 'Seneca',
    category: 'wisdom',
    tags: ['stoicism', 'perspective', 'anxiety'],
    moodRecommendation: ['anxious', 'reflective'],
    context: 'Letters from a Stoic',
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'हम वास्तविकता की तुलना में अपनी कल्पनाओं और चिंताओं में अधिक पीड़ा झेलते हैं।',
        author: 'सेनेका',
        context: 'स्टोइक पत्र',
      },
      bn: {
        text: 'বাস্তবের তুলনায় আমরা নিজেদের নেতিবাচক কল্পনায় অনেক বেশি কষ্ট পাই।',
        author: 'সেনেকা',
      },
      es: {
        text: 'Sufrimos más a menudo en la imaginación que en la realidad.',
        author: 'Séneca',
      },
      fr: {
        text: 'Nous souffrons plus souvent en imagination qu’en réalité.',
        author: 'Sénèque',
      },
      de: {
        text: 'Wir leiden häufiger in unserer Vorstellung als in der Wirklichkeit.',
        author: 'Seneca',
      },
    },
  },

  // 7. COURAGE & RESILIENCE
  {
    id: 'crg-hi-1',
    text: 'लहरों से डर कर नौका पार नहीं होती, कोशिश करने वालों की कभी हार नहीं होती।',
    author: 'सोहनलाल द्विवेदी / हरिवंश राय बच्चन',
    category: 'courage',
    tags: ['perseverance', 'courage', 'resilience'],
    moodRecommendation: ['melancholic', 'energized'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Fearing the waves, the boat cannot cross the shore; those who dare to keep trying never face defeat.',
        author: 'Harivansh Rai Bachchan',
      },
      bn: {
        text: 'ঢেউয়ের ভয়ে নৌকা তীরে ভিড়তে পারে না; যারা বারবার চেষ্টা করে তাদের কখনোই পরাজয় হয় না।',
        author: 'হরিবংশ রায় বচ্চন',
      },
      es: {
        text: 'Por miedo a las olas, la barca jamás cruza el mar; aquellos que perseveran con valentía nunca son derrotados.',
        author: 'Harivansh Rai Bachchan',
      },
      fr: {
        text: 'Craignant les vagues, la barque ne traverse jamais le rivage ; ceux qui osent persévérer ne connaissent jamais la défaite.',
        author: 'Harivansh Rai Bachchan',
      },
      de: {
        text: 'Aus Furcht vor den Wellen erreicht das Boot das Ufer nicht; wer beharrlich weiterstrebt, wird niemals besiegt.',
        author: 'Harivansh Rai Bachchan',
      },
    },
  },
  {
    id: 'crg-1',
    text: 'Courage is not the absence of fear, but rather the assessment that something else is much more important than fear.',
    author: 'Franklin D. Roosevelt',
    category: 'courage',
    tags: ['bravery', 'purpose', 'resolve'],
    moodRecommendation: ['anxious', 'energized'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'साहस डर की अनुपस्थिति नहीं है, बल्कि यह निर्णय है कि डर से भी ज्यादा महत्वपूर्ण कुछ और है।',
        author: 'फ्रेंकलिन डी. रूज़वेल्ट',
      },
      bn: {
        text: 'সাহস মানে ভয়ের অনুপস্থিতি নয়, বরং ভয়ের চেয়েও গুরুত্বপূর্ণ কোনো মহৎ উদ্দেশ্যকে বেছে নেওয়ার সংকল্প।',
        author: 'ফ্রাঙ্কলিন ডি. রুজভেল্ট',
      },
      es: {
        text: 'El coraje no es la ausencia de miedo, sino el juicio de que algo más es mucho más importante que el miedo.',
        author: 'Franklin D. Roosevelt',
      },
      fr: {
        text: 'Le courage n’est pas l’absence de peur, mais la conviction que quelque chose d’autre est plus important que la peur.',
        author: 'Franklin D. Roosevelt',
      },
      de: {
        text: 'Mut ist nicht die Abwesenheit von Angst, sondern das Urteil, dass etwas anderes viel wichtiger ist als die Angst.',
        author: 'Franklin D. Roosevelt',
      },
    },
  },

  // 8. EVENING & DEEP REST
  {
    id: 'eve-hi-1',
    text: 'दिन भर की धूप के बाद शाम की छांव मुबारक। जो बीत गया उसे अलविदा कहिए, नई सुबह नई उम्मीदें लाएगी।',
    author: 'स्टेटस वाला विचार (Status Wala)',
    category: 'evening',
    tags: ['night', 'peace', 'letting-go'],
    moodRecommendation: ['peaceful', 'calm'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'After the blazing heat of the day, welcome the soothing shade of evening. Bid farewell to what has passed; dawn will bring new grace.',
        author: 'Status Wala',
      },
      bn: {
        text: 'সারা দিনের ক্লান্তির পর সন্ধ্যার স্নিগ্ধ ছায়া সাদরে গ্রহণ করুন। যা অতীত তাকে বিদায় দিন, নতুন ভোর নতুন আশা বয়ে আনবে।',
        author: 'স্ট্যাটাস ওয়ালা',
      },
      es: {
        text: 'Tras el calor del día, recibe la sombra serena de la tarde. Despídete de lo pasado; el amanecer traerá nueva esperanza.',
        author: 'Status Wala',
      },
      fr: {
        text: 'Après l’ardeur du jour, accueille la fraîcheur du soir. Dis adieu au passé ; l’aube apportera un renouveau.',
        author: 'Status Wala',
      },
      de: {
        text: 'Nach der Hitze des Tages sei der friedliche Abendschatten willkommen. Verabschiede das Vergangene; die Morgenröte bringt neue Hoffnung.',
        author: 'Status Wala',
      },
    },
  },
  {
    id: 'eve-1',
    text: 'Let whatever happened today rest in peace. Close your eyes, release the tension in your jaw, and let the night welcome your soul.',
    author: 'Aura Wisdom',
    category: 'evening',
    tags: ['twilight', 'release', 'slumber'],
    moodRecommendation: ['peaceful', 'overwhelmed'],
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'आज जो कुछ भी हुआ उसे शांति से विदा करें। अपनी आंखें मूंदें, अपने चेहरे के तनाव को ढीला छोड़ें और रात की गोद में विश्राम करें।',
        author: 'स्टेटस वाला',
      },
      bn: {
        text: 'আজ যা ঘটে গেছে তাকে শান্তিতে বিশ্রাম নিতে দিন। চোখ বন্ধ করুন, চোয়ালের ক্লান্তি ঝেড়ে ফেলুন এবং রাতের শীতলতায় নিজেকে সঁপে দিন।',
        author: 'স্ট্যাটাস ওয়ালা',
      },
      es: {
        text: 'Deja que lo que haya pasado hoy descanse en paz. Cierra los ojos, relaja la tensión de tu mandíbula y deja que la noche te acoja.',
        author: 'Status Wala',
      },
      fr: {
        text: 'Laisse reposer en paix tout ce qui s’est passé aujourd’hui. Ferme les yeux, relâche la mâchoire et laisse la nuit t’accueillir.',
        author: 'Status Wala',
      },
      de: {
        text: 'Lass alles ruhen, was heute geschehen ist. Schließe die Augen, entspanne die Gesichtszüge und lass die Nacht dich umfangen.',
        author: 'Status Wala',
      },
    },
  },

  // 9. LOVE & ISHQ
  {
    id: 'love-hi-1',
    text: "इश्क़ पर ज़ोर नहीं है ये वो आतिश 'ग़ालिब', कि लगाए न लगे और बुझाए न बने।",
    author: 'मिर्ज़ा ग़ालिब (Mirza Ghalib)',
    category: 'love',
    tags: ['ishq', 'love', 'ghalib', 'shayari'],
    moodRecommendation: ['mast', 'sukoon', 'peaceful'],
    context: 'दीवान-ए-ग़ालिब',
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Love is not bound by will, Ghalib; it is that fire which neither can be ignited by desire, nor extinguished by effort.',
        author: 'Mirza Ghalib',
        context: 'Divan-e-Ghalib',
      },
      bn: {
        text: 'প্রেম কোনো নিয়মের অধীন নয় গালিব; এ এমন এক আগুন যা চাইলেই জ্বালানো যায় না, আর নিভানোও সম্ভব নয়।',
        author: 'মির্জা গালিব',
      },
      es: {
        text: 'El amor no conoce de cadenas, Ghalib; es aquel fuego que ni la voluntad enciende, ni el esfuerzo puede apagar.',
        author: 'Mirza Ghalib',
      },
      fr: {
        text: 'L’amour n’obéit à nulle volonté, Ghalib ; c’est un feu qu’on ne peut allumer sur commande, ni éteindre par effort.',
        author: 'Mirza Ghalib',
      },
      de: {
        text: 'Liebe beugt sich keinem Willen, Ghalib; sie ist jenes Feuer, das sich weder willentlich entzünden noch löschen lässt.',
        author: 'Mirza Ghalib',
      },
    },
  },
  {
    id: 'love-bn-1',
    text: 'তোমারে পেয়েছি আমি জীবনের শেষ প্রান্তে এসে, যেন দীর্ঘ অন্ধকার রাতের পর প্রথম ভোরের স্নিগ্ধ আলো।',
    author: 'রবীন্দ্রনাথ ঠাকুর (Rabindranath Tagore)',
    category: 'love',
    tags: ['bhalobasha', 'love', 'romance'],
    moodRecommendation: ['sukoon', 'peaceful', 'grateful'],
    originalLanguage: 'bn',
    translations: {
      en: {
        text: 'I found you at the horizon of my life, like the first gentle light of dawn breaking through a long dark night.',
        author: 'Rabindranath Tagore',
      },
      hi: {
        text: 'मैंने तुम्हें जीवन के उस मोड़ पर पाया है, जैसे किसी लंबी अंधेरी रात के बाद भोर की पहली शीतल किरण मिल जाए।',
        author: 'रवींद्रनाथ टैगोर',
      },
      es: {
        text: 'Te encontré en el horizonte de mi vida, como la primera luz suave del alba tras una noche profunda.',
        author: 'Rabindranath Tagore',
      },
      fr: {
        text: 'Je t’ai trouvé au crépuscule de ma vie, comme la première clarté de l’aube après une longue nuit sombre.',
        author: 'Rabindranath Tagore',
      },
      de: {
        text: 'Ich fand dich am Horizont meines Lebens, wie das erste sanfte Licht der Morgendämmerung nach langer Dunkelheit.',
        author: 'Rabindranath Tagore',
      },
    },
  },
  {
    id: 'love-en-1',
    text: 'I love you without knowing how, or when, or from where. I love you straightforwardly, without complexities or pride.',
    author: 'Pablo Neruda',
    category: 'love',
    tags: ['pure-love', 'devotion', 'heart'],
    moodRecommendation: ['sukoon', 'grateful', 'peaceful'],
    context: '100 Love Sonnets',
    originalLanguage: 'en',
    translations: {
      hi: {
        text: 'मैं तुमसे प्रेम करता हूँ बिना जाने कब, कैसे और कहाँ से। मैं सादगी से प्रेम करता हूँ, बिना किसी उलझन या अहंकार के।',
        author: 'पाब्लो नेरुदा',
      },
      bn: {
        text: 'আমি তোমাকে ভালোবাসি না জেনে কীভাবে, কখন বা কোথা থেকে। কোনো অহংকার বা জটিলতা ছাড়া নিঃশর্তভাবেই আমি তোমাকে ভালোবাসি।',
        author: 'পাবলো নেরুদা',
      },
      es: {
        text: 'Te amo sin saber cómo, ni cuándo, ni de dónde. Te amo directamente sin problemas ni orgullo.',
        author: 'Pablo Neruda',
      },
      fr: {
        text: 'Je t’aime sans savoir comment, ni quand, ni d’où. Je t’aime simplement, sans détours ni orgueil.',
        author: 'Pablo Neruda',
      },
      de: {
        text: 'Ich liebe dich, ohne zu wissen wie, noch wann, noch woher. Ich liebe dich schlicht, ohne Stolz und ohne Umwege.',
        author: 'Pablo Neruda',
      },
    },
  },

  // 10. SAD & DARD
  {
    id: 'sad-hi-1',
    text: 'बे-वजह नहीं रोता कोई इश्क़ में, जिसे जान से प्यारा समझो अक्सर वही आँखों में आँसू दे जाता है।',
    author: 'राहत इंदौरी (Rahat Indori)',
    category: 'sad',
    tags: ['dard', 'aansu', 'tanhai', 'heartbreak'],
    moodRecommendation: ['dard', 'tanhai', 'melancholic'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'No one weeps in love without reason; the one you cherished more than your own soul often leaves tears in your eyes.',
        author: 'Rahat Indori',
      },
      bn: {
        text: 'ভালোবাসায় কেউ অকারণে কাঁদে না; যাকে প্রাণের চেয়েও বেশি আপন ভাবা হয়, সেই অনেক সময় চোখের জলের কারণ হয়ে দাঁড়ায়।',
        author: 'রাহাত ইন্দোরী',
      },
      es: {
        text: 'Nadie llora en el amor sin motivo; aquel a quien consideras más valioso que tu propia vida es quien deja lágrimas en tus ojos.',
        author: 'Rahat Indori',
      },
      fr: {
        text: 'On ne pleure jamais d’amour sans raison ; celui que l’on chérit plus que son âme est souvent celui qui apporte les larmes.',
        author: 'Rahat Indori',
      },
      de: {
        text: 'Niemand weint grundlos in der Liebe; wer einem teurer als das eigene Leben war, hinterlässt oft Tränen in den Augen.',
        author: 'Rahat Indori',
      },
    },
  },
  {
    id: 'sad-hi-2',
    text: 'यूँ ही बेसबब न फिरा करो, कोई शाम घर भी रहा करो। वो ग़ज़ल की सच्ची किताब है, उसे चुपके-चुपके पढ़ा करो।',
    author: 'बशीर बद्र (Bashir Badr)',
    category: 'sad',
    tags: ['tanhai', 'viraha', 'sad-shayari'],
    moodRecommendation: ['tanhai', 'reflective'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Do not wander without aim; stay home on some evenings. That person is a sacred book of poetry; read them in quiet contemplation.',
        author: 'Bashir Badr',
      },
      bn: {
        text: 'অকারণে ঘুরে বেড়িও না, কোনো কোনো সন্ধ্যায় ঘরেও থেকো। সে হলো এক জীবন্ত কবিতার বই, নিভৃতে তাকে উপলব্ধি করো।',
        author: 'বশির বদ্র',
      },
      es: {
        text: 'No deambules sin rumbo; quédate en casa algunas tardes. Aquella persona es un libro de poesía viva; léela en silenciosa calma.',
        author: 'Bashir Badr',
      },
      fr: {
        text: 'Ne t’égare pas sans but ; reste chez toi certains soirs. Cette âme est un pur livre de poésie ; lis-la dans le secret de ton cœur.',
        author: 'Bashir Badr',
      },
      de: {
        text: 'Wandere nicht ziellos umher; bleibe manchen Abend daheim. Jener Mensch ist ein Buch wahrer Poesie; lies darin in stiller Andacht.',
        author: 'Bashir Badr',
      },
    },
  },
  {
    id: 'sad-bn-1',
    text: 'যেখানে দেখার কথা ছিল ভালোবাসার সুনীল আকাশ, সেখানে আজ কেবল ফেলে আসা স্মৃতির দীর্ঘশ্বাস আর শূন্যতা।',
    author: 'কাজী নজরুল ইসলাম (Kazi Nazrul Islam)',
    category: 'sad',
    tags: ['biroho', 'sad', 'shunyata'],
    moodRecommendation: ['dard', 'tanhai', 'melancholic'],
    originalLanguage: 'bn',
    translations: {
      en: {
        text: 'Where we once hoped to behold the blue sky of love, today remains only the sigh and quiet void of abandoned memories.',
        author: 'Kazi Nazrul Islam',
      },
      hi: {
        text: 'जहाँ कभी प्यार का नीला आसमान देखना था, आज वहाँ केवल छूटी हुई यादों की ठंडी आहें और ख़ामोशी बची है।',
        author: 'काज़ी नज़रुल इस्लाम',
      },
      es: {
        text: 'Donde esperábamos contemplar el cielo del amor, hoy solo queda el suspiro y el vacío de los recuerdos lejanos.',
        author: 'Kazi Nazrul Islam',
      },
      fr: {
        text: 'Là où nous espérions voir le ciel de l’amour, il ne reste aujourd’hui que le soupir et le vide des souvenirs lointains.',
        author: 'Kazi Nazrul Islam',
      },
      de: {
        text: 'Wo wir den blauen Himmel der Liebe erhofften, bleibt heute nur der Seufzer und die Leere vergangener Erinnerungen.',
        author: 'Kazi Nazrul Islam',
      },
    },
  },

  // 11. FESTIVALS & CELEBRATIONS
  {
    id: 'fest-diwali',
    text: 'दीपक की जगमगाती रोशनी और अपनों का अटूट प्यार, हर घर में सुख-समृद्धि लाए ये दिवाली का पावन त्योहार। शुभ दीपावली!',
    author: 'स्टेटस वाला (Status Wala)',
    category: 'festivals',
    tags: ['diwali', 'deepavali', 'festival', 'roshni'],
    moodRecommendation: ['shukrana', 'mast', 'peaceful'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'May the radiant glow of diyas and the warmth of family bring boundless prosperity and peace this Diwali. Happy Diwali!',
        author: 'Status Wala',
      },
      bn: {
        text: 'প্রদীপের আলো আর প্রিয়জনদের উষ্ণ ভালোবাসায় ভরে উঠুক জীবন। শুভ দীপাবলি ও ধনতেরাসের আন্তরিক শুভেচ্ছা!',
        author: 'স্ট্যাটাস ওয়ালা',
      },
      es: {
        text: 'Que el brillo de las luces y el amor familiar traigan infinita prosperidad y dicha en este Diwali. ¡Feliz Diwali!',
        author: 'Status Wala',
      },
      fr: {
        text: 'Que la lueur des lampes et la tendresse des proches illuminent votre foyer de joie et d’abondance. Joyeux Diwali !',
        author: 'Status Wala',
      },
      de: {
        text: 'Möge das Licht der Festlampen und die Liebe der Familie dein Heim mit Glück und Fülle erfüllen. Frohes Diwali!',
        author: 'Status Wala',
      },
    },
  },
  {
    id: 'fest-eid',
    text: 'चाँद की पहली किरण के साथ आपकी ज़िंदगी में खुशियों की बहार आए। हर दिल में मुहब्बत और हर लब पे दुआ हो। ईद मुबारक!',
    author: 'स्टेटस वाला (Status Wala)',
    category: 'festivals',
    tags: ['eid', 'eid-mubarak', 'celebration', 'duaa'],
    moodRecommendation: ['shukrana', 'peaceful', 'grateful'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'With the sighting of the crescent moon, may your life bloom with blessings, compassion, and boundless joy. Eid Mubarak!',
        author: 'Status Wala',
      },
      bn: {
        text: 'বাঁকা চাঁদের হাসিতে ভরে উঠুক সবার মন। ভালোবাসা ও সৌহার্দ্যের বন্ধনে কাটুক প্রতিটি দিন। ঈদ মোবারক!',
        author: 'স্ট্যাটাস ওয়ালা',
      },
      es: {
        text: 'Con la dulce luna creciente, que tu vida florezca de paz, generosidad y alegría infinita. ¡Eid Mubarak!',
        author: 'Status Wala',
      },
      fr: {
        text: 'Au regard du croissant de lune, que votre vie s’épanouisse dans la paix, la douceur et la bénédiction. Eid Moubarak !',
        author: 'Status Wala',
      },
      de: {
        text: 'Mit dem Leuchten der Mondsichel möge dein Leben in Frieden, Gnade und unendlicher Freude erblühen. Eid Mubarak!',
        author: 'Status Wala',
      },
    },
  },
  {
    id: 'fest-durga',
    text: 'ঢাকের কাঠি কাশফুল আর শিউলি ফুলের গন্ধ নিয়ে এলো মা দুর্গার আগমনী সুর। দশভুজার আশীর্বাদে সবার জীবন শান্তি ও আনন্দে ভরে উঠুক। শুভ শারদীয়া!',
    author: 'স্ট্যাটাস ওয়ালা (Status Wala)',
    category: 'festivals',
    tags: ['durga-puja', 'sharadiya', 'utsav', 'pujo'],
    moodRecommendation: ['mast', 'shukrana', 'grateful'],
    originalLanguage: 'bn',
    translations: {
      en: {
        text: 'With the beat of the dhaak and fragrance of autumn blossoms, Maa Durga arrives. May the Mother bless you with joy, courage, and prosperity. Shubho Sharadiya!',
        author: 'Status Wala',
      },
      hi: {
        text: 'ढाक की गूंज और शरद की खुशबू के साथ माँ दुर्गा का आगमन हो चुका है। माँ की असीम कृपा से आपका जीवन हर्ष और समृद्धि से भर जाए। शुभ शारदीय दुर्गोत्सव!',
        author: 'स्टेटस वाला',
      },
      es: {
        text: 'Al compás festivo de los tambores de otoño, llega la Madre Durga. Que su divina bendición colme tu camino de coraje y alegría.',
        author: 'Status Wala',
      },
      fr: {
        text: 'Au rythme chaleureux des tambours d’automne, Maa Durga fait son entrée. Que sa grâce vous apporte force, lumière et joie. Shubho Sharadiya !',
        author: 'Status Wala',
      },
      de: {
        text: 'Mit dem feierlichen Trommelklang zieht Maa Durga ein. Möge ihr Segen dein Leben mit Mut, Frieden und Freude bereichern.',
        author: 'Status Wala',
      },
    },
  },
  {
    id: 'fest-holi',
    text: 'गुलाल की लाली, अपनों का प्यार, गिले-शिकवे मिटाकर एक दूजे को गले लगाने का आया है त्यौहार। आप सभी को होली की हार्दिक शुभकामनाएँ!',
    author: 'स्टेटस वाला (Status Wala)',
    category: 'festivals',
    tags: ['holi', 'rang', 'gulal', 'joy'],
    moodRecommendation: ['mast', 'energized'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Splashes of vibrant colours, the warmth of beloved friends, and the joy of letting go of past grievances. Happy Holi to you and your family!',
        author: 'Status Wala',
      },
      bn: {
        text: 'রংবেরঙের আবির আর ভালোবাসার মেলবন্ধনে রঙিন হোক সবার মন। সমস্ত বিভেদ ভুলে মেতে উঠুন উৎসবের রঙে। শুভ দোলযাত্রা ও হোলি!',
        author: 'স্ট্যাটাস ওয়ালা',
      },
      es: {
        text: '¡Colores vibrantes, abrazos sinceros y risas compartidas! Que este festival de colores llene tu corazón de gozo. ¡Feliz Holi!',
        author: 'Status Wala',
      },
      fr: {
        text: 'Des éclats de poudres chatoyantes et l’étreinte des cœurs réconciliés. Que la fête des couleurs illumine votre vie. Joyeuse Holi !',
        author: 'Status Wala',
      },
      de: {
        text: 'Farbenfrohe Freuden, herzliche Umarmungen und versöhnende Momente. Möge das Fest der Farben dein Leben erhellen. Frohes Holi!',
        author: 'Status Wala',
      },
    },
  },

  // 12. ATTITUDE & TEVAR
  {
    id: 'att-hi-1',
    text: 'तेवर तो हम वक्त आने पर दिखाएंगे, शहर तुम खरीद लो उस पर हुकूमत और राज हम चलाएंगे।',
    author: 'देसी तेवर (Desi Swag)',
    category: 'attitude',
    tags: ['attitude', 'swag', 'tevar', 'self-respect'],
    moodRecommendation: ['josh', 'mast'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'We demonstrate our mettle when the right moment arrives; buy the whole city if you want, the rule of respect remains ours.',
        author: 'Desi Attitude',
      },
      bn: {
        text: 'আসল তেজ সময় আসলেই দেখা যাবে; শহর তোমরা কিনে নিতে পারো, কিন্তু ব্যক্তিত্বের রাজত্ব চিরকাল আমাদেরই থাকবে।',
        author: 'দেশি সোয়াগ',
      },
      es: {
        text: 'Demostramos nuestra casta cuando llega el momento oportuno; compra la ciudad entera si deseas, el señorío del respeto es nuestro.',
        author: 'Actitud Real',
      },
      fr: {
        text: 'Nous montrons notre vraie trempe le moment venu ; achète la ville si tu veux, le règne du respect nous appartient.',
        author: 'Attitude Royale',
      },
      de: {
        text: 'Unsere Haltung beweisen wir, wenn die Stunde schlägt; kaufe die Stadt, doch der Respekt regiert nach unseren Regeln.',
        author: 'Royal Swag',
      },
    },
  },
  {
    id: 'att-hi-2',
    text: 'शोर करने से कभी किसी की पहचान नहीं बनती, काम ऐसा करो कि तुम्हारी ख़ामोशी भी अख़बार की सुर्ख़ियों में आ जाए।',
    author: 'स्टेटस वाला (Status Wala)',
    category: 'attitude',
    tags: ['attitude', 'khamoshi', 'success', 'power'],
    moodRecommendation: ['josh', 'reflective'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Noise never builds true prestige; execute your craft so powerfully that even your silence commands the front page.',
        author: 'Status Wala',
      },
      bn: {
        text: 'চিৎকার করে কখনো নিজের মর্যাদা তৈরি হয় না; কাজ এমন গভীর নিষ্ঠায় করো যাতে তোমার নীরবতাও চারদিকে আলোড়ন তোলে।',
        author: 'স্ট্যাটাস ওয়ালা',
      },
      es: {
        text: 'El ruido jamás construye auténtico prestigio; trabaja con tal maestría que hasta tu silencio sea titular de primera plana.',
        author: 'Status Wala',
      },
      fr: {
        text: 'Le bruit ne fait jamais la vraie grandeur ; travaille avec une telle force que ton silence même fasse la une.',
        author: 'Status Wala',
      },
      de: {
        text: 'Lautstärke schafft kein wahres Ansehen; arbeite mit solcher Meisterschaft, dass selbst deine Stille Schlagzeilen schreibt.',
        author: 'Status Wala',
      },
    },
  },

  // 13. FRIENDSHIP & YAARI
  {
    id: 'frnd-hi-1',
    text: 'सच्ची दोस्ती वो नहीं जो सिर्फ़ हँसी में साथ दे, सच्ची दोस्ती वो है जो पानी में गिरे आँसू को भी पहचान लेती है।',
    author: 'सच्ची यारी (Desi Friendship)',
    category: 'friendship',
    tags: ['dosti', 'yaari', 'friends', 'trust'],
    moodRecommendation: ['sukoon', 'grateful', 'mast'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'True friendship is not just celebrating laughter together; true friendship is the one that recognizes a tear even when it falls into water.',
        author: 'Desi Wisdom',
      },
      bn: {
        text: 'আসল বন্ধুত্ব শুধু হাসির দিনে পাশে থাকা নয়; খাঁটি বন্ধুত্ব সেই যা পানিতে পড়ে যাওয়া চোখের জলকেও চিনে নিতে পারে।',
        author: 'অনন্য বন্ধুত্ব',
      },
      es: {
        text: 'La verdadera amistad no es solo reír en los buenos tiempos; es aquella que sabe reconocer una lágrima incluso cuando cae en el río.',
        author: 'Sabiduría Amistosa',
      },
      fr: {
        text: 'La vraie amitié ne consiste pas seulement à rire ensemble ; c’est celle qui distingue une larme même lorsqu’elle tombe dans l’onde.',
        author: 'Sagesse d’Amitié',
      },
      de: {
        text: 'Wahre Freundschaft lacht nicht nur an sonnigen Tagen; sie erkennt eine Träne selbst dann, wenn sie ins Wasser fällt.',
        author: 'Wahre Freundschaft',
      },
    },
  },
  {
    id: 'frnd-hi-2',
    text: 'एक कप चाय और पुराने यार, ज़िन्दगी के सारे तनाव भूलने के लिए बस यही तो चाहिए यार!',
    author: 'चाय और यार (Status Wala)',
    category: 'friendship',
    tags: ['chai', 'yaari', 'chill', 'sukoon'],
    moodRecommendation: ['mast', 'sukoon'],
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'A steaming cup of chai and a reunion with childhood friends—that is all the medicine needed to dissolve every worry of life.',
        author: 'Chai & Friends',
      },
      bn: {
        text: 'এক কাপ ধোঁয়া ওঠা গরম চা আর পুরোনো কিছু বন্ধুর আড্ডা—জীবনের সমস্ত ক্লান্তি মুছে ফেলতে এটুকুই তো যথেষ্ট!',
        author: 'চা ও বন্ধুত্ব',
      },
      es: {
        text: 'Una taza de té caliente y la charla con viejos amigos: no se necesita más para olvidar todas las fatigas de la vida.',
        author: 'Té y Amigos',
      },
      fr: {
        text: 'Une tasse de thé fumant et de vieux amis retrouvés : il n’en faut pas plus pour oublier tous les soucis du monde.',
        author: 'Thé & Amis',
      },
      de: {
        text: 'Eine heiße Tasse Tee und das Lachen alter Freunde – mehr braucht es nicht, um alle Sorgen der Welt zu vergessen.',
        author: 'Tee & Freundschaft',
      },
    },
  },

  // 14. DEVOTIONAL / BHAKTI / ARADHANA (Multilingual Sacred Thoughts)
  {
    id: 'dev-q-1',
    text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    author: 'श्रीमद्भगवद्गीता (Bhagavad Gita 2.47)',
    category: 'devotional',
    tags: ['karma', 'bhagavadgita', 'peace', 'faith', 'devotion'],
    moodRecommendation: ['sukoon', 'shukrana', 'calm', 'reflective'],
    context: 'भगवान श्री कृष्ण उपदेश',
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
        author: 'Bhagavad Gita',
      },
      pa: {
        text: 'ਕਰਮ ਕਰਨਾ ਤੇਰਾ ਅਧਿਕਾਰ ਹੈ, ਪਰ ਫਲ ਦੀ ਇੱਛਾ ਰੱਖਣਾ ਨਹੀਂ। ਨਿਰਸਵਾਰਥ ਮਨ ਨਾਲ ਨੇਕ ਕਰਮ ਕਰਦੇ ਰਹੋ।',
        author: 'ਸ਼੍ਰੀਮਦ ਭਗਵਦ ਗੀਤਾ',
      },
      bn: {
        text: 'কর্মে তোমার অধিকার আছে, কিন্তু ফলে কখনো নয়। নিষ্কামভাবে সৎকর্ম করে যাও, শান্তি অন্তরে বিরাজ করবে।',
        author: 'শ্রীমদ্ভগবদ্গীতা',
      },
      te: {
        text: 'కర్మ చేయుట యందే నీకు అధికారము కలదు, ఫలితముపై ఎన్నడూ లేదు. కర్తవ్యాన్ని నిష్కామముగా ఆచరించుము.',
        author: 'భగవద్గీత',
      },
      ta: {
        text: 'செயல்களைச் செய்வதில் மட்டுமே உனக்கு அதிகாரம் உண்டு, அதன் பலன்களில் ஒருபோதும் இல்லை.',
        author: 'பகவத் கீதை',
      },
      or: {
        text: 'କର୍ମ କରିବା ତୁମର ଅଧିକାର, ମାତ୍ର ଫଳ ଉପରେ କଦାପି ନୁହେଁ। ନିଷ୍କାମ କର୍ମ ହିଁ ପରମ ଶାନ୍ତିର ମାର୍ଗ।',
        author: 'ଭଗବଦ୍ ଗୀତା',
      },
      mr: {
        text: 'कर्म करणे हाच तुझा अधिकार आहे, फळावर कधीही नाही. निःस्वार्थ भावनेने कर्तव्य करत राहा.',
        author: 'श्रीमद्भगवद्गीता',
      },
      gu: {
        text: 'કર્મ કરવાનો જ તારો અધિકાર છે, ફળ ઉપર ક્યારેય નહીં. નિષ્કામ ભાવથી સત્કર્મ કરતો રહે.',
        author: 'શ્રીમદ્ ભગવદ્ ગીતા',
      },
      bho: {
        text: 'कर्म करे के अधिकार तोहार बा, बाकिर फल पर ना। निष्काम भाव से नेकी करत जा, भगवान सब देखत बाड़न।',
        author: 'भगवद्गीता',
      },
    },
  },
  {
    id: 'dev-q-2',
    text: 'चिंता ताकी कीजिए, जो अनहोनी होय। अनहोनी होनी नहीं, होनी ही सो होय॥',
    author: 'संत कबीर दास (Sant Kabir)',
    category: 'devotional',
    tags: ['kabir', 'bhakti', 'surrender', 'sukoon', 'trust'],
    moodRecommendation: ['anxious', 'sukoon', 'peaceful'],
    context: 'कबीर अमृतवाणी',
    originalLanguage: 'hi',
    translations: {
      en: {
        text: 'Worry only if the impossible could occur; what is meant to be will unfold, so surrender fear to divine grace.',
        author: 'Kabir Das',
      },
      pa: {
        text: 'ਚਿੰਤਾ ਓਸ ਚੀਜ਼ ਦੀ ਕਰੋ ਜੋ ਅਣਹੋਣੀ ਹੋਵੇ, ਜੋ ਪ੍ਰਭੂ ਨੇ ਲਿਖਿਆ ਹੈ ਉਹ ਜ਼ਰੂਰ ਹੋਵੇਗਾ। ਮਨ ਨੂੰ ਪ੍ਰਭੂ ਚਰਨਾਂ ਨਾਲ ਜੋੜੋ।',
        author: 'ਕਬੀਰ ਜੀ',
      },
      bn: {
        text: 'চিন্তা করো না, যা হওয়ার তা বিধাতাই নির্দিষ্ট করেছেন। ভগবানের ওপর বিশ্বাস রাখো, তিনিই সব ঠিক করবেন।',
        author: 'কবীর দাস',
      },
      mr: {
        text: 'काळजी कशाला करतोस? ईश्वराच्या इच्छेशिवाय पातंही हलत नाही. सर्व काही त्याच्या चरणी अर्पण कर.',
        author: 'संत कबीर',
      },
      gu: {
        text: 'ચિંતા શેની કરો છો? જે થવાનું છે તે ઈશ્વરની ઇચ્છાથી જ થશે. પ્રભુ ઉપર પૂર્ણ ભરોસો રાખો.',
        author: 'સંત કબીર',
      },
    },
  },
  {
    id: 'dev-q-3',
    text: 'ਜਿਸ ਕੇ ਸਿਰ ਊਪਰਿ ਤੂੰ ਸੁਆਮੀ ਸੋ ਦੁਖੁ ਕੈਸਾ ਪਾਵੈ॥ ਹਰਿ ਹਰਿ ਨਾਮੁ ਜਪੰਤਿਆ ਕਛੁ ਨ ਕਹੈ ਜਮਰਾਇ॥',
    author: 'ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ (Guru Arjan Dev Ji)',
    category: 'devotional',
    tags: ['gurbani', 'waheguru', 'protection', 'shukrana', 'faith'],
    moodRecommendation: ['sukoon', 'shukrana', 'calm'],
    context: 'ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    originalLanguage: 'pa',
    translations: {
      hi: {
        text: 'जिसके सिर पर परमात्मा का हाथ हो, उसे कैसा दुख हो सकता है? प्रभु का सिमरन करने वाले को कोई संकट छू भी नहीं सकता।',
        author: 'श्री गुरु ग्रंथ साहिब',
      },
      en: {
        text: 'One upon whose head the Lord rests His hand, how can that one suffer any sorrow? Under divine grace, fear departs.',
        author: 'Guru Granth Sahib',
      },
      bn: {
        text: 'যার মস্তকে পরমেশ্বরের আশীর্বাদ রয়েছে, তার কোনো দুঃখ হতে পারে না। প্রভুর নাম স্মরণে হৃদয় নির্ভীক হয়।',
        author: 'গুরু গ্রন্থ সাহিব',
      },
    },
  },
];

/**
 * Returns localized quote representation based on requested language
 */
export function getLocalizedQuote(
  quote: Quote,
  lang: Language
): { text: string; author: string; context?: string; isTranslated: boolean } {
  // If requesting original language or no translation exists
  if (quote.originalLanguage === lang) {
    return {
      text: quote.text,
      author: quote.author,
      context: quote.context,
      isTranslated: false,
    };
  }

  const trans = quote.translations?.[lang];
  if (trans) {
    return {
      text: trans.text,
      author: trans.author || quote.author,
      context: trans.context || quote.context,
      isTranslated: true,
    };
  }

  // Fallback to original
  return {
    text: quote.text,
    author: quote.author,
    context: quote.context,
    isTranslated: false,
  };
}
