import { makeClient } from '@/data/api/commons/Client.api';
import { OnboardingConfigType } from '@/types/Onboarding.type';

/**
 * Retrieves the onboarding configuration for the application,
 * using the API flavor defined in {@link APP_FEATURES.onboardingApi}.
 *
 * This function delegates to {@link makeClient} and selects between
 * mock or live mode based on the `VITE_DATA_MODE` environment variable.
 *
 * In mock mode, the client returns the static {@link ONBOARDING_CONFIG}
 * value defined in `App.constants.ts`. In live mode, it will call the
 * appropriate onboarding endpoint for the configured API flavor.
 *
 * @returns A Promise that resolves to an {@link OnboardingConfigType} object
 * containing product information, links, and onboarding tiles.
 *
 * @example
 * ```ts
 * const config = await getOnboardingConfig();
 * console.log(config.productName); // "Your Product"
 * ```
 */
export function getOnboardingConfig(): Promise<OnboardingConfigType> {
  const client = makeClient({
    dataMode: import.meta.env.VITE_DATA_MODE === 'live' ? 'live' : 'mock',
  });

  return client.getOnboardingConfig<OnboardingConfigType>();
}
