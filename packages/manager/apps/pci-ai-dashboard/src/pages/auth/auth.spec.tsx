import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import Layout from '@/pages/Root.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as authAPI from '@/data/api/ai/authorization.api';
import { mockedAuthorization } from '@/__tests__/helpers/mocks/authorization';
import * as ai from '@/types/cloud/project/ai';

describe('Dashboard Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => ({
          project_id: '123456',
          projectName: 'projectName',
          description: 'description',
        })),
      };
    });
    vi.mock('@/data/api/ai/authorization.api', () => ({
      getAuthorization: vi.fn(() => mockedAuthorization),
      postAuthorization: vi.fn(() => mockedAuthorization),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Layout component and display auth page', async () => {
    const noAut: ai.AuthorizationStatus = {
      authorized: false,
    };
    vi.mocked(authAPI.getAuthorization).mockResolvedValueOnce(noAut);
    render(<Layout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('activate-project-button')).toBeInTheDocument();
      expect(screen.getByTestId('auth-page-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('activate-project-button'));
    });
    await waitFor(() => {
      expect(authAPI.postAuthorization).toHaveBeenCalled();
      expect(authAPI.getAuthorization).toHaveBeenCalled();
    });
  });
});
