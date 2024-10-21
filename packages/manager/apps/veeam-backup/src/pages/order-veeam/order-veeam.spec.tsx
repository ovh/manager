import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderTest, labels, waitForOptions } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';

describe('order', () => {
  it('go to order step 1 from listing', async () => {
    await renderTest();

    let orderButton: HTMLElement;

    await waitFor(() => {
      orderButton = screen.getByText(labels.listing.order_button);
      return expect(orderButton).toBeEnabled();
    }, waitForOptions);

    await waitFor(() => userEvent.click(orderButton));

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      waitForOptions,
    );
  });

  it('go to order step 2', async () => {
    await renderTest({ initialRoute: urls.orderVeeam });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      waitForOptions,
    );

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.orderVeeam.next_step)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.choose_org_title),
        ).toBeInTheDocument(),
      waitForOptions,
    );
  });

  it('display all orgs backed-up message in step 2', async () => {
    await renderTest({ allOrgsBackedUp: true, initialRoute: urls.orderVeeam });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      waitForOptions,
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
      waitForOptions,
    );
  });

  it('display empty org message in step 2', async () => {
    await renderTest({ nbOrganization: 0, initialRoute: urls.orderVeeam });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      waitForOptions,
    );

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.orderVeeam.next_step)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.common.no_organization_message, {
            exact: false,
          }),
        ).toBeInTheDocument(),
      waitForOptions,
    );
  });
});
