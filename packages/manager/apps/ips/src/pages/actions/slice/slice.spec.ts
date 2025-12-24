import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';

import { urls } from '@/routes/routes.constant';
import { getButtonByLabel, getModal, labels, renderTest } from '@/test-utils';
import { fromIpToId } from '@/utils';

describe('SliceModal', () => {
  it('shows warning when no slice', async () => {
    const { container } = await renderTest({
      hasSlices: false,
      nbIp: 6,
      initialRoute: urls.slice.replace(
        ':parentId',
        fromIpToId('241.94.186.48/28'),
      ),
    });

    const modal = await getModal(container);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.aggregateSlice.sliceModalTitle.replace(
              '{{ ip }}',
              '241.94.186.48/28',
            ),
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await getButtonByLabel({ container, label: 'confirm', disabled: true });
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

  it('shows select and children IPs when slice exist', async () => {
    const { container } = await renderTest({
      hasSlices: true,
      nbIp: 6,
      initialRoute: urls.slice.replace(
        ':parentId',
        fromIpToId('241.94.186.48/28'),
      ),
    });

    const modal = await getModal(container);

    await waitFor(
      () =>
        expect(
          within(modal).getByText(labels.aggregateSlice.sliceModalDescription),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(within(modal).getByText('1.1.1.1.0/28')).toBeInTheDocument();
    expect(within(modal).getByText('1.1.1.1.1/28')).toBeInTheDocument();
  });

  it('shows error message if error exists', async () => {
    const { container } = await renderTest({
      hasSlices: true,
      isPostSliceKo: true,
      nbIp: 6,
      initialRoute: urls.slice.replace(
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
        within(modal).getByText(
          labels.error.managerApiErrorWithoutRequestId.replace(/<br>.*/g, ''),
          { exact: false },
        ),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
