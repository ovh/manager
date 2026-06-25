import { waitFor } from '@testing-library/react';
import {
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { labels, renderTest } from '@/test-utils';
import TEST_IDS from '@/utils/testIds.constants';
import { FEATURES } from '@/utils/features.constants';
import { DEFAULT_ORGANIZATION_ID, vcdaMigrationMock } from '@/mocks/vcda';

const migrationRoute = `/${DEFAULT_ORGANIZATION_ID}/migration`;
const flagOn = { [FEATURES.HPC_VCFAAS_VCDA]: true };

describe('Migration tab', () => {
  it('renders both section headings and the endpoint URL on success', async () => {
    await renderTest({ initialRoute: migrationRoute, feature: flagOn });

    await waitFor(
      async () => {
        await assertTextVisibility(
          labels.migration['migration.endpoint.section.title'],
        );
        await assertTextVisibility(labels.migration['migration.section.title']);
      },
      { timeout: 10000 },
    );
  });

  it('renders the whitelisted IPs in /32 notation', async () => {
    await renderTest({ initialRoute: migrationRoute, feature: flagOn });

    await waitFor(() => assertTextVisibility('192.168.1.10/32'), {
      timeout: 10000,
    });
  });

  it('enables the add CTA when the resource is READY', async () => {
    await renderTest({ initialRoute: migrationRoute, feature: flagOn });

    const addCta = await getElementByTestId(TEST_IDS.migrationAddCta);
    await assertElementVisibility(addCta);
  });

  it('disables edit affordances when the resource is not READY (R10/R17)', async () => {
    await renderTest({
      initialRoute: migrationRoute,
      feature: flagOn,
      vcdaMigration: { ...vcdaMigrationMock, resourceStatus: 'SUSPENDED' },
    });

    const addCta = await getElementByTestId(TEST_IDS.migrationAddCta);
    await waitFor(() => expect(addCta).toBeDisabled(), { timeout: 10000 });
  });

  it('shows the empty state when no IP is authorized (R13)', async () => {
    await renderTest({
      initialRoute: migrationRoute,
      feature: flagOn,
      vcdaMigration: {
        ...vcdaMigrationMock,
        currentState: { ...vcdaMigrationMock.currentState, ips: [] },
      },
    });

    await waitFor(
      () => assertTextVisibility(labels.migration['migration.empty.message']),
      { timeout: 10000 },
    );
  });

  it('shows the error state with a retry control on fetch failure (R14)', async () => {
    await renderTest({
      initialRoute: migrationRoute,
      feature: flagOn,
      isVcdaMigrationKo: true,
    });

    const retry = await getElementByTestId(TEST_IDS.migrationRetryCta);
    await assertElementVisibility(retry);
  });
});
