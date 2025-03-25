import { afterEach, vitest } from 'vitest';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';

describe('order', () => {
  afterEach(() => vitest.resetAllMocks());

  const orderVeeamDescription = labels.orderVeeam.description;
  const nextStepLabel = labels.orderVeeam.next_step;

  it('go to order step 1 from listing', async () => {
    const user = userEvent.setup();
    const { container } = await renderTest();

    const orderButton = await getOdsButtonByLabel({
      container,
      label: labels.listing.order_button,
    });

    await act(() => user.click(orderButton));
    await assertTextVisibility(orderVeeamDescription);
  });

  it('cannot go to step 2 if catalog is KO', async () => {
    const { container } = await renderTest({
      initialRoute: urls.orderVeeam,
      isCatalogKo: true,
    });

    await getOdsButtonByLabel({
      container,
      label: nextStepLabel,
      disabled: true,
    });

    await assertTextVisibility(
      labels.orderVeeam.catalog_error.replace('{{error}}', 'catalog KO'),
    );
  });

  it('go to order step 2', async () => {
    const user = userEvent.setup();
    const { container } = await renderTest({ initialRoute: urls.orderVeeam });

    await assertTextVisibility(orderVeeamDescription);

    const next = await getOdsButtonByLabel({ container, label: nextStepLabel });
    await act(() => user.click(next));

    await assertTextVisibility(labels.orderVeeam.choose_org_title);
  });
});
