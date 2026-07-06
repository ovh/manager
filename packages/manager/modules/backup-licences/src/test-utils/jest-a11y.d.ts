declare global {
  namespace jest {
    interface Matchers<R = unknown> {
      /**
       * TODO: look for a better solution, maybe in the manager-test-setup.
       * Prevent error: `Property 'toBeAccessible' does not exist on type 'JestMatchers<HTMLElement>'`
       */
      toBeAccessible(options?: Record<string, unknown>): Promise<R>;
    }
  }
}

export {};
