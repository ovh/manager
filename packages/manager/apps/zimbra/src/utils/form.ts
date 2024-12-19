export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const ACCOUNT_REGEX = /^(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)(?:(?:[.|+])(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*))*$/;

export const PASSWORD_REGEX = /^(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*\d)(?=.*[A-Z])(?=(.*)).{10,64}$/;

export const OWNER_REGEX = /^[A-Za-z0-9]{2,20}$/;
