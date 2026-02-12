import { spawn } from 'node:child_process';
import type { Readable } from 'node:stream';
import vnu from 'vnu-jar';

import { HtmlW3CValidationResult } from '../types/HtmlW3CValidator';

type RunResult = { code: number; stdout: string; stderr: string };

let _javaChecked = false;

/**
 * Ensure a Java runtime is available (called once).
 * Produces a friendly error message if not found.
 */
async function ensureJava(): Promise<void> {
  if (_javaChecked) return;
  await new Promise<void>((resolve, reject) => {
    const child = spawn('java', ['-version'], { stdio: ['ignore', 'ignore', 'ignore'] });
    child.once('error', () =>
      reject(new Error('Java runtime not found. Install a JRE/JDK and ensure `java` is on PATH.')),
    );
    child.once('close', () => resolve());
  });
  _javaChecked = true;
}

/**
 * Run `java` with the given args, optionally piping `input` to stdin,
 * collecting UTF-8 `stdout` and `stderr`, and enforcing a timeout.
 *
 * @param args Java CLI arguments (e.g., ["-jar", vnu, "--stdout", "--errors-only", "-"])
 * @param input Optional string to write to stdin (for "-" mode)
 * @param timeoutMs Process timeout (defaults 60s)
 * @returns Exit code and stdio text
 */
function runJava(args: string[], input?: string, timeoutMs = 60_000): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn('java', args, {
      shell: false, // safer: no shell concatenation/quoting issues
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    const out: Readable | null = child.stdout;
    const err: Readable | null = child.stderr;

    if (out) {
      out.setEncoding('utf8');
      out.on('data', (chunk: string) => {
        stdout += chunk;
      });
    }
    if (err) {
      err.setEncoding('utf8');
      err.on('data', (chunk: string) => {
        stderr += chunk;
      });
    }

    child.on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut && code !== 0) {
        resolve({ code: code ?? 124, stdout, stderr: stderr || 'Validation timed out (java).' });
      } else {
        resolve({ code: code ?? 0, stdout, stderr });
      }
    });

    if (input != null && child.stdin) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
}

/** Merge default flags with user options (deduped, keep user order last). */
function buildArgs(extra: string[]): string[] {
  const base = ['--stdout', '--errors-only'];
  const seen = new Set<string>();
  return [...base, ...extra].filter((flag) => {
    const key = flag.toLowerCase();
    const has = seen.has(key);
    seen.add(key);
    return !has;
  });
}

/**
 * Validate an **HTML file** with the W3C Nu Html Checker (`vnu-jar`).
 *
 * @param filePath Absolute or relative path to an `.html` file.
 * @param options Additional CLI flags for vnu (e.g., `--format json`, `--filterfile <path>`).
 *                `--stdout` and `--errors-only` are included by default and deduped.
 * @returns `{ success, stdout, stderr }`
 */
export async function validateHtmlFile(
  filePath: string,
  options: string[] = [],
): Promise<HtmlW3CValidationResult> {
  await ensureJava();
  const args = ['-jar', vnu, ...buildArgs(options), filePath];

  const { code, stdout, stderr } = await runJava(args);
  return {
    success: code === 0,
    stdout,
    // vnu sometimes prints details to stdout even on error; surface something useful
    stderr: stderr || (code === 0 ? '' : stdout),
  };
}

/**
 * Validate an **HTML string** with the W3C Nu Html Checker (`vnu-jar`).
 * The HTML is piped to the checker via STDIN.
 *
 * @param html Raw HTML to validate.
 * @param options Additional CLI flags (see {@link validateHtmlFile}).
 * @returns `{ success, stdout, stderr }`
 */
export async function validateHtmlString(
  html: string,
  options: string[] = [],
): Promise<HtmlW3CValidationResult> {
  await ensureJava();
  const args = ['-jar', vnu, ...buildArgs(options), '-'];

  const { code, stdout, stderr } = await runJava(args, html);
  return {
    success: code === 0,
    stdout,
    stderr: stderr || (code === 0 ? '' : stdout),
  };
}
