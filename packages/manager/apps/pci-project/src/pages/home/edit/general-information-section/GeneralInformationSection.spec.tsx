/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '@ovh-ux/manager-core-api';
import { TProject } from '@ovh-ux/manager-pci-common';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';
import * as useProjectsModule from '@/data/hooks/useProjects';
import * as useEditProjectModule from '../useEditProject';
import GeneralInformationSection from './GeneralInformationSection';

const mockProject: TProject = {
  access: 'full',
  creationDate: '2023-01-01',
  description: 'Test Project',
  expiration: null,
  iam: { displayName: 'Test', id: 'iam-1', urn: 'urn', tags: {} },
  manualQuota: false,
  orderId: 123,
  planCode: 'plan',
  projectName: 'Test Project',
  project_id: 'project-1',
  status: 'ok',
  unleash: false,
};

type EditMutation = UseMutationResult<
  void,
  ApiError,
  {
    description: string;
    isDefault: boolean;
    isDescriptionChanged: boolean;
    isDefaultPropertyChanged: boolean;
  },
  unknown
>;

describe('GeneralInformationSection', () => {
  it('disables input and checkbox in discovery mode', async () => {
    vi.spyOn(useProjectsModule, 'useIsDefaultProject').mockReturnValue({
      data: false,
      isLoading: false,
    } as UseQueryResult<boolean, Error>);
    vi.spyOn(useEditProjectModule, 'useEditProject').mockReturnValue(({
      mutate: vi.fn(),
      isPending: false,
    } as unknown) as EditMutation);

    render(
      <GeneralInformationSection isDiscovery={true} project={mockProject} />,
      {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      },
    );

    const input = screen.getByTestId('ods-input');
    const checkbox = screen.getByTestId('checkbox_default-project');
    const button = screen.getByTestId('button_edit-project');

    expect(input).toHaveAttribute('data-readonly', 'true');
    expect(checkbox).toHaveAttribute('data-disabled', 'true');
    expect(checkbox).toHaveAttribute('data-checked', 'false');
    expect(button).toBeDisabled();
  });

  it('shows error if description is empty and disables submit', async () => {
    vi.spyOn(useProjectsModule, 'useIsDefaultProject').mockReturnValue({
      data: false,
      isLoading: false,
    } as UseQueryResult<boolean, Error>);
    vi.spyOn(useEditProjectModule, 'useEditProject').mockReturnValue(({
      mutate: vi.fn(),
      isPending: false,
    } as unknown) as EditMutation);

    render(
      <GeneralInformationSection
        isDiscovery={false}
        project={{ ...mockProject, description: '' }}
      />,
      {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      },
    );

    const formFieldWithError = document.querySelector(
      'ods-form-field[error="error_required_field"]',
    );
    const button = screen.getByTestId('button_edit-project');

    expect(formFieldWithError).toHaveAttribute('error', 'error_required_field');
    expect(button).toBeDisabled();
  });

  it('enables submit when description is changed', async () => {
    vi.spyOn(useProjectsModule, 'useIsDefaultProject').mockReturnValue({
      data: false,
      isLoading: false,
    } as UseQueryResult<boolean, Error>);
    const mutate = vi.fn();
    vi.spyOn(useEditProjectModule, 'useEditProject').mockReturnValue(({
      mutate,
      isPending: false,
    } as unknown) as EditMutation);

    render(
      <GeneralInformationSection isDiscovery={false} project={mockProject} />,
      {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      },
    );

    const input = screen.getByTestId('ods-input');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'New Description' } });
    });

    await waitFor(() =>
      expect(screen.getByTestId('button_edit-project')).not.toBeDisabled(),
    );

    const button = screen.getByTestId('button_edit-project');
    fireEvent.click(button);
    expect(mutate).toHaveBeenCalled();
  });

  it('shows loading on submit', async () => {
    vi.spyOn(useProjectsModule, 'useIsDefaultProject').mockReturnValue({
      data: false,
      isLoading: false,
    } as UseQueryResult<boolean, Error>);
    const mutate = vi.fn();
    vi.spyOn(useEditProjectModule, 'useEditProject').mockReturnValue(({
      mutate,
      isPending: true,
    } as unknown) as EditMutation);

    render(
      <GeneralInformationSection isDiscovery={false} project={mockProject} />,
      {
        wrapper: createOptimalWrapper({ routing: true, shell: true }),
      },
    );

    const button = screen.getByTestId('button_edit-project');
    expect(button).toHaveAttribute('data-loading', 'true');
  });
});
