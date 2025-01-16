import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import '../../../../../utils/test.provider';
import { render, waitFor } from '@testing-library/react';
import { Wrapper } from '../../utils';
import { BillingInformationsState } from './State';
import fr_FR from '../../translations/Messages_fr_FR.json';
import { BillingInformationsTile } from '../../BillingInformationsTile';
import {
  serviceSuspendedResponse,
  serviceEngagedAndContinueResponse,
  serviceEngagedAndEndResponse,
  serviceManualRenewResponse,
} from '../../mockUtils';

type TestParams = {
  mock: Partial<ServiceDetails>;
  engagementLabel: string;
  renewLabel: string;
};

const testCases: TestParams[] = [
  {
    mock: defaultServiceResponse,
    engagementLabel: fr_FR.billing_informations_tile_engagement_status_none,
    renewLabel: fr_FR.billing_informations_tile_renew_state_automatic,
  },
  {
    mock: serviceSuspendedResponse,
    engagementLabel: fr_FR.billing_informations_tile_engagement_status_none,
    renewLabel: fr_FR.billing_informations_tile_renew_state_resiliated,
  },
  {
    mock: serviceEngagedAndContinueResponse,
    engagementLabel:
      fr_FR.billing_informations_tile_engagement_status_engaged_renew.replace(
        '{{ date }}',
        '',
      ),
    renewLabel: fr_FR.billing_informations_tile_renew_state_automatic,
  },
  {
    mock: serviceEngagedAndEndResponse,
    engagementLabel:
      fr_FR.billing_informations_tile_engagement_status_engaged.replace(
        '{{ date }}',
        '',
      ),
    renewLabel: fr_FR.billing_informations_tile_renew_state_resiliate_planned,
  },
  {
    mock: serviceManualRenewResponse,
    engagementLabel: fr_FR.billing_informations_tile_engagement_status_none,
    renewLabel: fr_FR.billing_informations_tile_renew_state_manual,
  },
];

describe('BillingInformationsTile.State', () => {
  it.each(testCases)(
    'should display state $engagementLabel with badge $renewLabel',
    async ({ mock, engagementLabel, renewLabel }) => {
      const { container, getByText } = render(
        <Wrapper mock={mock}>
          <I18nextProvider i18n={i18n}>
            <BillingInformationsTile resourceName="my-resource-name">
              <BillingInformationsState />
            </BillingInformationsTile>
          </I18nextProvider>
        </Wrapper>,
      );

      await waitFor(
        () => {
          expect(getByText(engagementLabel, { exact: false })).not.toBeNull();
          expect(
            container.querySelector(`ods-badge[label="${renewLabel}"]`),
          ).not.toBeNull();
        },
        { timeout: 500 },
      );
    },
  );
});
