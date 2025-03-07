import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';

describe('order', () => {
  it('go to order step 1 from listing', async () => {
    await renderTest();

    let orderButton: HTMLElement;

    await waitFor(() => {
      orderButton = screen.getByText(labels.listing.order_button);
      return expect(orderButton).toBeEnabled();
    }, WAIT_FOR_DEFAULT_OPTIONS);

    await waitFor(() => userEvent.click(orderButton));

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('cannot go to step 2 if catalog is KO', async () => {
    const { container } = await renderTest({
      initialRoute: urls.orderVeeam,
      isCatalogKo: true,
    });

    await getButtonByLabel({
      container,
      label: labels.orderVeeam.next_step,
      disabled: true,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.orderVeeam.catalog_error.replace('{{error}}', ''),
            { exact: false },
          ),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('go to order step 2', async () => {
    const { container } = await renderTest({ initialRoute: urls.orderVeeam });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    const nextButton = await getButtonByLabel({
      container,
      label: labels.orderVeeam.next_step,
    });
    await waitFor(() => userEvent.click(nextButton));

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.choose_org_title),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('display all orgs backed-up message in step 2', async () => {
    const { container } = await renderTest({
      allOrgsBackedUp: true,
      initialRoute: urls.orderVeeam,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    const nextButton = await getButtonByLabel({
      container,
      label: labels.orderVeeam.next_step,
    });
    await waitFor(() => userEvent.click(nextButton));

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.orderVeeam.all_organization_backed_up_message,
          ),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('display empty org message in step 2', async () => {
    const { container } = await renderTest({
      nbOrganization: 0,
      initialRoute: urls.orderVeeam,
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.description),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    const nextButton = await getButtonByLabel({
      container,
      label: labels.orderVeeam.next_step,
    });
    await waitFor(() => userEvent.click(nextButton));

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.common.no_organization_message, {
            exact: false,
          }),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
