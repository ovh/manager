import { vi } from 'vitest';

export const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
    }),
    useNavigate: () => mockedUsedNavigate,
  };
});
