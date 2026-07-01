import { waitFor, screen } from '@testing-library/react';
import { getElementByTestId } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '@/test-utils';
import TEST_IDS from '@/utils/testIds.constants';
import { FEATURES } from '@/utils/features.constants';
import { DEFAULT_ORGANIZATION_ID } from '@/mocks/vcda';

const addRoute = `/${DEFAULT_ORGANIZATION_ID}/migration/add-ip`;
const flagOn = { [FEATURES.HPC_VCFAAS_VCDA]: true };

describe('Migration — Add IP modal', () => {
  it('opens the add modal with a CIDR field and submit CTA (R6/R7)', async () => {
    await renderTest({ initialRoute: addRoute, feature: flagOn });

    await waitFor(
      () => screen.getByText(labels.migration['migration.addModal.title']),
      { timeout: 10000 },
    );

    expect(
      document.getElementById('migration-add-ip-input'),
    ).toBeInTheDocument();
    const submit = await getElementByTestId(TEST_IDS.migrationAddSubmitCta);
    expect(submit).toBeInTheDocument();
  });
});
