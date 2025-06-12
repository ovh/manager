import { useSearchParams } from 'react-router-dom';
import { PCI_FEATURES_STATES, TFeatureStateDetail } from '@/constants';

export type TTarget = {
  category?: string;
  state?: string;
  [key: string]: Record<string, string> | string | undefined;
};

export type TRedirectTarget = {
  isRedirectRequired: boolean;
  redirectTargetParams: Record<string, string>;
  featureState: TFeatureStateDetail | undefined;
};

/**
 * Custom hook that determines redirect behavior based on URL search parameters.
 *
 * Parses the 'target' search parameter as JSON to extract category and state information,
 * then validates these against the PCI_FEATURES_STATES configuration to determine
 * if a redirect is required and provides utilities for handling redirect parameters.
 *
 * @returns {TRedirectTarget} An object containing:
 *   - `isRedirectRequired`: Boolean indicating if redirect should occur based on feature state existence
 *   - `redirectTargetParams`: Additional parameters to be used in the redirect, derived from the target object
 *   - `featureState`: The resolved feature state from PCI_FEATURES_STATES, or undefined if not found
 *
 * @example
 * ```typescript
 * const { isRedirectRequired, redirectTargetParams, featureState } = useRedirectTarget();
 *
 * if (isRedirectRequired) {
 *   const params = redirectTargetParams('someKey');
 *   // Handle redirect logic
 * }
 * ```
 *
 * @remarks
 * - Returns safe defaults with `isRedirectRequired: false` if JSON parsing fails or required fields are missing
 * - Category and state values are converted to uppercase for matching against PCI_FEATURES_STATES
 */
export default (): TRedirectTarget => {
  const [searchParams] = useSearchParams();

  try {
    const redirectTarget = JSON.parse(
      searchParams.get('target') || '{}',
    ) as TTarget;

    const { category, state } = redirectTarget;

    const upperCategory = category?.toUpperCase() as
      | keyof typeof PCI_FEATURES_STATES
      | undefined;
    const upperState = state?.toUpperCase() as
      | keyof typeof PCI_FEATURES_STATES[keyof typeof PCI_FEATURES_STATES]
      | undefined;

    if (!upperCategory || !upperState) {
      return {
        isRedirectRequired: false,
        redirectTargetParams: {},
        featureState: undefined,
      };
    }

    const featureState = (PCI_FEATURES_STATES[upperCategory] || {})[upperState];

    return {
      isRedirectRequired: !!featureState, // If the feature exists, redirect is required
      redirectTargetParams: featureState
        ? (featureState.targetParamKeys || ['params']).reduce(
            (params, targetKey) => ({
              ...params,
              ...(typeof redirectTarget[targetKey] === 'object' &&
              redirectTarget[targetKey] !== null
                ? (redirectTarget[targetKey] as Record<string, string>)
                : {}),
            }),
            {},
          )
        : {},
      featureState,
    };
  } catch (error) {
    return {
      isRedirectRequired: false,
      redirectTargetParams: {},
      featureState: undefined,
    };
  }
};
