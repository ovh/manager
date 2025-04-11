import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import EmailAccountSettingsLayout from '../EmailAccountSettings.layout';

describe('email account settings layout', () => {
  it('should have the correct tabs', () => {
    const { getByTestId } = render(<EmailAccountSettingsLayout />);

    expect(getByTestId('settings')).toBeInTheDocument();
    expect(getByTestId('alias')).toBeInTheDocument();
  });
});
