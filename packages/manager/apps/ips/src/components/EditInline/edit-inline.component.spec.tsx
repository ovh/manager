import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { EditInline } from './edit-inline.component';
import { getButtonByIcon } from '@/test-utils';

describe('EditInline Component', async () => {
  it('Should edit value', async () => {
    const spy = vi.fn();
    const { getByText, container, getByTestId } = render(
      <EditInline onConfirm={spy} name="test" defaultValue="test-value">
        {'test-value'}
      </EditInline>,
    );

    const editButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.pen,
    });

    await waitFor(() => {
      expect(getByText('test-value')).toBeDefined();
    }, WAIT_FOR_DEFAULT_OPTIONS);

    await waitFor(() => {
      fireEvent.click(editButton);
    }, WAIT_FOR_DEFAULT_OPTIONS);

    const submitButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.check,
    });

    const editInput = getByTestId('edit-inline-input') as HTMLElement;

    editButton.nodeValue = 'test-value-2';
    const event = new CustomEvent('odsChange', {
      detail: { value: 'test-value-2' },
    });

    await waitFor(() => fireEvent(editInput, event), WAIT_FOR_DEFAULT_OPTIONS);

    await waitFor(
      () => fireEvent.click(submitButton),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('test-value-2');
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });
});
