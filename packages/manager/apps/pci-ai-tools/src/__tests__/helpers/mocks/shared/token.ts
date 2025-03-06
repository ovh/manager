import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';

export const mockedTokenCreation: ai.token.TokenSpec = {
  labelSelector: 'labelSelector',
  name: 'tokenName',
  region: 'region',
  role: ai.TokenRoleEnum.ai_training_operator,
};

export const mockedToken: ai.token.Token = {
  createdAt: '1989/04/08',
  id: 'id',
  status: {
    value: 'value',
    version: 4,
  },
  spec: {
    labelSelector: 'labelSelector',
    name: 'tokenName',
    region: 'GRA',
    role: ai.TokenRoleEnum.ai_training_operator,
  },
  updatedAt: '1989/04/08',
};
