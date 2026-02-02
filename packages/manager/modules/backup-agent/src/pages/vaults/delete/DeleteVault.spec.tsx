import { screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';
import { VaultResource } from '@/types/Vault.type';
import { buildSearchQuery } from '@/utils/buildSearchQuery.utils';

const config = {
  vault: mockVaults.at(0) as VaultResource,
  waitForPageLoad: async () =>
    waitFor(
      () => expect(screen.getByText(labels.vaultDelete.delete_vault_modal_title)).toBeVisible(),
      { timeout: 10_000 },
    ),
};

describe('[INTEGRATION] - Delete Vault page', () => {
  it('display delete vault modal', async () => {
    const initialRoute = `/vaults/delete${buildSearchQuery({ vaultId: config.vault?.id })}`;
    await renderTest({ initialRoute });
    await config.waitForPageLoad();

    // check modal
    const modal = screen.getByTestId('modal');
    expect(modal).toBeVisible();
    expect(modal).toHaveAttribute('color', ODS_MODAL_COLOR.critical);

    // and modal content
    const modalElements = [
      labels.vaultDelete.delete_vault_modal_title,
      ...labels.vaultDelete.unable_to_delete_vault_feature_unavailable.split('\n'),
      labels.vaultDelete.delete_vault_modal_content.replace(
        '{{vaultName}}',
        config.vault?.currentState.resourceName,
      ),
    ];

    await waitFor(
      () =>
        modalElements
          // eslint-disable-next-line max-nested-callbacks
          .forEach((el) => expect(screen.getByText(new RegExp(el))).toBeVisible()),
      { timeout: 5_000 },
    );

    // and modal buttons
    const modalButtons = [
      { testId: 'primary-button', label: labels.actions.confirm },
      { testId: 'secondary-button', label: labels.actions.cancel },
    ];
    modalButtons.forEach(({ testId, label }) =>
      expect(screen.getByTestId(testId)).toHaveAttribute('label', label),
    );
  });
});
