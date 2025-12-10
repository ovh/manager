import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import {
  ODS_ICON_NAME,
  OdsInput,
  OdsInputChangeEventDetail,
} from '@ovhcloud/ods-components';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { EditInline, EditInlineProps } from './edit-inline.component';
import { getButtonByIcon } from '@/test-utils';

/** RENDER */
const renderComponent = (params: EditInlineProps, value: string) => {
  return render(<EditInline {...params}>{value}</EditInline>);
};

describe('EditInline Component', async () => {
  it('Should edit value', async () => {
    const spy = vi.fn();
    const { getByText, container, getByTestId } = renderComponent(
      { onConfirm: spy, name: 'test', defaultValue: 'test-value' },
      'test-value',
    );

    const editButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.pen,
    });

    await waitFor(() => {
      expect(getByText('test-value')).toBeDefined();
    });

    await act(() => {
      fireEvent.click(editButton);
    });

    const submitButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.check,
    });

    const editInput = (getByTestId('edit-inline-input') as unknown) as OdsInput;

    act(() => {
      editInput.odsChange.emit({
        value: 'test-value-2',
      } as OdsInputChangeEventDetail);
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        expect(spy).toHaveBeenCalledWith('test-value-2');
      },
      { ...WAIT_FOR_DEFAULT_OPTIONS },
    );
  });
});
