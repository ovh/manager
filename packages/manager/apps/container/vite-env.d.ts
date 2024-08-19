// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare const __VERSION__: string;
// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare const __REGION__: string;

declare global {
  interface Window {
    elqwebtrigger: any;
    surveyLanguage: string;
  }
  const __REGION__: string;
  const __VERSION__: string;
}

export {}