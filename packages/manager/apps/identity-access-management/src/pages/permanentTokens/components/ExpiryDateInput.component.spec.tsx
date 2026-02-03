import React, { PropsWithChildren } from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ExpiryDateInput from '@/pages/permanentTokens/components/ExpiryDateInput.component';
import { ExpiryDateModel, ExpiryMode } from '@/types/expiryDate';

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual: typeof import('@ovhcloud/ods-components/react') = await importOriginal();
  return {
    ...actual,
    OdsFormField: ({ children, ...props }: PropsWithChildren) => (
      <div data-testid="ods-form-field" {...props}>
        {children}
      </div>
    ),
    OdsSelect: ({
      value,
      onOdsChange,
      children,
      ...props
    }: PropsWithChildren<{
      value: string;
      onOdsChange: (value: unknown) => unknown;
    }>) => (
      <select
        data-testid="ods-select"
        value={value}
        onChange={(e) => onOdsChange({ detail: { value: e.target.value } })}
        {...props}
      >
        {children}
      </select>
    ),
    OdsRadio: ({ ...props }) => (
      <input type="radio" onChange={props.onOdsChange} {...props} />
    ),
  };
});

describe('ExpiryDateInput', () => {
  it('should update model', () => {
    const model: ExpiryDateModel = {
      active: true,
      mode: ExpiryMode.DATE,
      expiresAt: new Date('2025-06-11T00:00:00+02:00'),
      expiresIn: 123,
    };
    const setModelSpy = vi.fn();
    const { getByText, getByTestId } = render(
      <ExpiryDateInput model={model} setModel={setModelSpy} />,
    );
    fireEvent.click(getByTestId('expiryDateType-duration'));

    expect(
      getByText('iam_user_token_modal_field_expiry_date_label'),
    ).toBeVisible();
    expect(setModelSpy).toHaveBeenCalledWith({
      active: true,
      mode: ExpiryMode.DURATION,
      expiresAt: new Date('2025-06-11T00:00:00+02:00'),
      expiresIn: 123,
    });
  });
});
