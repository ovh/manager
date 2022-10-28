import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Route } from 'use-react-router-breadcrumbs';

const Iam = React.lazy(() => import('./Iam'));
const IamPolicies = React.lazy(() => import('./IamPolicies'));
const IamGroups = React.lazy(() => import('./IamGroups'));
const IamGroupAdd = React.lazy(() => import('./IamGroupAdd'));
const IamGroupEdit = React.lazy(() => import('./IamGroupEdit'));
const IamGroupDelete = React.lazy(() => import('./IamGroupDelete'));

export default function IamRouting(): JSX.Element {
  const { t } = useTranslation('iam');

  return (
    <>
      <Route
        path="iam"
        element={
          <Suspense fallback="">
            <Iam />
          </Suspense>
        }
      >
        <Route
          index
          path=""
          element={
            <Suspense fallback="">
              <IamPolicies />
            </Suspense>
          }
        ></Route>
        <Route path="groups">
          <Route
            // index
            path=""
            element={
              <Suspense fallback="">
                <IamGroups />
              </Suspense>
            }
            // breadcrumb={t('iam_breadcrumb_groups')}
          >
            <Route path=":resourceGroupId">
              <Route
                path="delete"
                element={
                  <Suspense fallback="">
                    <IamGroupDelete />
                  </Suspense>
                }
              ></Route>
            </Route>
          </Route>
          <Route
            path="add"
            element={
              <Suspense fallback="">
                <IamGroupAdd />
              </Suspense>
            }
            breadcrumb={t('iam_breadcrumb_group_add')}
          />
          <Route path=":resourceGroupId">
            <Route
              path="edit"
              element={
                <Suspense fallback="">
                  <IamGroupEdit />
                </Suspense>
              }
            ></Route>
          </Route>
        </Route>
      </Route>
    </>
  );
}
