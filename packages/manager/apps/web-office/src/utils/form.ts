export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*([~!$%^&*\-+_=|():;"'<>,.?]|\d))[a-zA-Z\d~!$%^&*\-+_=|():;"'<>,.?]+$/;

export const containsLowercase = (s: string) => !!(s && /[a-z]/.test(s));
export const containsUppercase = (s: string) => !!(s && /[A-Z]/.test(s));
export const containsDigit = (s: string) => !!(s && /\d/.test(s));
export const containsSpecial = (s: string) => !!(s && /[~!$%^&*-+_=|():;"'<>,.?]/.test(s));
