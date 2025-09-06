import React, { ComponentProps } from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'element-internals-polyfill';
import { vi } from 'vitest';

import { ServiceDetails, defaultServiceResponse } from '@ovh-ux/manager-module-common-api';

import BillingInformationsTile from '../../BillingInformationsTile';
import { Wrapper } from '../../test-utils';
import { serviceSuspendedResponse } from '../../test-utils/mockUtils';
import { BillingInformationsResiliateLink } from './ResiliateLink';

const renderWithMock = (
  mock: Partial<ServiceDetails>,
  props: ComponentProps<typeof BillingInformationsResiliateLink> = {},
) => {
  return render(
    <Wrapper mock={mock}>
      <BillingInformationsTile resourceName="my-resource-name">
        <BillingInformationsResiliateLink {...props} />
      </BillingInformationsTile>
    </Wrapper>,
  );
};

describe('BillingInformationsTile.State', () => {
  const onLinkClick = vi.fn();

  it('should display link enabled when service is active', async () => {
    const user = userEvent.setup();
    const { container } = renderWithMock(defaultServiceResponse, {
      onClickReturn: onLinkClick,
    });

    await waitFor(
      () => {
        const link = container.querySelector(
          `ods-link[label="billing_informations_tile_field_label_resiliate"]`,
        );
        expect(link).not.toBeNull();
        expect(link).toHaveAttribute('is-disabled', 'false');
      },
      { timeout: 500 },
    );

    const link = container.querySelector(
      `ods-link[label="billing_informations_tile_field_label_resiliate"]`,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await user.click(link);

    expect(onLinkClick).toHaveBeenCalled();
  });

  it('should display link disabled when service is suspended', async () => {
    const { container } = renderWithMock(serviceSuspendedResponse);

    await waitFor(
      () => {
        const link = container.querySelector(
          `ods-link[label="billing_informations_tile_field_label_resiliate"]`,
        );
        expect(link).not.toBeNull();
        expect(link).toHaveAttribute('is-disabled', 'true');
      },
      { timeout: 500 },
    );
  });
});
