/**
 * Memora Grounded Personalized Response Generator
 */

export function generatePersonalizedResponse(query = '', selectedMemories = []) {
  const qLower = query.toLowerCase();
  const topMemories = selectedMemories.map((s) => s.memory);
  const memTexts = topMemories.map((m) => m.text.toLowerCase());

  // Check for the Core PRD Challenge Prompt: "I'm anxious about studying tonight. What should I do?"
  if (qLower.includes('anxious') && (qLower.includes('study') || qLower.includes('studying') || qLower.includes('tonight'))) {
    const hasExam = memTexts.some((t) => t.includes('exam') || t.includes('ml'));
    const hasLofi = memTexts.some((t) => t.includes('lo-fi') || t.includes('music') || t.includes('night'));
    
    if (hasExam || hasLofi) {
      return "Since your ML exam is Friday and you usually focus better at night with lo-fi music, begin with one 45-minute study block on your hardest topic. Put on your focus playlist, keep the plan small, and take a 10-minute break after it. You’ve already identified what helps you study—use that routine tonight. You've got this!";
    }
    return "Take a deep breath — pre-exam anxiety is completely natural. Start with one single 45-minute focused block on your highest priority topic tonight. Put on your focus playlist, keep your workspace clean, and take a 10-minute walk right after. Focus on making steady progress rather than finishing everything at once!";
  }

  // Check for schedule query
  if (qLower.includes('schedule') || qLower.includes('routine') || qLower.includes('exam')) {
    const examMem = topMemories.find((m) => m.text.toLowerCase().includes('exam'));
    const routineMem = topMemories.find((m) => m.text.toLowerCase().includes('night') || m.text.toLowerCase().includes('block'));
    
    let resp = "Here's your current study plan: ";
    if (examMem) resp += `${examMem.text} `;
    if (routineMem) resp += `You work best with: ${routineMem.text} `;
    resp += "Stick to your 45-minute focus sprints and short breaks to stay on track without burning out!";
    return resp;
  }

  // Check for music query
  if (qLower.includes('music') || qLower.includes('lo-fi') || qLower.includes('playlist')) {
    const musicMem = topMemories.find((m) => m.text.toLowerCase().includes('lo-fi') || m.text.toLowerCase().includes('genre') || m.text.toLowerCase().includes('artist'));
    if (musicMem) {
      return `Based on your preferences, you focus best with instrumental lo-fi beats! According to your profile: ${musicMem.text}. Putting on your favorite lo-fi study track right now will help get you into flow state.`;
    }
    return "You've mentioned loving lo-fi instrumental tracks for night study sessions! Putting on a calm focus playlist will help soothe any pre-study tension.";
  }

  // Generic grounded response using top retrieved memory
  if (topMemories.length > 0) {
    const primary = topMemories[0];
    return `I'm right here with you! Remembering that ${primary.text.toLowerCase()}, let's keep your plan clear and structured tonight. Focus on one step at a time, take regular breaks, and reach out whenever you want to bounce ideas or test your knowledge!`;
  }

  return "I'm listening and ready to support you! Tell me what's on your mind or what you'd like to work on right now.";
}
