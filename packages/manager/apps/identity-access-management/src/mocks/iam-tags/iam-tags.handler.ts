import { Handler } from '@ovh-ux/manager-core-test-utils';
import { iamTagsEmptyMock, iamTagsMock } from './iam-tags.mock';

export type GetIamTagsMockParams = {
  isEmpty?: boolean;
};

export const getIamTagsMocks = ({
  isEmpty,
}: GetIamTagsMockParams): Handler[] => [
  {
    method: 'get',
    url: '/iam/tags',
    response: isEmpty ? iamTagsEmptyMock : iamTagsMock,
    status: 200,
    api: 'aapi',
  },
];
