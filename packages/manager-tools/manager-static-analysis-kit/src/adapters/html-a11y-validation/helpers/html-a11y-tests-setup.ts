import axe, { type AxeResults, type RunOptions } from 'axe-core';
import { expect } from 'vitest';

/**
 * The exact "context" type accepted by the underlying a11y engine.
 * Derived from `axe.run` so we never use `any`.
 *
 * @internal
 */
type AxeContext = Parameters<typeof axe.run>[0];

/**
 * NodeType constants used for lightweight DOM narrowing.
 *
 * @internal
 */
const NODE = { ELEMENT: 1, DOCUMENT: 9, FRAGMENT: 11 } as const;

/**
 * Ensure the current test DOM environment is supported.
 * Some lightweight DOMs (e.g. `happy-dom`) are not compatible with the engine.
 *
 * @throws {Error} If the environment is not supported.
 */
function assertSupportedDomEnv(): void {
  const ua =
    typeof navigator !== 'undefined' && navigator.userAgent
      ? navigator.userAgent.toLowerCase()
      : '';
  if (ua.includes('happy-dom')) {
    throw new Error(
      '[a11y] The test DOM environment is not supported. Please use the "jsdom" environment.',
    );
  }
}

/**
 * Predicate: is the value a DOM node the engine can analyze?
 */
function isDomNode(x: unknown): x is Element | Document | DocumentFragment {
  return typeof x === 'object' && x !== null && 'nodeType' in (x as Record<string, unknown>);
}

/**
 * Predicate: Element node.
 */
function isElement(x: unknown): x is Element {
  return isDomNode(x) && (x as { nodeType: number }).nodeType === NODE.ELEMENT;
}

/**
 * Predicate: Document node.
 */
function isDocument(x: unknown): x is Document {
  return isDomNode(x) && (x as { nodeType: number }).nodeType === NODE.DOCUMENT;
}

/**
 * Predicate: DocumentFragment node.
 */
function isFragment(x: unknown): x is DocumentFragment {
  return isDomNode(x) && (x as { nodeType: number }).nodeType === NODE.FRAGMENT;
}

/**
 * Convert an `Element` / `Document` / `DocumentFragment` into an engine-compatible context.
 * - `Element` and `Document` are passed through directly.
 * - `DocumentFragment` is converted to `{ include: Element[] }` using its element children.
 *
 * @param target The rendered container (from RTL) or any DOM root to validate.
 * @returns A value matching the first parameter of `axe.run`.
 */
function toAxeContext(target: Element | Document | DocumentFragment): AxeContext {
  if (isElement(target) || isDocument(target)) {
    return target as AxeContext;
  }
  if (isFragment(target)) {
    // Collect element children to form a valid include-context
    const elements = Array.from(target.childNodes).filter(
      (n): n is Element => (n as { nodeType: number }).nodeType === NODE.ELEMENT,
    );
    if (elements.length > 0) {
      return { include: elements } as AxeContext;
    }
    // Fallback: include the fragment itself (accepted by jsdom)
    return { include: [target as unknown as Element] } as AxeContext;
  }
  // Should not happen due to guards, but keeps types satisfied
  return target as unknown as AxeContext;
}

/**
 * Run the accessibility engine on a DOM container with strict typing.
 *
 * @param target Container to validate (Element / Document / DocumentFragment).
 * @param options Optional engine run options (rules, tags, etc.).
 * @returns Full `AxeResults` with any violations discovered.
 */
async function runA11y(
  target: Element | Document | DocumentFragment,
  options?: RunOptions,
): Promise<AxeResults> {
  const context = toAxeContext(target);
  // When a context is provided, axe types expect a concrete RunOptions object
  const opts: RunOptions = options ?? {};
  return axe.run(context, opts);
}

/**
 * Format the engine’s violations into a readable, diff-like message
 * highlighting the rule, targets, and a brief failure summary with a help URL.
 *
 * @param results The `AxeResults` returned by the engine.
 * @returns Human-readable string; empty when there are no violations.
 */
function formatViolations(results: AxeResults): string {
  const { violations } = results;
  if (!violations.length) return '';
  return violations
    .map((v) => {
      const where = v.nodes
        .map(
          (n) => `  - ${n.target.join(' ')}${n.failureSummary ? `\n    ${n.failureSummary}` : ''}`,
        )
        .join('\n');
      return `[${v.id}] ${v.help}\n${where}\nMore: ${v.helpUrl}`;
    })
    .join('\n\n');
}

/**
 * Register a matcher to assert that a DOM container has no accessibility violations.
 *
 * ## Usage
 * ```ts
 * const { container } = render(<Component />);
 * await expect(container).toBeAccessible();
 * ```
 *
 * ## With options (engine-specific)
 * ```ts
 * await expect(container).toBeAccessible({
 *   rules: { 'color-contrast': { enabled: false } },
 * });
 * ```
 *
 * The matcher targets the rendered DOM container (Element/Document/Fragment)
 * and is designed for **jsdom-based** React Testing Library tests.
 */
expect.extend({
  async toBeAccessible(received: unknown, options?: RunOptions) {
    assertSupportedDomEnv();

    if (!isDomNode(received)) {
      return {
        pass: false,
        message: () =>
          'toBeAccessible(): expected an Element/Document/DocumentFragment (e.g., RTL container).',
      };
    }

    const results = await runA11y(received, options);
    const pass = results.violations.length === 0;

    return {
      pass,
      message: () =>
        pass
          ? 'expected container NOT to be accessible, but no violations were found'
          : `Accessibility violations found (${results.violations.length}):\n\n${formatViolations(results)}`,
    };
  },
});
