/**
 * @fileoverview
 * Ambient module augmentation for the custom Vitest matcher `toBeAccessible`.
 * Import the setup file
 * `@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup`
 * in your test setup to register the matcher at runtime and include these types.
 */

import 'vitest';

/**
 * Options object accepted by the accessibility matcher.
 * This is intentionally generic so the underlying engine can evolve
 * without a breaking public API. Keys/values are implementation-defined.
 *
 * @example
 * await expect(container).toBeAccessible({
 *   rules: { 'color-contrast': { enabled: false } },
 *   runOnly: ['wcag2a', 'wcag2aa'],
 * });
 */
export interface HtmlA11yOptions {
  /** Arbitrary engine-specific options (e.g., rules, tags, runOnly, selectors). */
  [key: string]: unknown;
}

declare module 'vitest' {
  interface Assertion<T = any> {
    /**
     * Assert that a DOM container (Element/Document/DocumentFragment)
     * has no accessibility violations, as determined by the toolkit’s
     * internal engine.
     *
     * The matcher is registered by importing:
     * `@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup`
     * in your test setup file.
     *
     * @param options Optional engine-specific configuration (see {@link HtmlA11yOptions}).
     * @returns A promise that resolves when the assertion completes.
     *
     * @example
     * const { container } = render(<Button />);
     * await expect(container).toBeAccessible();
     *
     * @example
     * await expect(container).toBeAccessible({
     *   rules: { 'color-contrast': { enabled: false } },
     * });
     */
    toBeAccessible(options?: HtmlA11yOptions): Promise<void>;
  }

  interface AsymmetricMatchersContaining {
    /**
     * Asymmetric form of {@link Assertion.toBeAccessible}.
     * Useful with `.not` and partial matching expressions.
     *
     * @param options Optional engine-specific configuration.
     */
    toBeAccessible(options?: HtmlA11yOptions): Promise<void>;
  }
}
