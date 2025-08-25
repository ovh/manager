import React from 'react';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render, waitFor } from '@/utils/test.provider';

import UpgradeAccount from './Upgrade.page';

describe('upgrade account page', () => {
  it('should render page correctly', async () => {
    const { getByTestId, queryByTestId } = render(<UpgradeAccount />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('upgrade-account-page')).toHaveTextContent(
      commonTranslation.upgrade_account_pro,
    );
  });
});
