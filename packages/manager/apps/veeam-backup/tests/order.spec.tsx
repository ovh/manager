import userEvent from '@testing-library/user-event';
import { act, screen, waitFor } from '@testing-library/react';
import { setupTest, labels } from './helpers';
import '@testing-library/jest-dom';

describe('order', () => {
  it('go to order step 1 from listing', async () => {
    await setupTest();

    await act(() =>
      userEvent.click(screen.getByText(labels.listing.order_button)),
    );

    await waitFor(() =>
      expect(
        screen.getByText(labels.orderVeeam.description),
      ).toBeInTheDocument(),
    );
  });

  it('go to order step 2', async () => {
    await setupTest();

    await act(() =>
      userEvent.click(screen.getByText(labels.listing.order_button)),
    );

    await waitFor(() =>
      expect(
        screen.getByText(labels.orderVeeam.description),
      ).toBeInTheDocument(),
    );

    await act(() =>
      userEvent.click(screen.getByText(labels.orderVeeam.next_step)),
    );

    await waitFor(() =>
      expect(
        screen.getByText(labels.orderVeeam.choose_org_title),
      ).toBeInTheDocument(),
    );
  });

  it('display all orgs backed-up message in step 2', async () => {
    await setupTest({ allOrgsBackedUp: true });

    await act(() =>
      userEvent.click(screen.getByText(labels.listing.order_button)),
    );

    await waitFor(() =>
      expect(
        screen.getByText(labels.orderVeeam.description),
      ).toBeInTheDocument(),
    );

    await act(() =>
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
    await setupTest({ nbOrganization: 0 });

    await act(() =>
      userEvent.click(screen.getByText(labels.listing.order_button)),
    );

    await waitFor(() =>
      expect(
        screen.getByText(labels.orderVeeam.description),
      ).toBeInTheDocument(),
    );

    await act(() =>
      userEvent.click(screen.getByText(labels.orderVeeam.next_step)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.orderVeeam.no_organization_message),
        ).toBeInTheDocument(),
      { timeout: 30000 },
    );
  });
});
