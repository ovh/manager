import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { ActionsTile } from './ActionsTile.component';

const TEST_IDS = {
  showValue: 'show-value',
  createVersion: 'create-version',
  deleteSecret: 'delete-secret',
};

vi.mock('./items/ShowValueLink.component', async (original) => ({
  ...(await original()),
  ShowValueLink: vi.fn(() => <div data-testid={TEST_IDS.showValue} />),
}));

vi.mock('./items/CreateVersionLink.component', async (original) => ({
  ...(await original()),
  CreateVersionLink: vi.fn(() => <div data-testid={TEST_IDS.createVersion} />),
}));

vi.mock('./items/DeleteSecretLink.component', async (original) => ({
  ...(await original()),
  DeleteSecretLink: vi.fn(() => <div data-testid={TEST_IDS.deleteSecret} />),
}));

const renderTestComp = async () => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return render(<ActionsTile secret={mockSecret1} />, { wrapper });
};

describe('Actions tile test suite', () => {
  it('should display tile content', async () => {
    // GIVEN
    const tileItemsTestIds = [TEST_IDS.showValue, TEST_IDS.createVersion, TEST_IDS.deleteSecret];

    // WHEN
    await renderTestComp();

    // THEN
    expect(screen.getByText(labels.secretManager.actions)).toBeVisible();
    tileItemsTestIds.forEach((item) => {
      expect(screen.getByTestId(item)).toBeInTheDocument();
    });
  });
});
