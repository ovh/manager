import { act, fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import DeletePage from '@/pages/delete/Delete.page';
import { wrapper } from '@/wrapperRenders';
import * as ApiRegistryModule from '@/api/hooks/useRegistry';
import { TRegistry } from '@/api/data/registry';

describe('DeletePage', () => {
  it('renders loading spinner while fetching registries', async () => {
    vi.spyOn(ApiRegistryModule, 'useGetAllRegistries').mockReturnValueOnce({
      data: null,
      isPending: true,
    } as UseQueryResult<TRegistry[]>);

    const { getByTestId } = render(<DeletePage />, { wrapper });

    expect(getByTestId('pciModal-spinner')).toBeInTheDocument();
  });

  it('disables submit button when confirmation text does not match', () => {
    vi.spyOn(ApiRegistryModule, 'useGetAllRegistries').mockReturnValueOnce({
      isPending: false,
    } as UseQueryResult<TRegistry[]>);

    const { getByTestId } = render(<DeletePage />, { wrapper });

    act(() => {
      fireEvent.change(getByTestId('delete-input'), {
        target: { value: 'WRONG' },
      });
      ((getByTestId(
        'delete-input',
      ) as unknown) as OsdsInput).odsValueChange.emit({
        value: 'WRONG',
      } as OdsInputValueChangeEventDetail);
    });

    expect(getByTestId('pciModal-button_submit')).toBeDisabled();
  });

  it('enables submit button when confirmation text matches', () => {
    vi.spyOn(ApiRegistryModule, 'useGetAllRegistries').mockReturnValueOnce({
      isPending: false,
    } as UseQueryResult<TRegistry[]>);

    const { getByTestId } = render(<DeletePage />, { wrapper });

    act(() => {
      fireEvent.change(getByTestId('delete-input'), {
        target: { value: 'DELETE' },
      });
      ((getByTestId(
        'delete-input',
      ) as unknown) as OsdsInput).odsValueChange.emit({
        value: 'DELETE',
      } as OdsInputValueChangeEventDetail);
    });

    expect(getByTestId('pciModal-button_submit')).not.toBeDisabled();
  });
});
