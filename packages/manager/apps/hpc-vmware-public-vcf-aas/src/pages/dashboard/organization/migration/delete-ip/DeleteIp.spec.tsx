import { waitFor, screen } from '@testing-library/react';
import { getElementByTestId } from '@ovh-ux/manager-core-test-utils';
import { renderTest } from '@/test-utils';
import TEST_IDS from '@/utils/testIds.constants';
import { FEATURES } from '@/utils/features.constants';
import { DEFAULT_ORGANIZATION_ID } from '@/mocks/vcda';

const deleteRoute = `/${DEFAULT_ORGANIZATION_ID}/migration/delete-ip?ip=192.168.1.10`;
const flagOn = { [FEATURES.HPC_VCFAAS_VCDA]: true };

describe('Migration — Delete IP modal', () => {
  it('opens the confirmation modal highlighting the targeted IP (R10/R11)', async () => {
    await renderTest({ initialRoute: deleteRoute, feature: flagOn });

    await waitFor(
      () =>
        expect(screen.getAllByText('192.168.1.10/32').length).toBeGreaterThan(
          0,
        ),
      { timeout: 10000 },
    );

    const confirm = await getElementByTestId(TEST_IDS.migrationDeleteSubmitCta);
    expect(confirm).toBeInTheDocument();
  });
});
