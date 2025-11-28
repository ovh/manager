import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as useProjectsModule from '@/data/hooks/useProjects';
import { TProject } from '@/types/pci-common.types';
import { createWrapper } from '@/wrapperRenders';

import * as useEditProjectModule from '../../useEditProject';
import GeneralInformationSection from '../GeneralInformationSection';

type ApiError = AxiosError<{ message: string }>;

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables input and checkbox in discovery mode', () => {
    vi.spyOn(useProjectsModule, 'useIsDefaultProject').mockReturnValue({
      data: false,
      isLoading: false,
    } as UseQueryResult<boolean, Error>);
    vi.spyOn(useEditProjectModule, 'useEditProject').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as EditMutation);

    const { container } = render(
      <GeneralInformationSection isDiscovery={true} project={mockProject} />,
      {
        wrapper: createWrapper(),
      },
    );

    const input = container.querySelector('ods-input');
    const checkbox = screen.getByTestId('checkbox_default-project');
    const button = screen.getByTestId('button_edit-project');

    expect(input).toHaveAttribute('is-readonly', 'true');
    expect(checkbox).toHaveAttribute('is-disabled', 'true');
    expect(checkbox).toHaveAttribute('is-checked', 'false');
    expect(button).toHaveAttribute('is-disabled', 'true');
  });

  it('shows error if description is empty and disables submit', () => {
    vi.spyOn(useProjectsModule, 'useIsDefaultProject').mockReturnValue({
      data: false,
      isLoading: false,
    } as UseQueryResult<boolean, Error>);
    vi.spyOn(useEditProjectModule, 'useEditProject').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as EditMutation);

    render(
      <GeneralInformationSection
        isDiscovery={false}
        project={{ ...mockProject, description: '' }}
      />,
      {
        wrapper: createWrapper(),
      },
    );

    const formFields = screen.getAllByTestId('ods-form-field');
    const button = screen.getByTestId('button_edit-project');

    // Check the first form field (description field) has the error
    expect(formFields[0]).toHaveAttribute('error', 'error_required_field');
    expect(button).toHaveAttribute('is-disabled', 'true');
  });

  it('enables submit when description is changed', async () => {
    vi.spyOn(useProjectsModule, 'useIsDefaultProject').mockReturnValue({
      data: false,
      isLoading: false,
    } as UseQueryResult<boolean, Error>);
    const mutate = vi.fn();
    vi.spyOn(useEditProjectModule, 'useEditProject').mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as EditMutation);

    const { container } = render(
      <GeneralInformationSection isDiscovery={false} project={mockProject} />,
      {
        wrapper: createWrapper(),
      },
    );

    const input = container.querySelector('ods-input');
    if (input) {
      const dispatchEventFn = input.dispatchEvent.bind(input) as unknown as (
        event: Event,
      ) => boolean;
      dispatchEventFn(new CustomEvent('odsChange', { detail: { value: 'New Description' } }));
    }

    await waitFor(() =>
      expect(screen.getByTestId('button_edit-project')).toHaveAttribute('is-disabled', 'false'),
    );

    const button = screen.getByTestId('button_edit-project');
    fireEvent.click(button);
    expect(mutate).toHaveBeenCalled();
  });

  it('shows loading on submit', () => {
    vi.spyOn(useProjectsModule, 'useIsDefaultProject').mockReturnValue({
      data: false,
      isLoading: false,
    } as UseQueryResult<boolean, Error>);
    const mutate = vi.fn();
    vi.spyOn(useEditProjectModule, 'useEditProject').mockReturnValue({
      mutate,
      isPending: true,
    } as unknown as EditMutation);

    render(<GeneralInformationSection isDiscovery={false} project={mockProject} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByTestId('button_edit-project');
    expect(button).toHaveAttribute('is-loading', 'true');
  });
});
