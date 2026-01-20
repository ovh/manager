import { vi } from 'vitest';

export const mockedUsedNavigate = vi.fn();
let mockedParams: Record<string, string | undefined> = {
  projectId: 'projectId',
};
let mockedSearchParams: URLSearchParams = new URLSearchParams();

export function setMockedSearchParams(params: Record<string, string>) {
  mockedSearchParams = new URLSearchParams(params);
}

export function setMockedUseParams(
  next: Record<string, string | undefined>,
  mode: 'merge' | 'replace' = 'merge',
) {
  mockedParams =
    mode === 'replace' ? { ...next } : { ...mockedParams, ...next };
}

export function resetMockedUseParams() {
  mockedParams = { projectId: 'projectId' };
}

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => mockedParams,
    useNavigate: () => mockedUsedNavigate,
    useSearchParams: () => [mockedSearchParams || new URLSearchParams()],
  };
});
