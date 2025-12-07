// Simple profanity filter with common offensive words
const profanityList = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'bastard', 'dick', 'cock',
  'pussy', 'cunt', 'whore', 'slut', 'fag', 'nigger', 'retard', 'kill yourself',
  'kys', 'suicide', 'rape', 'molest', 'pedo', 'nazi', 'hitler'
];

export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return profanityList.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

export function filterProfanity(text: string): string {
  let filtered = text;
  profanityList.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
}

// Spam detection patterns
const spamPatterns = [
  /(.)\1{4,}/i, // Repeated characters
  /(https?:\/\/[^\s]+)/gi, // URLs
  /\b(buy|click|free|winner|lottery|prize)\b/gi, // Spam keywords
];

export function isSpam(text: string): boolean {
  // Check for repeated patterns
  if (spamPatterns.some(pattern => pattern.test(text))) {
    return true;
  }
  
  // Check for all caps
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
  if (letterCount > 10 && upperCount / letterCount > 0.7) {
    return true;
  }
  
  return false;
}
