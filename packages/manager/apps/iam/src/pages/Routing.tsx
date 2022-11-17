import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useRoutes } from 'react-router-dom';

const Iam = React.lazy(() => import('./Iam'));
const IamPolicies = React.lazy(() => import('./policies/IamPolicies'));
const IamPolicyAdd = React.lazy(() => import('./policies/IamPolicyAdd'));
const IamPolicyEdit = React.lazy(() => import('./policies/IamPolicyEdit'));
const IamPolicyDelete = React.lazy(() => import('./policies/IamPolicyDelete'));
const IamGroups = React.lazy(() => import('./groups/IamGroups'));
const IamGroupAdd = React.lazy(() => import('./groups/IamGroupAdd'));
const IamGroupEdit = React.lazy(() => import('./groups/IamGroupEdit'));
const IamGroupDelete = React.lazy(() => import('./groups/IamGroupDelete'));

export default function IamRouting(): JSX.Element {
  const { t } = useTranslation('iam');

  return useRoutes([
    {
      path: 'iam',
      element: (
        <Suspense fallback="">
          <Iam />
        </Suspense>
      ),
      children: [
        {
          path: '',
          children: [
            {
              index: true,
              element: <Navigate to="./policies" replace={true} />,
            },
            {
              path: 'policies',
              children: [
                {
                  path: '',
                  element: (
                    <Suspense fallback="">
                      <IamPolicies />
                    </Suspense>
                  ),
                  children: [
                    {
                      path: ':policyId',
                      children: [
                        {
                          path: 'delete',
                          element: (
                            <Suspense fallback="">
                              <IamPolicyDelete />
                            </Suspense>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: ':policyId',
                  children: [
                    {
                      path: 'edit',
                      element: (
                        <Suspense fallback="">
                          <IamPolicyEdit />
                        </Suspense>
                      ),
                    },
                  ],
                },
                {
                  path: 'add',
                  element: (
                    <Suspense fallback="">
                      <IamPolicyAdd />
                    </Suspense>
                  ),
                },
              ],
            },
          ],
        },
        {
          path: 'groups',
          children: [
            {
              path: '',
              element: (
                <Suspense fallback="">
                  <IamGroups />
                </Suspense>
              ),
              children: [
                {
                  path: ':resourceGroupId',
                  children: [
                    {
                      path: 'delete',
                      element: (
                        <Suspense fallback="">
                          <IamGroupDelete />
                        </Suspense>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: ':resourceGroupId',
              children: [
                {
                  path: 'edit',
                  element: (
                    <Suspense fallback="">
                      <IamGroupEdit />
                    </Suspense>
                  ),
                },
              ],
            },
            {
              path: 'add',
              element: (
                <Suspense fallback="">
                  <IamGroupAdd />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ]);
}
