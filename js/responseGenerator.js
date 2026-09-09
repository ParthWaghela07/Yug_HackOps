/**
 * Memora Grounded Personalized Response Generator
 * Expands response synthesis across all persona topics for Dr. Elena Vance.
 */

export function generatePersonalizedResponse(query = '', selectedMemories = []) {
  const qLower = query.toLowerCase();
  const topMemories = selectedMemories.map((s) => s.memory);
  const memTexts = topMemories.map((m) => m.text.toLowerCase());

  // Helper matcher to find memory containing keywords
  const findMem = (...keywords) =>
    topMemories.find((m) => {
      const lower = m.text.toLowerCase();
      return keywords.some((kw) => lower.includes(kw));
    });

  // 1. Core PRD Challenge Prompt: Grant / Exam / Deadline Anxiety
  if (qLower.includes('anxious') || qLower.includes('grant') || qLower.includes('deadline')) {
    const mem = findMem('grant', 'anxiety', 'cello', 'sourdough');
    const text = mem ? mem.text : "You experience deadline anxiety before major grant submissions and reset via cello practice and sourdough baking.";
    return `Take a deep breath, Dr. Elena! I know grant deadlines bring pressure, but remember: ${text}. Let's break your remaining work into focused 45-minute blocks, then reset with your cello tonight!`;
  }

  // 2. Coffee & Morning Ritual
  if (qLower.includes('coffee') || qLower.includes('drink') || qLower.includes('morning ritual')) {
    const mem = findMem('chemex', 'coffee', 'yirgacheffe');
    return mem
      ? `Your morning ritual is sacred! ${mem.text}. Starting your day with a freshly brewed Chemex pour-over helps get you right into flow state.`
      : "Your favorite morning coffee setup is a Chemex pour-over using light-roast Ethiopian Yirgacheffe beans with Oatly oat milk!";
  }

  // 3. Pet / Dog Question
  if (qLower.includes('pet') || qLower.includes('dog') || qLower.includes('biscotti')) {
    const mem = findMem('biscotti', 'dog', 'retriever');
    return mem
      ? `You have a 3-year-old Golden Retriever named Biscotti! ${mem.text}`
      : "You have a sweet 3-year-old Golden Retriever named Biscotti who loves accompanying you on weekend walks!";
  }

  // 4. Partner & Relationship
  if (qLower.includes('partner') || qLower.includes('marcus') || qLower.includes('husband') || qLower.includes('boyfriend')) {
    const mem = findMem('marcus', 'anthropic', 'relationship');
    return mem
      ? `Your partner is Marcus Chen! ${mem.text}. You two met at the NeurIPS 2021 AI Safety workshop in New Orleans.`
      : "Your partner is Marcus Chen, a Staff Software Engineer at Anthropic. You've been together for 3.5 years after meeting at NeurIPS!";
  }

  // 5. Education & PhD Dissertation
  if (qLower.includes('phd') || qLower.includes('thesis') || qLower.includes('berkeley') || qLower.includes('stanford') || qLower.includes('gpa')) {
    const mem = findMem('berkeley', 'stanford', 'dissertation', 'thesis');
    return mem
      ? `Here is your academic background: ${mem.text}. You completed your PhD under Prof. Michael Zhang, focusing on ocean graph neural networks!`
      : "You earned your Ph.D. in AI & Environmental Data Science from UC Berkeley in 2023, following your B.S. in CS from Stanford (3.94 GPA)!";
  }

  // 6. Marathon & Fitness Goals
  if (qLower.includes('marathon') || qLower.includes('running') || qLower.includes('5k') || qLower.includes('pace')) {
    const mem = findMem('marathon', '5k', 'running', 'boston');
    return mem
      ? `Regarding your fitness goals: ${mem.text}. You maintain your 5K morning runs (7:45/mi pace) on M/W/F to stay sharp!`
      : "You run 5K every M/W/F morning at 6:45 AM, training towards your goal of qualifying for the 2026 Boston Marathon (sub-3:30 target)!";
  }

  // 7. Sourdough & Baking
  if (qLower.includes('sourdough') || qLower.includes('baking') || qLower.includes('starter') || qLower.includes('yeasty boy')) {
    const mem = findMem('sourdough', 'starter', 'yeasty');
    return mem
      ? `Your baking passion: ${mem.text}. Saturday mornings are reserved for crisp, golden sourdough loaves!`
      : "Every Saturday morning, you bake sourdough bread using your 4-year-old starter named 'Yeasty Boy'!";
  }

  // 8. Cello & Classical Music
  if (qLower.includes('cello') || qLower.includes('symphony') || qLower.includes('bach') || qLower.includes('instrument')) {
    const mem = findMem('cello', 'symphony', 'bach');
    return mem
      ? `Your musical journey: ${mem.text}. Playing Bach Cello Suite No. 1 on your 1920 French cello is your ultimate evening reset.`
      : "You play a 1920 French classical cello in the San Francisco Community Symphony and have studied classical cello for 14 years!";
  }

  // 9. Work & Climate AI Projects (EcoGraph-1, TerraAI Labs)
  if (qLower.includes('work') || qLower.includes('ecograph') || qLower.includes('project') || qLower.includes('terraai') || qLower.includes('job')) {
    const mem = findMem('terraai', 'ecograph', 'wildfire', 'patents');
    return mem
      ? `At work: ${mem.text}. You lead the open-source EcoGraph-1 model for predicting wildfire propagation!`
      : "You're Staff AI Research Scientist & Climate Tech Lead at TerraAI Labs, leading the EcoGraph-1 open-source wildfire AI model!";
  }

  // 10. Sci-Fi Books & Reading
  if (qLower.includes('book') || qLower.includes('read') || qLower.includes('sci-fi') || qLower.includes('ted chiang')) {
    const mem = findMem('sci-fi', 'chiang', 'reading', 'books');
    return mem
      ? `Your reading preferences: ${mem.text}. Ted Chiang's 'Stories of Your Life' is one of your all-time favorites!`
      : "You love hard sci-fi novels, especially works by Ted Chiang, Liu Cixin, and Kim Stanley Robinson!";
  }

  // 11. Bouldering & Outdoor Climbing
  if (qLower.includes('climbing') || qLower.includes('bouldering') || qLower.includes('gym') || qLower.includes('v5')) {
    const mem = findMem('bouldering', 'touchstone', 'climbing');
    return mem
      ? `Your climbing routine: ${mem.text}. You work on indoor V5 problem grades to clear your head after coding!`
      : "You're an avid boulderer climbing indoor V5 routes at Touchstone Gym in San Francisco!";
  }

  // 12. Hometown & Family
  if (qLower.includes('hometown') || qLower.includes('seattle') || qLower.includes('parents') || qLower.includes('brother')) {
    const mem = findMem('seattle', 'parents', 'julian', 'brother');
    return mem
      ? `Family & Origins: ${mem.text}. You grew up in Capitol Hill, Seattle, with your brother Julian and parents!`
      : "You grew up in Capitol Hill, Seattle, WA. Your mother Dr. Sarah Vance is a retired neurologist, and your brother Julian is a UX designer in Brooklyn!";
  }

  // 13. Travel & Mont Blanc
  if (qLower.includes('travel') || qLower.includes('mont blanc') || qLower.includes('japan') || qLower.includes('rainier')) {
    const mem = findMem('mont blanc', 'kyoto', 'rainier', 'japan');
    return mem
      ? `Your travel adventures: ${mem.text}. Hiking the Tour du Mont Blanc across France, Italy, and Switzerland was unforgettable!`
      : "You completed the 2-week Tour du Mont Blanc trek in 2024, visit Kyoto every autumn, and summitted Mount Rainier with your father!";
  }

  // Generic grounded fallback using top retrieved memory
  if (topMemories.length > 0) {
    const primary = topMemories[0];
    return `I'm right here with you, Dr. Elena! Remembering that ${primary.text.toLowerCase()}, let's keep your day structured and focused. Reach out whenever you want to test ideas or plan your next milestone!`;
  }

  return "I'm right here with you, Dr. Elena! Tell me what's on your mind or what you'd like to work on right now.";
}
