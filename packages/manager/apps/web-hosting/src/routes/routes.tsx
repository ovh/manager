/* eslint-disable max-lines */
import React from 'react';

import { Route, UIMatch } from 'react-router-dom';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/404';
import {
  ADD_DOMAIN,
  ADD_MODULE,
  ADD_WEBSITE,
  ASSOCIATE_GIT,
  CONFIGURE_GIT,
  CREATE,
  DASHBOARD,
  DELETE,
  DELETE_GIT,
  DELETE_MODULE,
  DEPLOYE_GIT,
  DETACHE_DOMAIN,
  DISABLE_SSL,
  GENERAL_INFORMATION,
  IMPORT,
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
  TASK,
  TASKS,
  WEBSITE,
  WORDPRESS_MANAGED,
  WORDPRESS_MANAGED_SERVICE,
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
import {
  ManagedWordpressPage,
  ManagedWordpressResourcePage,
  ManagedWordpressServiceCreatePage,
  ManagedWordpressServiceDelete,
  ManagedWordpressServiceGeneralInformationPage,
  ManagedWordpressServiceImportPage,
  ManagedWordpressServiceTasksPage,
} from './pages/managedWordpress';
import { AddModuleModal, DeleteModuleModal } from './pages/module';
import { DisableSslPage, ImportSslPage, OrderSectigoPage, SanSslPage, SslPage } from './pages/ssl';
import { OngoingTaskPage } from './pages/task';
import { AddWebsitePage } from './pages/website';
import { urls } from './routes.constants';

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
      id={WORDPRESS_MANAGED}
      path={urls.managedWordpress}
      Component={ManagedWordpressPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'managed_wordpress',
        },
      }}
    />

    <Route
      id={WORDPRESS_MANAGED_SERVICE}
      path={urls.managedWordpressResource}
      Component={ManagedWordpressResourcePage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: ':serviceName',
        },
      }}
    >
      <Route
        id={GENERAL_INFORMATION}
        path={urls.managedWordpressResource}
        Component={ManagedWordpressServiceGeneralInformationPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          id={DELETE}
          path={urls.managedWordpressResourceDeleteModal}
          Component={ManagedWordpressServiceDelete}
          handle={{
            tracking: {
              pageName: DELETE,
              pageType: PageType.popup,
            },
          }}
        />
      </Route>

      <Route
        id={TASKS}
        path={urls.managedWordpressResourceTasks}
        Component={ManagedWordpressServiceTasksPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:web_hosting_header_tasks',
          },
        }}
      />
      <Route
        id={CREATE}
        path={urls.managedWordpressResourceCreate}
        Component={ManagedWordpressServiceCreatePage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:create_website',
          },
          isOverridePage: true,
        }}
      />
      <Route
        id={IMPORT}
        path={urls.managedWordpressResourceImport}
        Component={ManagedWordpressServiceImportPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:import_website',
          },
          isOverridePage: true,
        }}
      />
    </Route>
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
        id={TASK}
        path={urls.task}
        Component={OngoingTaskPage}
        handle={{
          tracking: {
            pageName: TASK,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'task',
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
