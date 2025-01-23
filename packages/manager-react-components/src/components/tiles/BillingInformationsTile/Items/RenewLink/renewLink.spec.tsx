import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import { render, screen, waitFor } from '@testing-library/react';
import { Wrapper } from '../../utils';
import { BillingInformationsState } from './RenewLink';
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
  engagementLabelKey: keyof typeof fr_FR;
  renewLabelKey: keyof typeof fr_FR;
};

const testCases: TestParams[] = [
  {
    mock: defaultServiceResponse,
    engagementLabelKey: 'billing_informations_tile_engagement_status_none',
    renewLabelKey: 'billing_informations_tile_renew_state_automatic',
  },
  {
    mock: serviceSuspendedResponse,
    engagementLabelKey: 'billing_informations_tile_engagement_status_none',
    renewLabelKey: 'billing_informations_tile_renew_state_resiliated',
  },
  {
    mock: serviceEngagedAndContinueResponse,
    engagementLabelKey:
      'billing_informations_tile_engagement_status_engaged_renew',
    renewLabelKey: 'billing_informations_tile_renew_state_automatic',
  },
  {
    mock: serviceEngagedAndEndResponse,
    engagementLabelKey: 'billing_informations_tile_engagement_status_engaged',
    renewLabelKey: 'billing_informations_tile_renew_state_resiliate_planned',
  },
  {
    mock: serviceManualRenewResponse,
    engagementLabelKey: 'billing_informations_tile_engagement_status_none',
    renewLabelKey: 'billing_informations_tile_renew_state_manual',
  },
];

const testCasesTranslated = testCases.map((testCase) => ({
  ...testCase,
  engagementLabel: fr_FR[testCase.engagementLabelKey],
  renewLabel: fr_FR[testCase.renewLabelKey],
}));

describe('BillingInformationsTile.State', () => {
  it.each(testCasesTranslated)(
    'should display state $engagementLabel with badge $renewLabel',
    async ({ mock, engagementLabelKey, renewLabelKey }) => {
      const { container, getByText } = render(
        <Wrapper mock={mock}>
          <BillingInformationsTile resourceName="my-resource-name">
            <BillingInformationsState />
          </BillingInformationsTile>
        </Wrapper>,
      );

      await waitFor(
        () => {
          expect(getByText(engagementLabelKey)).not.toBeNull();
          expect(
            container.querySelector(`ods-badge[label="${renewLabelKey}"]`),
          ).not.toBeNull();
        },
        { timeout: 500 },
      );
    },
  );
});
