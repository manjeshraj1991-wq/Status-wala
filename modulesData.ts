import { MindfulnessModule } from '../types';

export const MINDFULNESS_MODULES: MindfulnessModule[] = [
  {
    id: 'mod-1',
    title: 'Morning Awakening & Intention',
    subtitle: '7-minute daily presence ritual to prime your state with clarity',
    durationMinutes: 7,
    category: 'morning',
    isPremium: false,
    ambientType: 'solfeggio-528',
    description: 'Awaken your nervous system gently. Sync your physical breathing with daily intention-setting before the digital world demands your attention.',
    guideSteps: [
      'Find an upright yet effortless posture. Soften your shoulders down away from your ears.',
      'Take 3 intentional, deep inhales through your nose, exhaling completely through your mouth with an audible sigh.',
      'Bring to mind one quiet quality you wish to embody today: Patience, Clarity, or Kindness.',
      'Feel the breath moving naturally at your chest. Let your affirmation settle deep into your physical awareness.',
      'Open your eyes gently, carrying this unhurried ground into your first action of the day.'
    ],
    offlineAvailable: true,
  },
  {
    id: 'mod-2',
    title: 'Nightfall Somatic Release',
    subtitle: '10-minute restorative nervous system reset for deep restorative sleep',
    durationMinutes: 10,
    category: 'sleep',
    isPremium: false,
    ambientType: 'singing-bowl',
    description: 'Unwind residual muscular tension from the day. Uses progressive body scanning and harmonic singing bowls to transition your mind toward deep sleep.',
    guideSteps: [
      'Lie down comfortably or rest in a soft chair. Allow the weight of your head to be fully supported.',
      'Unclench your jaw. Allow the tongue to drop away from the roof of your mouth.',
      'Inhale for 4 seconds... hold gently for 4... exhale smoothly for 6. Feel your belly soften.',
      'Notice any residual tension from conversations or tasks. On your next exhale, silently whisper: "It is finished for today."',
      'Bathe in the resonance of the harmonic singing bowl. Surrender completely to rest.'
    ],
    offlineAvailable: true,
  },
  {
    id: 'mod-3',
    title: 'Anxiety De-escalation & Safe Harbor',
    subtitle: 'Masterclass: Somatic grounding when feeling overwhelmed or racing thoughts',
    durationMinutes: 8,
    category: 'resilience',
    isPremium: true,
    ambientType: 'rain',
    description: 'Expert-crafted vagus nerve soothing protocol. Ground yourself immediately using tactile awareness and rhythmic rain soundscapes.',
    guideSteps: [
      'Place one palm over your sternum and the other over your lower belly. Feel the warmth of your hands.',
      'Observe 5 things you can visually see in this room. Notice their textures and gentle colors.',
      'Notice 4 tactile sensations: your feet against the floor, clothing on your skin, the cool air entering your nose.',
      'Remind yourself: "In this exact second, I am safe, supported, and whole."',
      'Lengthen your exhale until it is twice as long as your inhale. Let the gentle rain wash over your vigilance.'
    ],
    offlineAvailable: true,
  },
  {
    id: 'mod-4',
    title: 'Radical Compassion & Self-Forgiveness',
    subtitle: 'Exclusive: Dissolving inner harshness with Buddhist Metta practice',
    durationMinutes: 12,
    category: 'compassion',
    isPremium: true,
    ambientType: 'forest-stream',
    description: 'A deep psychological healing module designed to soften self-criticism and re-establish a gentle, loyal friendship with yourself.',
    guideSteps: [
      'Envision your younger self or a dear friend who is having a difficult moment.',
      'What tenderness would you offer them? Feel that natural warmth in your heart center.',
      'Now, turn that same gentle gaze inward toward your present self.',
      'Silently repeat: "May I be free from needless sorrow. May I treat myself with patience. May I accept my imperfect humanity."',
      'Rest in the peaceful flowing water soundscape. You do not need to earn your right to peace.'
    ],
    offlineAvailable: true,
  },
  {
    id: 'mod-5',
    title: 'Deep Work Flow & Cognitive Stillness',
    subtitle: 'Curated: 15-minute Alpha frequency immersion for uninterrupted focus',
    durationMinutes: 15,
    category: 'focus',
    isPremium: true,
    ambientType: 'binaural-alpha',
    description: 'Uses 10Hz binaural alpha brainwave synchronization to quiet the default mode network and induce effortless deep immersion.',
    guideSteps: [
      'Define with total clarity the single task you are choosing to honor for the next block of time.',
      'Put all secondary tabs and distractions aside. Your attention is your most precious currency.',
      'Take 5 rapid, oxygenating breaths, followed by a long, slow grounding exhale.',
      'Tune into the 10Hz binaural pulse between your ears. Let extraneous thoughts slip past like leaves on a stream.',
      'Engage with your craft with steady, rhythmic composure.'
    ],
    offlineAvailable: true,
  },
];
