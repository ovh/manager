import { execSync } from 'node:child_process';
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_PATH } from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';

/**
 * Executes a shell command synchronously and logs progress.
 *
 * Wraps Node’s `execSync()` to provide:
 * - Contextual logging (start/success/error).
 * - Project-aware working directory control.
 * - Clean CLI output inherited from the child process.
 *
 * @private
 * @param {string} cmd - The command to execute (e.g., `yarn lint:modern:fix`).
 * @param {string} cwd - Working directory for the command.
 * @param {string} desc - Human-readable description for logs.
 */
function runCommand(cmd, cwd, desc) {
  try {
    logger.info(`🔧 Running ${desc}...`);
    execSync(cmd, { stdio: 'inherit', cwd });
    logger.success(`✅ ${desc} completed successfully.`);
  } catch (err) {
    logger.error(`❌ ${desc} failed: ${err.message}`);
  }
}

/**
 * Run all post-update validation steps.
 *
 * Used after automated updates (e.g., component documentation sync)
 * to ensure the repository remains consistent and buildable.
 *
 * Steps performed:
 * 1. **Install dependencies** from the project root.
 * 2. **Run ESLint (modern)** to auto-fix lint issues.
 * 3. **Run unit tests** to validate component behavior.
 *
 * @example
 * await runPostUpdateChecks();
 *
 * @returns {void}
 */
export function runPostUpdateChecks() {
  const componentDir = MUK_COMPONENTS_PATH;
  const rootDir = path.resolve('.');

  runCommand('yarn install', rootDir, 'Dependency installation (root)');
  runCommand('yarn lint:modern:fix', componentDir, 'ESLint (modern mode)');
  runCommand('yarn test', componentDir, 'Unit tests');
}

/**
 * Creates an asynchronous, iterable queue that enables
 * communication between producers and consumers in streaming workflows.
 *
 * This is a core utility for bridging **callback-based producers**
 * (e.g., tarball extraction events) with **`for await...of` consumers**
 * (e.g., file writers or loggers).
 *
 * It ensures:
 * - ✅ Backpressure-safe processing (consumer controls flow).
 * - ✅ Constant memory footprint (only holds unconsumed items).
 * - ✅ Simple API: `push()`, `end()`, and async iteration.
 *
 * ---
 *
 * ## Example Usage
 *
 * ```js
 * const queue = createAsyncQueue();
 *
 * // Producer
 * (async () => {
 *   for (const item of data) await queue.push(item);
 *   queue.end();
 * })();
 *
 * // Consumer
 * for await (const item of queue) {
 *   console.log('Processing', item);
 * }
 * ```
 *
 * @returns {{
 *   push(item: any): Promise<void>,
 *   end(): void,
 *   [Symbol.asyncIterator](): AsyncGenerator
 * }}
 *  Queue interface with three operations:
 *  - `push(item)` → adds a new item.
 *  - `end()` → signals that no more items will be added.
 *  - async iteration (`for await`) → consumes items as they arrive.
 */
export function createAsyncQueue() {
  const items = [];
  let resolve;
  let done = false;

  return {
    /**
     * Push an item into the queue.
     * If a consumer is waiting, it resolves immediately.
     * @param {*} item - Any data or object to enqueue.
     */
    async push(item) {
      if (done) return;
      if (resolve) {
        resolve({ value: item, done: false });
        resolve = null;
      } else {
        items.push(item);
      }
    },

    /**
     * Mark the queue as complete.
     * Signals to the consumer that iteration should end.
     */
    end() {
      done = true;
      if (resolve) resolve({ value: undefined, done: true });
    },

    /**
     * Async iterator interface implementation.
     * Enables `for await...of` consumption.
     */
    [Symbol.asyncIterator]() {
      return {
        next() {
          if (items.length) return Promise.resolve({ value: items.shift(), done: false });
          if (done) return Promise.resolve({ value: undefined, done: true });
          return new Promise((res) => (resolve = res));
        },
      };
    },
  };
}

/**
 * Aggregates statistics from multiple synchronization operations.
 *
 * @param {Array<{created:number, updated:number, total:number}>} results
 * @returns {{created:number, updated:number, total:number}} Combined totals.
 */
export function aggregateOperationsStats(results) {
  return results.reduce(
    (acc, curr) => ({
      created: acc.created + (curr.created || 0),
      updated: acc.updated + (curr.updated || 0),
      total: acc.total + (curr.total || 0),
    }),
    { created: 0, updated: 0, total: 0 },
  );
}

/**
 * Executes a sync operation safely, with clear contextual logging.
 *
 * @async
 * @param {string} label - Descriptive name for the operation (e.g., "component base-docs").
 * @param {Function} syncFn - The synchronization function to execute.
 * @returns {Promise<{created:number, updated:number, total:number}>}
 * Returns counts even if the operation fails.
 */
export async function safeSync(label, syncFn) {
  try {
    logger.info(`${EMOJIS.info} Syncing ${label}...`);
    const result = (await syncFn()) || { created: 0, updated: 0, total: 0 };
    logger.info(`${EMOJIS.disk} ${label} → ${result.total} files processed.`);
    return result;
  } catch (error) {
    logger.error(`${EMOJIS.error} Failed to sync ${label}: ${error.message}`);
    return { created: 0, updated: 0, total: 0 };
  }
}
