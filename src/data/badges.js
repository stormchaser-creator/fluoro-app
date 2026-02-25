export const BADGES = [
  { id: 'first-quiz', name: 'First Steps', desc: 'Complete your first quiz question', icon: '🎯' },
  { id: 'ten-correct', name: 'Sharp Shooter', desc: 'Get 10 questions correct', icon: '🏹' },
  { id: 'hundred-questions', name: 'Centurion', desc: 'Answer 100 questions', icon: '💯' },
  { id: 'week-streak', name: 'Week Warrior', desc: '7-day study streak', icon: '🔥' },
  { id: 'month-streak', name: 'Unstoppable', desc: '30-day study streak', icon: '👑' },
  { id: 'domain-master', name: 'Domain Master', desc: '90%+ accuracy in any domain', icon: '🏆' },
  { id: 'all-domains', name: 'Renaissance', desc: 'Study all 7 domains', icon: '🌟' },
  { id: 'speed-reader', name: 'Speed Demon', desc: 'Speed read at 500+ WPM', icon: '⚡' },
  { id: 'completionist', name: 'Completionist', desc: 'Finish all 30 days', icon: '🎖️' },
  { id: 'night-owl', name: 'Night Owl', desc: 'Study after 10 PM', icon: '🦉' },
];

export const XP_AWARDS = {
  questionCorrect: 10,
  questionWrong: 3,
  studySessionComplete: 25,
  dayComplete: 50,
  reviewItem: 5,
  speedRead: 15,
};

export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelForXp(xp) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export const LEVEL_TITLES = [
  '', 'Trainee', 'Student', 'Resident', 'Fellow',
  'Attending', 'Specialist', 'Expert', 'Master',
];
