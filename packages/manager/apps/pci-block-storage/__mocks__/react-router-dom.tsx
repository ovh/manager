import { vi } from 'vitest';

export * from 'react-router-dom';

export const useMatches = vi.fn(() => [{}]);

export const useParams = vi.fn(() => ({
  projectId: 'my-project-id',
}));

export const useHref = vi.fn((path) => path);

export const useHistory = vi.fn((path) => path);

export const Navigate = vi.fn(() => <></>);

export const useNavigate = vi.fn().mockReturnValue(vi.fn());

export const useRouteLoaderData = vi.fn();
