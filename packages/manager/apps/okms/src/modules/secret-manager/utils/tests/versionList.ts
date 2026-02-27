import { versionListMock } from '@secret-manager/mocks/versions/versions.mock';
import { VERSION_LIST_CELL_TEST_IDS } from '@secret-manager/pages/secret/version-list/VersionCells.constants';
import { screen, waitFor } from '@testing-library/react';

import { labels } from '@/common/utils/tests/init.i18n';
import { TIMEOUT } from '@/common/utils/tests/uiTestHelpers';
import { assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';

export const assertVersionDatagridVisilibity = async (timeout = TIMEOUT.LONG) => {
  // assert datagrid column visiblity
  await assertTextVisibility(labels.secretManager.version, timeout);
  await assertTextVisibility(labels.common.status.status, timeout);
  await assertTextVisibility(labels.common.dashboard.creation_date, timeout);
  await assertTextVisibility(labels.secretManager.expiration_date, timeout);

  // assert we display versions rows
  for (const version of versionListMock) {
    await waitFor(
      () => {
        expect(screen.getByTestId(VERSION_LIST_CELL_TEST_IDS.version(version))).toBeInTheDocument();
      },
      { timeout },
    );
  }
};
