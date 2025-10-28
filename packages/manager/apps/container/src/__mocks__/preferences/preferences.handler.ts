import { Handler } from "@ovh-ux/manager-core-test-utils";

export const getPreferencesMocks = (params: {
  identityDocuments?: boolean;
  agreementsUpdate?: boolean;
  suggestions?: boolean;
  betaVersion?: boolean | 'true' | 'false';
} = {}): Handler[] => {
  const {
    identityDocuments = true,
    agreementsUpdate = true,
    suggestions = true,
    betaVersion = 'true',
  } = params;

  const mocks: Handler[] = [];

  if (identityDocuments) {
    mocks.push({
      url: 'me/preferences/manager/IDENTITY_DOCUMENTS_MODAL',
      response: null,
      api: 'v6',
      delay: 0,
    });
  }

  if (agreementsUpdate) {
    mocks.push({
      url: 'me/preferences/manager/AGREEMENTS_UPDATE_MODAL',
      response: null,
      api: 'v6',
      delay: 0,
    });
  }

  if (suggestions) {
    mocks.push({
      url: 'me/preferences/manager/SUGGESTION_MODAL',
      response: null,
      api: 'v6',
      delay: 0,
    });
  }

  // Beta version preference mock
  if (betaVersion !== false) {
    const betaValue = typeof betaVersion === 'boolean' ? betaVersion.toString() : betaVersion;
    mocks.push({
      url: 'me/preferences/manager/NAV_RESHUFFLE_BETA_ACCESS',
      response: {
        value: betaValue,
      },
      api: 'v6',
      delay: 0,
    });
  }

  mocks.push({
    method: 'post',
    url: 'me/preferences/manager',
    response: null,
    api: 'v6',
    delay: 0,
  });

  // Beta version preference update mock
  mocks.push({
    method: 'put',
    url: 'me/preferences/manager/NAV_RESHUFFLE_BETA_ACCESS',
    response: null,
    api: 'v6',
    delay: 0,
  });

  return mocks;
};
