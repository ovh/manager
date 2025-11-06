import { screen, waitFor } from '@testing-library/react';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { versionListMock } from '@secret-manager/mocks/versions/versions.mock';
import { VERSION_LIST_CELL_TEST_IDS } from '@secret-manager/pages/secret/versionList/VersionCells.constants';
import { labels } from '@/utils/tests/init.i18n';

export const assertVersionDatagridVisilibity = async () => {
  // assert datagrid column visiblity
  await assertTextVisibility(labels.secretManager.version);
  await assertTextVisibility(labels.common.status.status);
  await assertTextVisibility(labels.common.dashboard.creation_date);
  await assertTextVisibility(labels.secretManager.expiration_date);

  // assert we display versions rows
  versionListMock.forEach(async (version) => {
    await waitFor(() => {
      expect(
        screen.getByTestId(VERSION_LIST_CELL_TEST_IDS.version(version)),
      ).toBeInTheDocument();
    });
  });
};
