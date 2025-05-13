import { act, render, renderHook, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  OdsSelectValueChangeEventDetail,
  OsdsSelect,
} from '@ovhcloud/ods-components';
import Authorization from './Authorization.component';

describe('Authorization Component', () => {
  it('should emit the correct event on selection change', async () => {
    const { result } = renderHook(() =>
      useForm({
        defaultValues: {
          authorization: [],
        },
      }),
    );

    const { getByTestId } = render(
      <FormProvider {...result.current}>
        <Authorization />
      </FormProvider>,
    );
    const select = (getByTestId(
      'authorization-select',
    ) as unknown) as OsdsSelect;

    await act(() =>
      select.odsValueChange.emit({
        value: JSON.stringify(['REGISTRY']),
      } as OdsSelectValueChangeEventDetail),
    );

    await waitFor(() => {
      expect(result.current.getValues('authorization')).toEqual(['REGISTRY']);
    });
  });
});
