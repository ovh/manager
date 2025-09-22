import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { OdsInputValueChangeEventDetail, OsdsInput } from '@ovhcloud/ods-components';

import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

import RenameClusterPage from './RenameCluster.page';

type UseRenameClusterReturnType = UseMutationResult<never, Error, void, unknown> & {
  renameCluster: () => void;
};

describe('RenameClusterPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<RenameClusterPage />, { wrapper });
    expect(getByTestId('renameCluster-spinner')).toBeVisible();
  });

  it('renders rename cluster content when data is available', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<RenameClusterPage />, { wrapper });
    expect(getByTestId('renameCluster-input_name')).toBeInTheDocument();
  });

  it('displays error message when name input is invalid with wrong pattern and too long', () => {
    const { getByTestId } = render(<RenameClusterPage />, {
      wrapper,
    });
    const renameInput = getByTestId('renameCluster-input_name') as unknown as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('renameCluster-input_name'), {
        target: { value: 'INVALID_NAME' },
      });
      renameInput.odsValueChange.emit({
        value: 'INVALID_NAME_$$$$_TOOOOOOOOOOOO_LLLONNNNNNNNNG_NAMMMMMMMMMMMMMMME',
      } as OdsInputValueChangeEventDetail);
      fireEvent.blur(getByTestId('renameCluster-input_name'));
      renameInput.odsInputBlur.emit();
    });
    expect(getByTestId('renameCluster-formfield')).toHaveAttribute(
      'error',
      'pci_projects_project_kubernetes_details_service_name_input_pattern_validation_error',
    );
  });

  it('enables submit button when name input is valid', () => {
    const { getByTestId } = render(<RenameClusterPage />, { wrapper });
    const renameInput = getByTestId('renameCluster-input_name') as unknown as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('renameCluster-input_name'), {
        target: { value: 'VALID_NAME' },
      });
      renameInput.odsValueChange.emit({
        value: 'VALID_NAME',
      } as OdsInputValueChangeEventDetail);
    });
    expect(getByTestId('renameCluster-button_submit')).not.toBeDisabled();
  });

  it('calls renameCluster on submit button click', () => {
    const mockRenameCluster = vi.fn();
    vi.spyOn(useKubernetesModule, 'useRenameKubernetesCluster').mockReturnValue({
      renameCluster: mockRenameCluster,
      isPending: false,
    } as unknown as UseRenameClusterReturnType);
    const { getByTestId } = render(<RenameClusterPage />, { wrapper });
    const renameInput = getByTestId('renameCluster-input_name') as unknown as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('renameCluster-input_name'), {
        target: { value: 'VALID_NAME' },
      });
      renameInput.odsValueChange.emit({
        value: 'VALID_NAME',
      } as OdsInputValueChangeEventDetail);
    });
    fireEvent.click(getByTestId('renameCluster-button_submit'));
    expect(mockRenameCluster).toHaveBeenCalled();
  });

  it('disables submit button when rename is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<RenameClusterPage />, { wrapper });
    expect(getByTestId('renameCluster-button_submit')).toBeDisabled();
  });
});
