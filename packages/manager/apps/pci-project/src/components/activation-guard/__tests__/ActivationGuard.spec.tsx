import { Navigate } from 'react-router-dom';

import { UseQueryResult } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';

import { ResponseAPIError, TProject } from '@/types/pci-common.types';
import { createWrapper } from '@/wrapperRenders';

import ActivationGuard from '../ActivationGuard';

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual = (await importOriginal<
    typeof import('@ovh-ux/manager-pci-common')
  >()) as unknown as Record<string, unknown>;
  return {
    ...actual,
    useProject: vi.fn(),
    isDiscoveryProject: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    Navigate: vi.fn(() => null),
  };
});

vi.mock('@/pages/detail/activate/Activate.page', () => ({
  default: () => <div data-testid="activate-page">Activate Page</div>,
}));

describe('ActivationGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show spinner when project data is loading', () => {
    (useProject as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseQueryResult<TProject, ResponseAPIError>);

    render(<ActivationGuard />, { wrapper: createWrapper() });

    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('activate-page')).not.toBeInTheDocument();
  });

  it('should render ActivatePage when project is a discovery project', async () => {
    const discoveryProject = {
      project_id: 'test-project-id',
      planCode: 'project.discovery',
    } as TProject;

    (useProject as unknown as Mock).mockReturnValue({
      data: discoveryProject,
      isLoading: false,
    } as UseQueryResult<TProject, ResponseAPIError>);

    (isDiscoveryProject as unknown as Mock).mockReturnValue(true);

    render(<ActivationGuard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId('redirectionGuard_spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('activate-page')).toBeInTheDocument();
      expect(Navigate).not.toHaveBeenCalled();
    });
  });

  it('should redirect to parent route when project is already activated', () => {
    const activatedProject = {
      project_id: 'test-project-id',
      planCode: 'project.2018',
    } as TProject;

    (useProject as unknown as Mock).mockReturnValue({
      data: activatedProject,
      isLoading: false,
    } as UseQueryResult<TProject, ResponseAPIError>);

    (isDiscoveryProject as unknown as Mock).mockReturnValue(false);

    render(<ActivationGuard />, { wrapper: createWrapper() });

    expect(Navigate).toHaveBeenCalledWith({ to: '..' }, {});
  });

  it('should not redirect when project data is undefined', async () => {
    (useProject as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as UseQueryResult<TProject, ResponseAPIError>);

    render(<ActivationGuard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(Navigate).not.toHaveBeenCalled();
      expect(screen.getByTestId('activate-page')).toBeInTheDocument();
    });
  });
});
