// Replace "/" with "~" in the path to ensure it is URL-safe
// "~" is a forbidden character in secret paths in the KMS API
// This is more reliable than using encodeURIComponent
// as the manager automatically replaces "%2F" with "/" and redirects
export const encodeSecretPath = (path: string): string => {
  return path.replace(/\//g, '~');
};

export const decodeSecretPath = (path: string): string => {
  return path.replace(/~/g, '/');
};
