import { redirect } from 'react-router-dom';
import { vi } from 'vitest';
import { Loader } from './Root.page';

// Mock de la fonction `redirect`
vi.mock('react-router-dom', () => ({
  redirect: vi.fn(),
}));

describe('Loader Component', () => {
  it('fetches project data', async () => {
    const params = {
      params: {
        projectId: 'projectId',
      },
    };
    Loader(params);
    expect(redirect).toHaveBeenCalledWith(
      '/pci/projects/projectId/ai-ml/dashboard',
    );
  });
});
