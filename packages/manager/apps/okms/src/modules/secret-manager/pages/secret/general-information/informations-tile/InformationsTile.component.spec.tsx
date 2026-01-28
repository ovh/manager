import { secretListMock } from '@secret-manager/mocks/secrets/secrets.mock';
import { render, screen } from '@testing-library/react';
import { describe, vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { assertClipboardVisibility } from '@/common/utils/tests/uiTestHelpers';
import { PATH_LABEL, URN_LABEL } from '@/constants';

import { InformationsTile } from './InformationsTile.component';

const mockSecret = secretListMock[0];

if (!mockSecret) {
  throw new Error('Mock secret not found');
}

const mockFormatDate = vi.fn((date: string) => date);
vi.mock('@/common/hooks/useFormatDate', () => ({
  useFormatDate: () => ({
    formatDate: mockFormatDate,
  }),
}));

const renderComponent = async () => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return render(<InformationsTile secret={mockSecret} />, { wrapper });
};

describe('Secrets Informations Tile component tests suite', () => {
  test('Should display settings tile with all data', async () => {
    await renderComponent();

    const labelList = [
      labels.common.dashboard.general_information,
      PATH_LABEL,
      mockSecret.path,
      URN_LABEL,
      labels.common.dashboard.creation_date,
      mockSecret.metadata.createdAt,
      labels.secretManager.last_update,
      mockSecret?.metadata?.updatedAt ?? '-',
      labels.secretManager.current_version,
      mockSecret.metadata.currentVersion ?? '-',
    ];

    labelList.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });

    await assertClipboardVisibility(mockSecret.iam.urn);

    expect(mockFormatDate).toHaveBeenCalledWith(mockSecret.metadata.createdAt);
    expect(mockFormatDate).toHaveBeenCalledWith(mockSecret.metadata.updatedAt);
  });
});
