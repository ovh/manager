import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { describe, expect } from 'vitest';
import { render, waitFor } from '@/utils/test.provider';
import UpgradeAccount from './Upgrade.page';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

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
