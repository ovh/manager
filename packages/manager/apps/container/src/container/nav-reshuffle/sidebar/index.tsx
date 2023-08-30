import React, { useEffect, useState, Suspense } from 'react';

import { useLocation, Location } from 'react-router-dom';
import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import logo from '@/assets/images/OVHcloud_logo.svg';
import Assistance from './Assistance';
import navigationRoot from './navigation-tree/root';
import SidebarLink from './SidebarLink';
import style from './style.module.scss';
import {
  initTree,
  countServices,
  findNodeById,
  findPathToNode,
  findPathToNodeByApp,
  initFeatureNames,
} from './utils';
import { Node } from './navigation-tree/node';
import ProjectSelector, { PciProject } from './ProjectSelector/ProjectSelector';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

interface ServicesCountError {
  url: string;
  status: number;
  message: string;
}
interface ServicesCount {
  total: number;
  serviceTypes: Record<string, number>;
  errors?: Array<ServicesCountError>;
}

const parseContainerURL = (
  location: Location,
): { appId: string; appHash: string } => {
  const [, appId, appHash] = /^\/([^/]*)(.*)/.exec(location.pathname);
  return { appId, appHash: `${appHash}${location.search}` };
};

const Sidebar = (): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const location = useLocation();
  const trackingPlugin = shell.getPlugin('tracking');
  const navigationPlugin = shell.getPlugin('navigation');
  const environmentPlugin = shell.getPlugin('environment');
  const routingPlugin = shell.getPlugin('routing');
  const reketInstance = useReket();
  const { betaVersion } = useContainer();

  const [containerURL, setContainerURL] = useState(parseContainerURL(location));
  const {
    closeNavigationSidebar,
    currentNavigationNode,
    setCurrentNavigationNode,
    navigationTree,
    setNavigationTree,
  } = useProductNavReshuffle();
  const [servicesCount, setServicesCount] = useState<ServicesCount>(null);
  const [menuItems, setMenuItems] = useState<
    Array<{ node: Node; count: number | boolean }>
  >([]);
  const [pciProjects, setPciProjects] = useState<PciProject[]>([]);
  const [pciError, setPciError] = useState<boolean>(false);
  const [selectedPciProject, setSelectedPciProject] = useState<PciProject>(
    null,
  );
  const [pciProjectServiceCount, setPciProjectServiceCount] = useState<
    ServicesCount
  >(null);
  const [highlightedNode, setHighlightedNode] = useState<Node>(null);
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(true);

  const logoLink = navigationPlugin.getURL('hub', '#/');

  const shouldHideElement = (node: Node, count: number | boolean) => {
    if (node.hideIfEmpty && !count) {
      return true;
    }

    if (node.forceVisibility) {
      return false;
    }

    if (betaVersion === 2) {
      if (node.id === 'services') return false;
      if (node.count === false) return false;
      if (node.hideIfEmpty === false) return false;
      return !count;
    }

    return false;
  };

  const menuClickHandler = (node: Node) => {
    if (node.children) {
      // reset pci project selection before entering pci section
      if (node.id === 'pci') {
        setSelectedPciProject(null);
      }
      setCurrentNavigationNode(node);
    } else {
      closeNavigationSidebar();
    }

    let trackingIdComplement = 'navbar_v2_entry_';
    const history = findPathToNode(
      navigationRoot,
      (n: Node) => n.id === node.id,
    )
      .filter((item) => item.id)
      .map((element) => element.id);

    history.forEach((entry: string) => {
      trackingIdComplement += `${entry.replace(/-/g, '_')}::`;
    });

    trackingPlugin.trackClick({
      name: trackingIdComplement.replace(/[:][:]$/g, ''),
      type: 'navigation',
    });

    setIsAssistanceOpen(false);
  };

  /** Initialize navigation tree */
  useEffect(() => {
    let abort = false;

    const featuresListPromise = async () => {
      if (!abort) {
        const features = initFeatureNames(navigationRoot);

        const results: Record<string, boolean> = await reketInstance.get(
          `/feature/${features.join(',')}/availability`,
          {
            requestType: 'aapi',
          },
        );

        const region = environmentPlugin.getEnvironment().getRegion();
        const [tree] = initTree([navigationRoot], results, region);

        const mxPlanNode = findNodeById(tree, 'mxplan');
        if (mxPlanNode && region === 'CA') {
          mxPlanNode.routing.hash = '#/email_mxplan';
        }

        /**
         * Remove Identity Documents option
         * Identity docments entry is added by default in ./navigation-tree/root.ts
         */
        let isIdentityDocumentsVisible;
        if (results['identity-documents']) {
          const { status } = await reketInstance.get(`/me/procedure/identity`);
          if (!['required','open'].includes(status)) {
            isIdentityDocumentsVisible = false;
          }
        } else {
          isIdentityDocumentsVisible = false;
        }
        if (!isIdentityDocumentsVisible) {
          const account = findNodeById(tree, 'account');
          account.children.splice(
            account.children.findIndex(
              (node) => node.id === 'account_identity_documents',
            ),
            1,
          );
        }

        /**
         * Remove Documents menu
         * Documents page is added by default in ./navigation-tree/root.ts but not accessible if fraud status is not required or open
         */
        const { status } = await reketInstance.get(`/me/procedure/fraud`);
        const isKycDocumentsVisible = ['required','open'].includes(status);

        if (!isKycDocumentsVisible) {
          const account = findNodeById(tree, 'account');
          account.children.splice(
            account.children.findIndex(
              (node) => node.id === 'account_kyc_documents',
            ),
            1,
          );
        }

        /**
         * US enterprise customers special case
         */
        ['billing_bills', 'billing_payment', 'orders'].forEach((nodeId) => {
          const node = findNodeById(tree, nodeId);
          if (!node) return;
          const env = environmentPlugin.getEnvironment();
          if (env.getRegion() === 'US' && env.user.enterprise) {
            if (nodeId === 'orders') {
              node.hideIfEmpty = true;
            } else {
              delete node.routing;
              node.url = 'https://billing.us.ovhcloud.com/login';
              node.isExternal = true;
            }
          }
        });

        setNavigationTree(tree);
        setCurrentNavigationNode(tree);
      }
    };
    featuresListPromise();

    return () => {
      abort = true;
    };
  }, []);

  /**
   * Initialize service count
   */
  useEffect(() => {
    reketInstance
      .get('/services/count', {
        requestType: 'aapi',
      })
      .then((result: ServicesCount) => setServicesCount(result));
  }, []);

  const fetchPciProjects = () => {
    reketInstance
      .get('/cloud/project', {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': 5000,
          'X-Pagination-Sort': 'description',
        },
      })
      .then((result: Array<PciProject>) => {
        setPciError(false);
        if (result && result.length) {
          setPciProjects(result);
        }
      })
      .catch(() => {
        setPciError(true);
      });
  };
  /**
   * Initialize list of pci projects
   */
  useEffect(() => {
    fetchPciProjects();
  }, []);

  /** Watch URL changes to update selected menu dynamically */
  useEffect(() => {
    setContainerURL(parseContainerURL(location));
  }, [location]);

  /**
   * When routing changes, try to select the corresponding entry
   * in the sidebar
   */
  useEffect(() => {
    const { appId, appHash } = containerURL;

    if (appId === 'public-cloud' && !pciProjects) return;
    if (appId === 'hub' && appHash === '/catalog') {
      setHighlightedNode(null);
      return;
    }

    const compareFn = (
      node: Node,
      searchAppId: string,
      searchAppHash: string,
    ) => {
      if (!node?.routing?.hash) return false;
      const hashRegexp = new RegExp(
        `^\\${(node.routing.hash || '/')
          .replace(/^#/, '')
          .replace(/{[^}]+}/g, '[^/]+')}?$`,
      );

      return (
        node.routing.application === searchAppId &&
        hashRegexp.test(searchAppHash)
      );
    };
    let searchHash = appHash;
    if (appHash.includes('?')) {
      searchHash = appHash.substring(0, appHash.lastIndexOf('?'));
    }
    let path = findPathToNodeByApp(
      currentNavigationNode,
      compareFn,
      appId,
      searchHash.replace(/^#/, ''),
    );

    if (path.length === 0) {
      path = findPathToNodeByApp(
        navigationTree,
        compareFn,
        appId,
        searchHash.replace(/^#/, ''),
      );
    }

    const target = path.pop();
    if (target) {
      setCurrentNavigationNode(target.children ? target : target.parent);
      if (!target.children) {
        setHighlightedNode(target);
      }
    } else {
      setHighlightedNode(null);
    }
  }, [navigationTree, containerURL, pciProjects]);

  /**
   * Synchronize selected public cloud project with pci's project id in URL
   */
  useEffect(() => {
    const { appHash } = containerURL;
    if (appHash.startsWith('/pci/projects/new')) {
      setSelectedPciProject(null);
    } else {
      if (!pciProjects?.length) return;

      const pciProjectMatch = (appHash || '').match(
        /^\/pci\/projects\/([^/?]+)/,
      );
      let project;
      if (pciProjectMatch && pciProjectMatch.length >= 2) {
        const [, pciProjectId] = pciProjectMatch;
        project = pciProjects.find((p) => p.project_id === pciProjectId);
      }

      if (project) {
        setSelectedPciProject(project);
      } else if (currentNavigationNode.id === 'pci' && !selectedPciProject) {
        reketInstance
          .get('/me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT')
          .then(
            (result: { key: string; value: string }) =>
              JSON.parse(result.value).projectId,
          )
          .then((projectId: string) => {
            navigationPlugin.navigateTo(
              'public-cloud',
              `#/pci/projects/${projectId}`,
            );
          })
          .catch(() => {
            navigationPlugin.navigateTo(
              'public-cloud',
              `#/pci/projects/${pciProjects[0].project_id}`,
            );
          });
      }
    }
  }, [pciProjects, currentNavigationNode, containerURL]);

  /**
   * Count services of a pci project once a project is selected
   */
  useEffect(() => {
    let abort = false;
    setPciProjectServiceCount(null);
    if (selectedPciProject) {
      reketInstance
        .get(`/services/count?pciProjectId=${selectedPciProject.project_id}`, {
          requestType: 'aapi',
        })
        .then((result: ServicesCount) => {
          if (abort) return;
          setPciProjectServiceCount(result);
        });
    }

    return () => {
      abort = true;
    };
  }, [selectedPciProject]);

  /**
   * Update menu items based on currentNavigationNode
   * Update menu items count when servicesCount or pciProjectServiceCount are updated
   */
  useEffect(() => {
    if (currentNavigationNode?.id?.startsWith('pci') && !selectedPciProject) {
      setMenuItems([]);
    } else {
      const count: ServicesCount = {
        total: servicesCount?.total,
        serviceTypes: {
          ...servicesCount?.serviceTypes,
          ...(pciProjectServiceCount
            ? pciProjectServiceCount.serviceTypes
            : []),
        } as Record<string, number>,
      };

      setMenuItems(
        currentNavigationNode.children?.map((node: Node) => ({
          node,
          count: node.count === false ? node.count : countServices(count, node),
        })),
      );
    }
  }, [
    servicesCount,
    pciProjectServiceCount,
    currentNavigationNode,
    selectedPciProject,
  ]);

  return (
    <div className={style.sidebar}>
      <a
        role="img"
        className={`block ${style.sidebar_logo}`}
        aria-label="OVHcloud"
        target="_top"
        href={logoLink}
      >
        <img
          className="mx-4 my-3"
          src={logo}
          alt="OVHcloud"
          aria-hidden="true"
        />
      </a>

      <div className={style.sidebar_action}>
        <a
          onClick={() =>
            trackingPlugin.trackClick({
              name: 'navbar_v2_cta_add_a_service',
              type: 'action',
            })
          }
          href={navigationPlugin.getURL('catalog', '/')}
        >
          <span
            className={`oui-icon oui-icon-plus ${style.sidebar_action_icon}`}
            aria-hidden="true"
          ></span>
          <span>{t('sidebar_service_add')}</span>
        </a>
      </div>
      {currentNavigationNode.id !== 'home' && (
        <a
          className={style.sidebar_back_btn}
          onClick={() => {
            setCurrentNavigationNode(currentNavigationNode.parent);
            setIsAssistanceOpen(false);
          }}
        >
          <span
            className="oui-icon oui-icon-chevron-left"
            aria-hidden="true"
          ></span>
          {t('sidebar_back')}
        </a>
      )}
      <div className={style.sidebar_menu}>
        {(servicesCount || betaVersion === 1) && (
          <ul id="menu">
            <li>
              <h2>{t(currentNavigationNode.translation)}</h2>
            </li>

            {/^pci/.test(currentNavigationNode?.id) && (
              <li>
                <ProjectSelector
                  isLoading={!pciProjects}
                  projects={pciProjects}
                  selectedProject={selectedPciProject}
                  onProjectChange={(option: typeof selectedPciProject) => {
                    if (selectedPciProject !== option) {
                      navigationPlugin.navigateTo(
                        'public-cloud',
                        `#/pci/projects/${option.project_id}`,
                      );
                    }
                  }}
                  onProjectCreate={() => {
                    navigationPlugin.navigateTo(
                      'public-cloud',
                      `#/pci/projects/new`,
                    );
                  }}
                  onSeeAllProjects={() => {
                    navigationPlugin.navigateTo(
                      'public-cloud',
                      `#/pci/projects`,
                    );
                  }}
                  onMenuOpen={() => setIsAssistanceOpen(false)}
                  createLabel={t('sidebar_pci_new')}
                  seeAllButton={true}
                  seeAllLabel={t('sidebar_pci_all')}
                />
                {pciError && (
                  <button
                    className={style.sidebar_pci_refresh}
                    onClick={() => fetchPciProjects()}
                  >
                    <span>{t('sidebar_pci_load_error')}</span>
                    <span className="oui-icon oui-icon-refresh"></span>
                  </button>
                )}
                {selectedPciProject && (
                  <span
                    className={`flex px-1 ${style.sidebar_clipboard}`}
                    title={t('sidebar_clipboard_copy')}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        selectedPciProject.project_id,
                      )
                    }
                  >
                    <span className={style.sidebar_clipboard_text}>
                      {selectedPciProject.project_id}
                    </span>

                    <span
                      className={`oui-icon oui-icon-copy px-1 mx-1  ml-auto ${style.sidebar_clipboard_copy}`}
                    ></span>
                  </span>
                )}
              </li>
            )}

            {menuItems?.map(({ node, count }) => (
              <li
                key={node.id}
                id={node.id}
                className={
                  node === highlightedNode ? style.sidebar_selected : ''
                }
              >
                {!shouldHideElement(node, count) && (
                  <SidebarLink
                    node={node}
                    count={count}
                    linkParams={{
                      projectId: selectedPciProject?.project_id,
                    }}
                    onClick={() => menuClickHandler(node)}
                    id={node.idAttr}
                  />
                )}
                {node.separator && <hr />}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Suspense fallback="">
        <Assistance
          containerURL={containerURL}
          isOpen={isAssistanceOpen}
          onToggle={(isOpen) => setIsAssistanceOpen(isOpen)}
        />
      </Suspense>
    </div>
  );
};

export default Sidebar;
