import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';

import { urls } from '@/routes/routes.constant';
import { getButtonByLabel, getModal, labels, renderTest } from '@/test-utils';
import { fromIpToId } from '@/utils';

describe('AggregateModal', () => {
  it('shows warning when no aggregates', async () => {
    const { container } = await renderTest({
      hasAggregates: false,
      nbIp: 6,
      initialRoute: urls.aggregate.replace(
        ':parentId',
        fromIpToId('241.94.186.48/28'),
      ),
    });

    const modal = await getModal(container);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.aggregateSlice.aggregateModalTitle.replace(
              '{{ ip }}',
              '241.94.186.48/28',
            ),
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    const button = await screen.findByText('confirm');
    expect(button).toBeDisabled();

    await waitFor(
      () =>
        expect(
          within(modal).getByText(
            (content) =>
              !!content.length &&
              labels.aggregateSlice.noAggregateSliceAvailable.includes(content),
          ),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('shows select and children IPs when aggregates exist', async () => {
    const { container } = await renderTest({
      hasAggregates: true,
      nbIp: 6,
      initialRoute: urls.aggregate.replace(
        ':parentId',
        fromIpToId('241.94.186.48/28'),
      ),
    });

    const modal = await getModal(container);

    await waitFor(
      () =>
        expect(
          within(modal).getByText(
            labels.aggregateSlice.aggregateModalDescription,
          ),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(within(modal).getByText('1.1.1.1.0/32')).toBeInTheDocument();
    expect(within(modal).getByText('1.1.1.1.1/32')).toBeInTheDocument();
  });

  it('shows error message if error exists', async () => {
    const { container } = await renderTest({
      hasAggregates: true,
      isPostAggregateKo: true,
      nbIp: 6,
      initialRoute: urls.aggregate.replace(
        ':parentId',
        fromIpToId('241.94.186.48/28'),
      ),
    });

    const modal = await getModal(container);
    const confirmButton = await getButtonByLabel({
      container,
      label: 'confirm',
    });

    await waitFor(() => fireEvent.click(confirmButton));

    await waitFor(
      () =>
        within(
          modal,
        ).getByText(
          labels.error.managerApiErrorWithoutRequestId.replace(/<br>.*/g, ''),
          { exact: false },
        ),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
