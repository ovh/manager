import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Layout, { Loader } from '@/pages/Auth.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as authAPI from '@/data/api/ai/authorization.api';

const AuthLayoutProps = {
  params: {
    projectId: 'projectId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('Auth Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/data/api/ai/authorization.api', () => {
      return {
        getAuthorization: vi.fn(() => ({
          authorized: true,
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches project authorization', async () => {
    Loader(AuthLayoutProps);
    await waitFor(() => {
      expect(authAPI.getAuthorization).toHaveBeenCalled();
    });
  });

  it('renders the Layout component', async () => {
    render(<Layout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('/')).toBeTruthy();
    });
  });
});
