import { act, fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import TerminatePage from './Terminate.page';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { wrapper } from '@/wrapperRenders';
import { TKube } from '@/types';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({
    addError: vi.fn(),
    addSuccess: vi.fn(),
  }),
}));

type UseTerminateClusterReturnType = UseMutationResult<
  never,
  Error,
  void,
  unknown
> & { terminateCluster: () => void };

describe('TerminatePage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<TerminatePage />, { wrapper });
    expect(getByTestId('terminate-spinner')).toBeVisible();
  });

  it('renders terminate page content when data is available', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TKube>);
    const { getByText } = render(<TerminatePage />, { wrapper });
    expect(getByText('kube_service_terminate_description')).toBeInTheDocument();
  });

  it('enables submit button when input is correct', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<TerminatePage />, { wrapper });
    const terminateInput = getByTestId('terminate-input');
    act(() => {
      fireEvent.change(terminateInput, {
        target: { value: 'TERMINATE' },
      });
      ((terminateInput as unknown) as OsdsInput).odsValueChange.emit({
        value: 'TERMINATE',
      } as OdsInputValueChangeEventDetail);
    });
    expect(getByTestId('terminate-button_submit')).not.toBeDisabled();
  });

  it('calls terminateCluster on submit button click', () => {
    const mockTerminateCluster = vi.fn();
    vi.spyOn(useKubernetesModule, 'useTerminateCluster').mockReturnValue(({
      terminateCluster: mockTerminateCluster,
      isPending: false,
    } as unknown) as UseTerminateClusterReturnType);
    const { getByTestId } = render(<TerminatePage />, { wrapper });
    const terminateInput = getByTestId('terminate-input');
    act(() => {
      fireEvent.change(terminateInput, {
        target: { value: 'TERMINATE' },
      });
      ((terminateInput as unknown) as OsdsInput).odsValueChange.emit({
        value: 'TERMINATE',
      } as OdsInputValueChangeEventDetail);
    });
    fireEvent.click(getByTestId('terminate-button_submit'));
    expect(mockTerminateCluster).toHaveBeenCalled();
  });

  it('disables submit button when termination is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<TerminatePage />, { wrapper });
    expect(getByTestId('terminate-button_submit')).toBeDisabled();
  });
});
