import 'element-internals-polyfill';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import '../../../../../utils/test.provider';
import { render, waitFor } from '@testing-library/react';
import { ComponentProps } from 'react';
import { vi } from 'vitest';
import { BillingInformationsResiliateLink } from './ResiliateLink';
import { Wrapper } from '../../utils';
import fr_FR from '../../translations/Messages_fr_FR.json';
import { BillingInformationsTile } from '../../BillingInformationsTile';
import { serviceSuspendedResponse } from '../../mockUtils';

const renderWithMock = (
  mock: Partial<ServiceDetails>,
  props: ComponentProps<typeof BillingInformationsResiliateLink> = {},
) => {
  return render(
    <Wrapper mock={mock}>
      <I18nextProvider i18n={i18n}>
        <BillingInformationsTile resourceName="my-resource-name">
          <BillingInformationsResiliateLink {...props} />
        </BillingInformationsTile>
      </I18nextProvider>
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
          `ods-link[label="${fr_FR.billing_informations_tile_field_label_resiliate}"]`,
        );
        expect(link).not.toBeNull();
        expect(link).toHaveAttribute('is-disabled', 'false');
      },
      { timeout: 500 },
    );

    const link = container.querySelector(
      `ods-link[label="${fr_FR.billing_informations_tile_field_label_resiliate}"]`,
    );
    await user.click(link);

    expect(onLinkClick).toHaveBeenCalled();
  });

  it('should display link disabled when service is suspended', async () => {
    const { container } = renderWithMock(serviceSuspendedResponse);

    await waitFor(
      () => {
        const link = container.querySelector(
          `ods-link[label="${fr_FR.billing_informations_tile_field_label_resiliate}"]`,
        );
        expect(link).not.toBeNull();
        expect(link).toHaveAttribute('is-disabled', 'true');
      },
      { timeout: 500 },
    );
  });
});
