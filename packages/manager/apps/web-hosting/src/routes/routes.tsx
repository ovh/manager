/* eslint-disable max-lines */
import React from 'react';

import { Route, UIMatch } from 'react-router-dom';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import {
  ADD_DOMAIN,
  ADD_MODULE,
  ADD_WEBSITE,
  ASSOCIATE_GIT,
  CONFIGURE_GIT,
  DASHBOARD,
  DELETE_GIT,
  DELETE_MODULE,
  DEPLOYE_GIT,
  DETACHE_DOMAIN,
  DISABLE_SSL,
  IMPORT_SSL,
  LAST_DEPLOYEMENT_GIT,
  MODIFY_CDN,
  MODIFY_DOMAIN,
  MULTISITE,
  ONBOARDING,
  ORDER_DOMAIN,
  ORDER_SECTIGO,
  PURGE_CDN,
  SAN_SSL,
  SSL,
  WEBSITE,
} from '@/utils/tracking.constants';

import { ModifyCdnPage, PurgeCdnModal } from './pages/cdn';
import {
  DashboardLayout,
  MultisitePage,
  OnboardingPage,
  RootPage,
  WebsitesPage,
} from './pages/default';
import {
  AddDomainPage,
  DetacheDomainModal,
  ModifyDomainModal,
  OrderDomainPage,
} from './pages/domain';
import {
  AssociateGitPage,
  ConfigureGitPage,
  DeleteGitModal,
  DeployeGitModal,
  LastDeploymentGitModal,
} from './pages/git';
import { AddModuleModal, DeleteModuleModal } from './pages/module';
import { DisableSslPage, ImportSslPage, OrderSectigoPage, SanSslPage, SslPage } from './pages/ssl';
import { AddWebsitePage } from './pages/website';

export type RouteHandle = {
  isOverridePage?: boolean;
  tracking?: {
    pageName?: string;
    pageType?: PageType;
  };
  breadcrumb?: {
    label: string;
    icon?: ODS_ICON_NAME;
  };
};
export type RouteMatch = UIMatch<unknown, RouteHandle>;

export default (
  <Route
    id={'root'}
    path={urls.root}
    Component={RootPage}
    errorElement={
      <ErrorBoundary
        redirectionApp="web-hosting-backup"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route
      id={WEBSITE}
      path={urls.websites}
      Component={WebsitesPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'websites',
        },
      }}
    />
    <Route
      id={ONBOARDING}
      path={urls.onboarding}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route
      id={DASHBOARD}
      path={urls.dashboard}
      Component={DashboardLayout}
      handle={{
        breadcrumb: { label: ':serviceName' },
      }}
    >
      {/* Project ONE SSL */}
      <Route
        id={SSL}
        path={urls.ssl}
        Component={SslPage}
        handle={{
          tracking: {
            pageName: SSL,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'ssl',
          },
        }}
      />
      <Route
        id={IMPORT_SSL}
        path={urls.importSsl}
        Component={ImportSslPage}
        handle={{
          tracking: {
            pageName: IMPORT_SSL,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={ORDER_SECTIGO}
        path={urls.orderSectigo}
        Component={OrderSectigoPage}
        handle={{
          tracking: {
            pageName: ORDER_SECTIGO,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={DISABLE_SSL}
        path={urls.disableSsl}
        Component={DisableSslPage}
        handle={{
          tracking: {
            pageName: DISABLE_SSL,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={SAN_SSL}
        path={urls.sanSsl}
        Component={SanSslPage}
        handle={{
          tracking: {
            pageName: SAN_SSL,
            pageType: PageType.popup,
          },
        }}
      />
      {/* Project Multisite */}
      <Route
        id={MULTISITE}
        path={urls.multisite}
        Component={MultisitePage}
        handle={{
          tracking: {
            pageName: MULTISITE,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'multisite',
          },
        }}
      >
        <Route
          id={ADD_WEBSITE}
          path={urls.addWebSite}
          Component={AddWebsitePage}
          handle={{
            tracking: {
              pageType: PageType.listing,
            },
            breadcrumb: {
              label: 'common:add_website',
            },
            isOverridePage: true,
          }}
        />
        <Route
          id={ASSOCIATE_GIT}
          path={urls.associateGit}
          Component={AssociateGitPage}
          handle={{
            tracking: {
              pageType: PageType.listing,
            },
            breadcrumb: {
              label: 'common:associate_git',
            },
            isOverridePage: true,
          }}
        />
        <Route
          id={CONFIGURE_GIT}
          path={urls.configureGit}
          Component={ConfigureGitPage}
          handle={{
            tracking: {
              pageType: PageType.listing,
            },
            breadcrumb: {
              label: 'common:configure_git',
            },
            isOverridePage: true,
          }}
        />
        <Route
          id={MODIFY_CDN}
          path={urls.modifyCdn}
          Component={ModifyCdnPage}
          handle={{
            tracking: {
              pageType: PageType.listing,
            },
            breadcrumb: {
              label: 'common:modify_cdn',
            },
            isOverridePage: true,
          }}
        />
      </Route>
      <Route
        id={ADD_DOMAIN}
        path={urls.addDomain}
        Component={AddDomainPage}
        handle={{
          tracking: {
            pageName: ADD_DOMAIN,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={DETACHE_DOMAIN}
        path={urls.detacheDomain}
        Component={DetacheDomainModal}
        handle={{
          tracking: {
            pageName: DETACHE_DOMAIN,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={MODIFY_DOMAIN}
        path={urls.modifyDomain}
        Component={ModifyDomainModal}
        handle={{
          tracking: {
            pageName: MODIFY_DOMAIN,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={ORDER_DOMAIN}
        path={urls.orderDomain}
        Component={OrderDomainPage}
        handle={{
          tracking: {
            pageName: ORDER_DOMAIN,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={DELETE_GIT}
        path={urls.deleteGit}
        Component={DeleteGitModal}
        handle={{
          tracking: {
            pageName: DELETE_GIT,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={DEPLOYE_GIT}
        path={urls.deployeGit}
        Component={DeployeGitModal}
        handle={{
          tracking: {
            pageName: DEPLOYE_GIT,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={LAST_DEPLOYEMENT_GIT}
        path={urls.lastDeploymentGit}
        Component={LastDeploymentGitModal}
        handle={{
          tracking: {
            pageName: LAST_DEPLOYEMENT_GIT,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={ADD_MODULE}
        path={urls.addModule}
        Component={AddModuleModal}
        handle={{
          tracking: {
            pageName: ADD_MODULE,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={DELETE_MODULE}
        path={urls.deleteModule}
        Component={DeleteModuleModal}
        handle={{
          tracking: {
            pageName: DELETE_MODULE,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={PURGE_CDN}
        path={urls.purgeCdn}
        Component={PurgeCdnModal}
        handle={{
          tracking: {
            pageName: PURGE_CDN,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
