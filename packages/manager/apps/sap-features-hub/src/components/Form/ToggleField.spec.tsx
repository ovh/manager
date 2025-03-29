import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { ToggleField } from './ToggleField.component';
import { testIds } from '@/utils/testIds.constants';
import { FormKey } from '@/types/form.type';

describe('ToggleField component unit test suite', () => {
  it('should render field with right attributes and handle onOdsChange', () => {
    const testLabel = 'testLabel';
    const testName: FormKey = 'firewallService';
    const handleChange = vi.fn();

    // when
    const { getByText, getByTestId } = render(
      <ToggleField
        name={testName}
        label={testLabel}
        checked={true}
        onOdsChange={handleChange}
      />,
    );

    // then
    expect(getByText(testLabel)).toBeVisible();

    // and
    const toggle = getByTestId(testIds.toggleFieldInput);
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('id', `${testName}-toggle`);
    expect(toggle).toHaveAttribute('value', 'true');

    // and
    toggle.dispatchEvent(new CustomEvent('odsChange'));
    expect(handleChange).toHaveBeenCalled();
  });
});
