import { waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getElementByTestId } from '@ovh-ux/manager-core-test-utils';
import { renderTest } from '@/test-utils';
import TEST_IDS from '@/utils/testIds.constants';
import { FEATURES } from '@/utils/features.constants';
import { DEFAULT_ORGANIZATION_ID, vcdaMigrationMock } from '@/mocks/vcda';

const dashboardRoute = `/${DEFAULT_ORGANIZATION_ID}`;
const flagOn = { [FEATURES.HPC_VCFAAS_VCDA]: true };

describe('VCDA — Service termination', () => {
  it('READY: Terminate CTA is enabled and opens the confirmation modal', async () => {
    await renderTest({
      initialRoute: dashboardRoute,
      feature: flagOn,
      vcdaMigration: vcdaMigrationMock, // READY
    });

    const cta = await getElementByTestId(TEST_IDS.migrationTerminateCta);
    expect(cta).not.toHaveAttribute('is-disabled', 'true');

    const user = userEvent.setup();
    await act(() => user.click(cta));

    const description = await getElementByTestId(
      TEST_IDS.migrationTerminateDescription,
    );
    expect(description).toBeInTheDocument();
  });

  it('non-READY (SUSPENDED): Terminate CTA is rendered but disabled', async () => {
    await renderTest({
      initialRoute: dashboardRoute,
      feature: flagOn,
      vcdaMigration: { ...vcdaMigrationMock, resourceStatus: 'SUSPENDED' },
    });

    const cta = await getElementByTestId(TEST_IDS.migrationTerminateCta);
    await waitFor(() =>
      expect(cta).toHaveAttribute('is-disabled', 'true'),
    );
  });

  const modalDescription = () =>
    document.querySelector(
      `[data-testid="${TEST_IDS.migrationTerminateDescription}"]`,
    );

  // `getServicesMocks` (wired in renderTest) mocks GET /services?resourceName= →
  // [serviceId] and POST /services/:id/terminate — `useDeleteService` resolves the
  // serviceId from the resourceName and terminates, so there is no extra mock to roll.
  it('confirming terminates the service and closes the modal on success', async () => {
    await renderTest({
      initialRoute: dashboardRoute,
      feature: flagOn,
      vcdaMigration: vcdaMigrationMock,
    });

    const user = userEvent.setup();
    const cta = await getElementByTestId(TEST_IDS.migrationTerminateCta);
    await act(() => user.click(cta));

    // The modal opens before useVcdaMigration settles, so Confirm starts disabled
    // (isLoading). Wait until the migration loads and Confirm is enabled.
    const confirm = await screen.findByTestId('manager-delete-modal-confirm');
    await waitFor(() => expect(confirm).not.toHaveAttribute('disabled'), {
      timeout: 10000,
    });
    await act(() => {
      confirm.click();
    });

    // onSuccess closes the modal (navigate back) — proves the terminate fired.
    await waitFor(() => expect(modalDescription()).not.toBeInTheDocument(), {
      timeout: 10000,
    });
  });

  it('keeps the modal open when termination fails', async () => {
    await renderTest({
      initialRoute: dashboardRoute,
      feature: flagOn,
      vcdaMigration: vcdaMigrationMock,
      deleteServicesKo: true,
    });

    const user = userEvent.setup();
    const cta = await getElementByTestId(TEST_IDS.migrationTerminateCta);
    await act(() => user.click(cta));

    const confirm = await screen.findByTestId('manager-delete-modal-confirm');
    await waitFor(() => expect(confirm).not.toHaveAttribute('disabled'), {
      timeout: 10000,
    });
    await act(() => {
      confirm.click();
    });

    // KO terminate → onSuccess never fires → the modal stays open for retry.
    await act(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    expect(modalDescription()).toBeInTheDocument();
  });
});
