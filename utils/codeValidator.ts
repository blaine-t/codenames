export function isValidGameCode(code: unknown): code is string {
    if (typeof code !== 'string') return false;
    return /^\d{4}$/.test(code);
  }