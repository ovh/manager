// Regular expression pattern for /24 subnet
export const pattern =
  '^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?).){2}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?).0/24$';

// The subnet address is limited to only "/24".
export const isValidCidr = (subnet: string): boolean => {
  return new RegExp(pattern).test(subnet);
};
