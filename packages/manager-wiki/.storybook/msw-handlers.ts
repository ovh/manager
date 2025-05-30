import { http, HttpResponse } from 'msw';
import {
  authorizedActions,
  unauthorizedActions,
} from './__mocks__/iamResourceAuthorizationCheck';
import { IAM_URNS } from '../utils/iam.constants';

// Factory function to build handlers
const buildAuthorizationHandler = (
  urn: string,
  response: any,
  status: number = 200,
) =>
  http.post(
    `/engine/api/v2/iam/resource/${encodeURIComponent(
      urn,
    )}/authorization/check`,
    () => HttpResponse.json(response, { status }),
  );

// Handlers list
export const handlers = [
  buildAuthorizationHandler(IAM_URNS.WITH_AUTH, authorizedActions),
  buildAuthorizationHandler(IAM_URNS.WITHOUT_AUTH, unauthorizedActions),
];
