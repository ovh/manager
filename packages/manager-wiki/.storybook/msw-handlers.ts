import { http, HttpResponse } from 'msw';
import {
  authorizedActions,
  unauthorizedActions,
} from './__mocks__/iamResourceAuthorizationCheck';

export const handlers = [
  http.post(
    `/engine/api/v2/iam/resource/${encodeURIComponent(
      'urn:v9:eu:resource:manager-react-components:with-authorization',
    )}/authorization/check`,
    () => {
      return HttpResponse.json(authorizedActions);
    },
  ),
  http.post(
    `/engine/api/v2/iam/resource/${encodeURIComponent(
      'urn:v9:eu:resource:manager-react-components:without-authorization',
    )}/authorization/check`,
    () => {
      return HttpResponse.json(unauthorizedActions);
    },
  ),
];
