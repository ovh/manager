import { Handler } from '@ovh-ux/manager-core-test-utils';

export const getFeatureAvailabilityMocks = (
  params: {
    identityDocuments?: boolean;
    agreementsUpdate?: boolean;
    suggestions?: boolean;
    pnr?: boolean;
    livechat?: boolean;
  } = {},
): Handler[] => {
  const {
    identityDocuments = true,
    agreementsUpdate = true,
    suggestions = true,
    pnr = true,
    livechat = true,
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

  // we currently request the pnr together with the livechat in ContainerProvider
  if (pnr) {
    mocks.push(
      {
        url: 'feature/pnr/availability',
        response: {
          pnr: true,
        },
        api: 'aapi',
        method: 'get',
        delay: 0,
      },
      {
        url: 'feature/livechat,pnr/availability',
        response: {
          pnr: true,
        },
        api: 'aapi',
        method: 'get',
        delay: 0,
      },
    );
  }

  if (livechat) {
    mocks.push({
      url: 'feature/livechat/availability',
      response: {
        livechat: true,
      },
      api: 'aapi',
      method: 'get',
      delay: 0,
    });
  }

  return mocks;
};
