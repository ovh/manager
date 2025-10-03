import { Handler } from "@ovh-ux/manager-core-test-utils";

export const getFeatureAvailabilityMocks = (params: {
  identityDocuments?: boolean;
  agreementsUpdate?: boolean;
  suggestions?: boolean;
} = {}): Handler[] => {
  const {
    identityDocuments = true,
    agreementsUpdate = true,
    suggestions = true,
  } = params;

  const mocks: Handler[] = [];

  if (identityDocuments) {
    mocks.push({
      url: 'feature/identity-documents/availability',
      response: {
        'identity-documents': true,
      },
      api: 'aapi',
      delay: 0,
    });
  }

  if (agreementsUpdate) {
    mocks.push({
      url: 'feature/billing:agreementsUpdateModal/availability',
      response: {
        'billing:agreementsUpdateModal': true,
      },
      api: 'aapi',
      delay: 0,
    });
  }

  if (suggestions) {
    mocks.push({
      url: 'feature/hub:popup-hub-invite-customer-siret/availability',
      response: {
        'hub:popup-hub-invite-customer-siret': true,
      },
      api: 'aapi',
      delay: 0,
    });
  }

  return mocks;
};