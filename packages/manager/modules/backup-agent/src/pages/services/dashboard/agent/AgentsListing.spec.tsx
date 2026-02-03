import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { urls } from '@/routes/routes.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';

const checkAllColumnsAreDisplayed = () => {
  const COLUMNS_NAME = [
    labels.commonDashboard.name,
    labels.status.status,
    labels.common.server,
    labels.system.address_ip,
    labels.common.policy,
    labels.region.localisation,
  ];

  COLUMNS_NAME.forEach((columnName) =>
    expect(screen.getByRole('columnheader', { name: columnName })).toBeVisible(),
  );
};

/* eslint-disable vitest/expect-expect */
describe('[INTEGRATION] - Agent listing page', () => {
  it('display datagrid', async () => {
    // when
    await renderTest({ initialRoute: urls.dashboardAgents });

    await waitFor(() => checkAllColumnsAreDisplayed());
  });
});
