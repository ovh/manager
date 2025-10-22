import { Handler } from "@ovh-ux/manager-core-test-utils";

export const getPreferencesMocks = (params: {
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

  mocks.push({
    method: 'post',
    url: 'me/preferences/manager',
    response: null,
    api: 'v6',
    delay: 0,
  });

  return mocks;
};