import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderTest, labels } from '../../test-helpers';
import '@testing-library/jest-dom';
import { urls } from '@/routes/routes.constant';

describe('order', () => {
  it('go to order step 1 from listing', async () => {
    await renderTest();

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.listing.order_button)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      { timeout: 30000 },
    );
  });

  it('go to order step 2', async () => {
    await renderTest({ initialRoute: urls.orderVeeam });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      { timeout: 30000 },
    );

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.orderVeeam.next_step)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.choose_org_title),
        ).toBeInTheDocument(),
      { timeout: 30000 },
    );
  });

  it('display all orgs backed-up message in step 2', async () => {
    await renderTest({ allOrgsBackedUp: true });

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.listing.order_button)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      { timeout: 30000 },
    );

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.orderVeeam.next_step)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.orderVeeam.all_organization_backed_up_message,
          ),
        ).toBeInTheDocument(),
      { timeout: 30000 },
    );
  });

  it('display empty org message in step 2', async () => {
    await renderTest({ nbOrganization: 0 });

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.listing.order_button)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      { timeout: 30000 },
    );

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.orderVeeam.next_step)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.common.no_organization_message),
        ).toBeInTheDocument(),
      { timeout: 30000 },
    );
  });
});
