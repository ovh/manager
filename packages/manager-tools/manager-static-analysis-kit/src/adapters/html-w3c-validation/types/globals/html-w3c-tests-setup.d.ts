import "vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    /**
     * Assert that a string of HTML is valid according to the W3C Nu Html Checker.
     *
     * @example
     * ```ts
     * await expect("<!doctype html><html><head></head><body></body></html>").toBeValidHtml();
     * ```
     */
    toBeValidHtml(): Promise<void>;
  }

  interface AsymmetricMatchersContaining {
    toBeValidHtml(): Promise<void>;
  }
}
