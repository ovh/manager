import { act, render, renderHook, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import Description from './Description.component';

describe('Description  Component', () => {
  it('should emit the correct event on selection change', async () => {
    const { result } = renderHook(() =>
      useForm({
        defaultValues: {
          authorization: [],
          description: '',
        },
      }),
    );

    const { getByTestId } = render(
      <FormProvider {...result.current}>
        <Description />
      </FormProvider>,
    );
    const input = (getByTestId('input-description') as unknown) as OsdsInput;

    await act(() =>
      input.odsValueChange.emit({
        value: 'test',
      } as OdsInputValueChangeEventDetail),
    );

    await waitFor(() => {
      expect(result.current.getValues('description')).toEqual('test');
    });
  });
});
