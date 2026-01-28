/* eslint-disable max-lines */
import React from 'react';

import { Route, UIMatch } from 'react-router-dom';

import { ICON_NAME } from '@ovhcloud/ods-react';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/404';

import {
  ADD_DOMAIN,
  ADD_MODULE,
  ADD_WEBSITE,
  ADVANCED_FLUSH_CDN,
  ASSOCIATE_GIT,
  CDN_CACHE_RULE,
  CDN_CONFIRMATION,
  CDN_CORS_RESOURCE_SHARING,
  CDN_EDIT_URLS,
  CREATE,
  DASHBOARD,
  DELETE,
  DELETE_GIT,
  DELETE_MODULE,
  DELETE_SITE,
  DEPLOYE_GIT,
  DETACHE_DOMAIN,
  DISABLE_SSL,
  EDIT_NAME,
  GENERAL_INFORMATION,
  IMPORT,
  IMPORT_SSL,
  LAST_DEPLOYEMENT_GIT,
  LOCAL_SEO,
  MODIFY_CDN,
  MODIFY_DOMAIN,
  MULTISITE,
  ONBOARDING,
  ORDER_SECTIGO,
  PURGE_CDN,
  REMOVE_SEO_SUBSCIPTION,
  SAN_SSL,
  SSL,
  TASK,
  TASKS,
  VIDEO_CENTER,
  VIDEO_CENTER_DASHBOARD,
  VIDEO_CENTER_ONBOARDING,
  WEBSITE,
  WORDPRESS_MANAGED,
  WORDPRESS_MANAGED_SERVICE,
} from '../utils/tracking.constants';
import {
  ActivateCdnModal,
  AdvancedFlushCdnModal,
  CdnCacheRuleModal,
  CdnConfirmationModal,
  CdnCorsResourceSharingModal,
  CdnEditUrlsModal,
  ModifyCdnPage,
  PurgeCdnModal,
} from './pages/cdn';
import {
  DashboardLayout,
  MultisitePage,
  OnboardingPage,
  RootPage,
  WebsitesPage,
} from './pages/default';
import { AddDomainPage, DetacheDomainModal, ModifyDomainModal } from './pages/domain';
import {
  AssociateGitPage,
  DeleteGitModal,
  DeployeGitModal,
  LastDeploymentGitModal,
} from './pages/git';
import { LocalSeoPage, RemoveSeoSubscriptionPage } from './pages/localSeo';
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
import { AddWebsitePage, DeleteSiteModal, UpdateDisplayNameModalComponent } from './pages/website';
import {
  VideoManagerCenterPage,
  VideoManagerDashboardPage,
  VideoManagerOnboardingPage,
} from './pages/videoManagerCenter';
import { urls } from './routes.constants';

export type RouteHandle = {
  isOverridePage?: boolean;
  tracking?: {
    pageName?: string;
    pageType?: PageType;
  };
  breadcrumb?: {
    label: string;
    icon?: ICON_NAME;
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
      id={VIDEO_CENTER}
      path={urls.videoCenter}
      Component={VideoManagerCenterPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'video_manager_center',
        },
      }}
    />

    <Route
      id={VIDEO_CENTER_DASHBOARD}
      path={urls.videoCenterDashboard}
      Component={VideoManagerDashboardPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'video_manager_dashboard',
        },
      }}
    />

    <Route
      id={VIDEO_CENTER_ONBOARDING}
      path={urls.videoCenterOnboarding}
      Component={VideoManagerOnboardingPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'video_manager_dashboard',
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
      ></Route>
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
            label: 'common:web_hosting_header_tasks',
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
      <Route
        id={LOCAL_SEO}
        path={urls.localSeo}
        Component={LocalSeoPage}
        handle={{
          tracking: {
            pageName: LOCAL_SEO,
            pageType: PageType.listing,
          },
        }}
      />
      <Route
        id={REMOVE_SEO_SUBSCIPTION}
        path={urls.removeSeoSubsciption}
        Component={RemoveSeoSubscriptionPage}
        handle={{
          tracking: {
            pageName: REMOVE_SEO_SUBSCIPTION,
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
          id={EDIT_NAME}
          path={urls.editName}
          Component={UpdateDisplayNameModalComponent}
          handle={{
            tracking: {
              pageType: PageType.dashboard,
            },
            breadcrumb: {
              label: 'common:edit-displayname',
            },
          }}
        />
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
          id="activate-cdn"
          path={urls.activateCdn}
          Component={ActivateCdnModal}
          handle={{
            tracking: {
              pageName: 'activate-cdn',
              pageType: PageType.popup,
            },
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
          id={DELETE_SITE}
          path={urls.deleteSite}
          Component={DeleteSiteModal}
          handle={{
            tracking: {
              pageName: DELETE_SITE,
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
        <Route
          id={ADVANCED_FLUSH_CDN}
          path={urls.advancedFlushCdn}
          Component={AdvancedFlushCdnModal}
          handle={{
            tracking: {
              pageName: ADVANCED_FLUSH_CDN,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={CDN_CACHE_RULE}
          path={urls.cdnCacheRule}
          Component={CdnCacheRuleModal}
          handle={{
            tracking: {
              pageName: CDN_CACHE_RULE,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={CDN_EDIT_URLS}
          path={urls.cdnEditUrls}
          Component={CdnEditUrlsModal}
          handle={{
            tracking: {
              pageName: CDN_EDIT_URLS,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={CDN_CORS_RESOURCE_SHARING}
          path={urls.cdnCorsResourceSharing}
          Component={CdnCorsResourceSharingModal}
          handle={{
            tracking: {
              pageName: CDN_CORS_RESOURCE_SHARING,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={CDN_CONFIRMATION}
          path={urls.cdnConfirmation}
          Component={CdnConfirmationModal}
          handle={{
            tracking: {
              pageName: CDN_CONFIRMATION,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={ADD_DOMAIN}
          path={urls.addDomain}
          Component={AddDomainPage}
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
      </Route>
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
