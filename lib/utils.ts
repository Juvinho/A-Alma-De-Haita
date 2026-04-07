import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[.,!?;:]/g, '')        // remove punctuation
    .replace(/\s+/g, ' ');           // normalize spaces
}

export function checkAnswer(input: string, correct: string, alternatives: string[] = []): boolean {
  const norm = normalizeAnswer(input);
  const all = [correct, ...alternatives].map(normalizeAnswer);
  return all.includes(norm);
}

// Format countdown to target date
export function formatCountdown(target: Date): string {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return '00:00:00:00';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(days).padStart(3, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

// Varguën inauguration date: March 15, 2033
export const VARGUËN_DATE = new Date('2033-03-15T00:00:00');
