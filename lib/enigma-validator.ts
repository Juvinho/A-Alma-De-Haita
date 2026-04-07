/**
 * Utility for validating puzzle answers with tolerance
 * Supports accent removal, case normalization, and Levenshtein distance
 */

const PORTUGUESE_ARTICLES = ['a', 'o', 'os', 'as', 'um', 'uma', 'uns', 'umas'];

/**
 * Remove diacritical marks from string
 * Converts "café" to "cafe", "ação" to "acao", etc.
 */
function removeDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Calculate Levenshtein distance between two strings
 * Returns the minimum number of single-character edits (insert, delete, substitute)
 * needed to transform one string into another
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array.from({ length: len2 + 1 }, () =>
    Array(len1 + 1).fill(0)
  );

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let i = 0; i <= len2; i++) matrix[i][0] = i;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[len2][len1];
}

/**
 * Remove leading Portuguese articles and extra whitespace
 * Examples: "a casa" -> "casa", "o gato" -> "gato"
 */
function removeLeadingArticles(str: string): string {
  const words = str.trim().split(/\s+/);
  if (words.length === 0) return '';

  const firstWord = words[0].toLowerCase();
  if (PORTUGUESE_ARTICLES.includes(firstWord)) {
    return words.slice(1).join(' ').trim();
  }

  return str.trim();
}

/**
 * Normalize answer for comparison
 * 1. Trim whitespace
 * 2. Remove leading Portuguese articles
 * 3. Remove diacritics and convert to lowercase
 * 4. Remove punctuation
 */
function normalizeAnswer(answer: string): string {
  let normalized = answer.trim();

  // Remove leading articles
  normalized = removeLeadingArticles(normalized);

  // Remove diacritics and lowercase
  normalized = removeDiacritics(normalized);

  // Remove punctuation
  normalized = normalized.replace(/[.,!?;:]/g, '').trim();

  return normalized;
}

export interface ValidateAnswerResult {
  correct: boolean;
  normalized: string;
  matchType: 'exact' | 'fuzzy' | 'none';
}

/**
 * Validate answer with tolerance
 *
 * @param input - User's input
 * @param correctAnswer - Expected answer
 * @param alternatives - Alternative acceptable answers
 * @returns Object with validation result
 *
 * Edge cases handled:
 * - "café" matches "cafe"
 * - "o gato" matches "gato"
 * - "Gato" matches "gato"
 * - "animl" matches "animal" (1 char difference on 6+ length)
 * - "ca" matches "cat" (less than 6 chars: exact match only)
 * - "  spaces  " matches "spaces"
 */
export function validateAnswer(
  input: string,
  correctAnswer: string,
  alternatives: string[] = []
): ValidateAnswerResult {
  const normalizedInput = normalizeAnswer(input);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  const normalizedAlternatives = alternatives.map(normalizeAnswer);

  // Exact match
  if (normalizedInput === normalizedCorrect) {
    return {
      correct: true,
      normalized: normalizedInput,
      matchType: 'exact',
    };
  }

  // Check alternatives for exact match
  if (normalizedAlternatives.includes(normalizedInput)) {
    return {
      correct: true,
      normalized: normalizedInput,
      matchType: 'exact',
    };
  }

  // Fuzzy matching: Levenshtein distance tolerance
  // Only for answers with 6+ characters
  if (normalizedInput.length >= 6 && normalizedCorrect.length >= 6) {
    const distance = levenshteinDistance(normalizedInput, normalizedCorrect);
    if (distance <= 1) {
      return {
        correct: true,
        normalized: normalizedInput,
        matchType: 'fuzzy',
      };
    }
  }

  // Check alternatives for fuzzy match
  if (normalizedInput.length >= 6) {
    for (const alt of normalizedAlternatives) {
      if (alt.length >= 6) {
        const distance = levenshteinDistance(normalizedInput, alt);
        if (distance <= 1) {
          return {
            correct: true,
            normalized: normalizedInput,
            matchType: 'fuzzy',
          };
        }
      }
    }
  }

  return {
    correct: false,
    normalized: normalizedInput,
    matchType: 'none',
  };
}

/* ========== EDGE CASE TESTS (for documentation) ==========

// Diacritical marks
validateAnswer("café", "cafe") // ✓ true (exact after diacritic removal)
validateAnswer("ação", "acao") // ✓ true

// Article handling
validateAnswer("o gato", "gato") // ✓ true (exact after article removal)
validateAnswer("um enigma", "enigma") // ✓ true
validateAnswer("as águias", "aguias") // ✓ true

// Case insensitivity
validateAnswer("GATO", "gato") // ✓ true (exact)
validateAnswer("GaTo", "gato") // ✓ true (exact)

// Whitespace normalization
validateAnswer("  gato  ", "gato") // ✓ true (exact)
validateAnswer("gato   com", "gato com") // ✓ true (exact)

// Levenshtein distance (6+ characters only)
validateAnswer("animal", "animl") // ✓ true (1 char diff, 6 chars)
validateAnswer("secret", "serect") // ✓ true (1 char transposition, 6 chars)
validateAnswer("cat", "bat") // ✗ false (3-char word, no fuzzy)
validateAnswer("catzzz", "bat") // ✗ false (too many differences)

// Punctuation removal
validateAnswer("gato.", "gato") // ✓ true (exact after punctuation removal)
validateAnswer("Gato?", "gato") // ✓ true

// No match
validateAnswer("xyz", "gato") // ✗ false
validateAnswer("completlyWrong", "answer") // ✗ false

================================================== */