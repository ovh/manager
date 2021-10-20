export {};
declare global {
  interface Navigator {
    userLanguage?: string;
    browserLanguage?: string;
    languages: readonly string[];
    language: string;
  }
}
