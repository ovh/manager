import { getElementByTestId } from '@ovh-ux/manager-core-test-utils';
import { renderTest } from '@/test-utils';
import TEST_IDS from '@/utils/testIds.constants';
import { FEATURES } from '@/utils/features.constants';
import { DEFAULT_ORGANIZATION_ID } from '@/mocks/vcda';

const termsRoute = `/${DEFAULT_ORGANIZATION_ID}/migration/order-migration/terms`;
const flagOn = { [FEATURES.HPC_VCFAAS_VCDA]: true };

describe('Migration — order contracts/terms step', () => {
  // Deep-linking the navigable step with no prepared cart resolves back to the
  // order page so the user completes the IP first — it never shows the CGV modal.
  it('falls back to the order page on a direct deep-link without a prepared cart', async () => {
    await renderTest({ initialRoute: termsRoute, feature: flagOn });

    const submit = await getElementByTestId(TEST_IDS.migrationOrderSubmitCta);
    expect(submit).toBeInTheDocument();

    expect(
      document.querySelector(
        `[data-testid="${TEST_IDS.migrationOrderTermsModal}"]`,
      ),
    ).not.toBeInTheDocument();
  });
});
