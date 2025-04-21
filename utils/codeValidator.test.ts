// __tests__/codeValidator.test.ts

import { isValidGameCode } from '../utils/codeValidator';

describe('isValidGameCode', () => {
  test('rejects non‑string values', () => {
    expect(isValidGameCode(1234 as any)).toBe(false);
  });

  test('rejects undefined', () => {
    expect(isValidGameCode(undefined)).toBe(false);
  });

  test('rejects null', () => {
    expect(isValidGameCode(null)).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isValidGameCode('')).toBe(false);
  });

  test('rejects too short codes', () => {
    expect(isValidGameCode('123')).toBe(false);
  });

  test('rejects too long codes', () => {
    expect(isValidGameCode('12345')).toBe(false);
  });

  test('rejects codes with letters', () => {
    expect(isValidGameCode('12a4')).toBe(false);
  });

  test('rejects codes with special characters', () => {
    expect(isValidGameCode('12-4')).toBe(false);
  });

  test('accepts exactly four digits', () => {
    expect(isValidGameCode('0000')).toBe(true);
  });

  test('accepts other valid numeric codes', () => {
    expect(isValidGameCode('9719')).toBe(true);
  });
});
