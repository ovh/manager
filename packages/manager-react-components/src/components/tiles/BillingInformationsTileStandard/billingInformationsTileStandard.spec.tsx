import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import '../../../utils/test.provider';
import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import { render, waitFor } from '@testing-library/react';
import { Wrapper } from '../BillingInformationsTile/utils';
import fr_FR from '../BillingInformationsTile/translations/Messages_fr_FR.json';
import {
  serviceSuspendedResponse,
  serviceEngagedAndContinueResponse,
  serviceEngagedAndEndResponse,
} from '../BillingInformationsTile/mockUtils';
import { BillingInformationsTileStandard } from './BillingInformationsTileStandard';

type TestParams = {
  mock: Partial<ServiceDetails>;
  label: string;
  isResiliateLinkView: boolean;
};

const testCases: TestParams[] = [
  {
    mock: defaultServiceResponse,
    label: 'on active status',
    isResiliateLinkView: true,
  },
  {
    mock: serviceSuspendedResponse,
    label: 'on suspended status',
    isResiliateLinkView: false,
  },
  {
    mock: serviceEngagedAndContinueResponse,
    label: 'on engaged and continue status',
    isResiliateLinkView: true,
  },
  {
    mock: serviceEngagedAndEndResponse,
    label: 'on engaged but end state',
    isResiliateLinkView: false,
  },
];

const renderComponent = (mock) => {
  return render(
    <Wrapper mock={mock}>
      <I18nextProvider i18n={i18n as any}>
        <BillingInformationsTileStandard resourceName="my-resource-name" />
      </I18nextProvider>
    </Wrapper>,
  );
};

describe('BillingInformationsTile.State', () => {
  it.each(testCases)(
    'should display resiliate link ($isResiliateLinkView) or not for status $label',
    async ({ mock, isResiliateLinkView }) => {
      const { container } = renderComponent(mock);

      await waitFor(
        () => {
          const resiliateLink = container.querySelector(
            `ods-link[label="${fr_FR.billing_informations_tile_field_label_resiliate}"]`,
          );

          if (isResiliateLinkView) {
            expect(resiliateLink).not.toBeNull();
          } else {
            expect(resiliateLink).toBeNull();
          }
        },
        { timeout: 500 },
      );
    },
  );
});
