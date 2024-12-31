import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import Auth from './Auth.page';
import * as authApi from '@/data/api/ai/authorization.api';
import * as ProjectAPI from '@/data/api/project/project.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedAuthorization } from '@/__tests__/helpers/mocks/authorization';
import { mockedPciProject } from '@/__tests__/helpers/mocks/project';
import { PlanCode } from '@/types/cloud/Project';

const mockedUsedNavigate = vi.fn();
describe('Auth behavior page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/data/api/ai/authorization.api', () => ({
      getAuthorization: vi.fn(() => mockedAuthorization),
      postAuthorization: vi.fn(() => mockedAuthorization),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => mockedPciProject),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the auth Page', async () => {
    render(<Auth />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('auth-page-container')).toBeInTheDocument();
      expect(screen.getByTestId('activate-project-button')).toBeInTheDocument();
    });
  });
  it('renders the onboarding Page on activation', async () => {
    render(<Auth />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('auth-page-container')).toBeInTheDocument();
      expect(screen.getByTestId('activate-project-button')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('activate-project-button'));
    });
    await waitFor(() => {
      expect(authApi.postAuthorization).toHaveBeenCalled();
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../');
    });
  });
  it('renders Auth with discovery banner', async () => {
    const mockedDiscoveryProject = {
      ...mockedPciProject,
      planCode: PlanCode.DISCOVERY,
    };
    vi.mocked(ProjectAPI.getProject).mockResolvedValue(mockedDiscoveryProject);
    render(<Auth />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('discovery-container')).toBeInTheDocument();
    });
  });
});
