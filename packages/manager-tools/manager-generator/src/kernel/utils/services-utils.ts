import { ServiceOperations } from '../types/api-types';
import { MethodGroup, OperationItem } from '../types/inquiries-types';
import { normalizePath } from './paths-utils';
import { readOptionalString } from './value-utils';

/**
 * Fallback function name derivation when Swagger lacks one.
 *
 * Strategy:
 * - Prefix with HTTP method
 * - First path segment lowercased
 * - Remaining segments TitleCased
 * - Append "List" if response type suggests an array
 *
 * @param method HTTP method string
 * @param apiPath API path string (e.g., "/cloud/project")
 * @param responseType Optional response type string
 * @returns Derived function name
 */
function serviceFallbackFunctionName(
  method: string,
  apiPath: string,
  responseType?: string,
): string {
  const m = (method || 'GET').toLowerCase();

  const segs = apiPath
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.replace(/[{}]/g, ''))
    .map((seg) => seg.replace(/[^a-zA-Z0-9]/g, ''));

  if (segs.length === 0) return m;

  const first = segs?.[0]?.toLowerCase() || '';
  const rest = segs.slice(1).map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ''));

  let name = m + first + rest.join('');

  if (responseType && /\[\]\s*$/.test(responseType)) {
    name += 'List';
  }

  return name;
}

/**
 * Convert Swagger service entries into a {@link MethodGroup}.
 *
 * - Keeps full API paths (no brace-trimming)
 * - Includes GET operations only
 * - Uses Swagger-provided names when possible, else falls back
 *
 * @param services Array of Swagger service definitions
 * @returns A MethodGroup with collected GET operations
 */
// eslint-disable-next-line complexity
export function servicesToMethodGroup(services: ServiceOperations[]): MethodGroup {
  const opList: OperationItem[] = [];

  for (const svc of services) {
    const basePathRaw = svc.path;
    const apiPathForDisplay = normalizePath(basePathRaw, { braceAware: false });

    const ops = svc.operations ?? [];
    for (const op of ops) {
      const opRec = op as unknown as Record<string, unknown>;

      const methodCandidate =
        (typeof op.method === 'string' ? op.method : undefined) ??
        readOptionalString(opRec, 'httpMethod') ??
        readOptionalString(opRec, 'type');
      const methodRaw = (methodCandidate ?? 'GET').toUpperCase();
      if (methodRaw !== 'GET') continue;

      const opApiPathField = readOptionalString(opRec, 'apiPath');
      const opUrlField = readOptionalString(opRec, 'url');
      const opPathField = readOptionalString(opRec, 'path');

      const urlAsPath =
        opUrlField && opUrlField.trim()
          ? opUrlField?.split?.('?')?.[0]?.replace?.(/\$\{params\.([a-zA-Z0-9_]+)\}/g, '{$1}')
          : undefined;

      const rawOpPath =
        opApiPathField?.trim() || urlAsPath?.trim() || opPathField?.trim() || apiPathForDisplay;

      const fullPath = normalizePath(rawOpPath, { braceAware: false });

      const nickname = readOptionalString(opRec, 'nickname');
      const operationId = readOptionalString(opRec, 'operationId');
      const providedFn = readOptionalString(opRec, 'functionName');
      const responseType = readOptionalString(opRec, 'responseType');

      const functionName =
        providedFn ??
        nickname ??
        operationId ??
        serviceFallbackFunctionName(methodRaw, fullPath, responseType);

      opList.push({ apiPath: fullPath, functionName });
    }
  }

  return { get: { operationList: opList } };
}
