 
declare const __VERSION__: string;
 
declare const __REGION__: string;

declare global {
  interface Window {
    elqwebtrigger: any;
    surveyLanguage: string;
  }
  const __REGION__: string;
  const __VERSION__: string;

  interface ImportMetaEnv {
    /**
     * Stable-name CMP loader URL used on production hostnames. Both CMP
     * variables ship in the same build; the effective one is selected at
     * runtime from the hostname. Unset = CMP unavailable there, the legacy
     * consent modal takes over.
     */
    readonly VITE_CMP_LOADER_URL?: string;
    /** Stable-name CMP loader URL used on non-production hostnames. */
    readonly VITE_CMP_LOADER_URL_PREPROD?: string;
  }
}

export {}