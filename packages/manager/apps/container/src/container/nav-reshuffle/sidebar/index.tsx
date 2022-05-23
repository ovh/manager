import React, { useEffect, useState, Suspense } from 'react';

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
  findPathToNode,
  findPathToNodeByApp,
  initFeatureNames,
} from './utils';
import { Node } from './navigation-tree/node';
import ProjectSelector from './ProjectSelector/ProjectSelector';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

function Sidebar(): JSX.Element {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const navigationPlugin = shell.getPlugin('navigation');
  const routingPlugin = shell.getPlugin('routing');
  const reketInstance = useReket();
  const { betaVersion } = useContainer();

  const [containerURL, setContainerURL] = useState(
    routingPlugin.parseContainerURL(),
  );
  const {
    currentNavigationNode,
    setCurrentNavigationNode,
    navigationTree,
    setNavigationTree,
  } = useProductNavReshuffle();
  const [servicesCount, setServicesCount] = useState(null);
  const [menuItems, setMenuItems] = useState(null);
  const [pciProjects, setPciProjects] = useState([]);
  const [selectedPciProject, setSelectedPciProject] = useState(null);
  const [pciProjectServiceCount, setPciProjectServiceCount] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);

  const logoLink = navigationPlugin.getURL('hub', '#/');

  const shouldHideElement = (node: Node, count: number) => {
    if (node.hideIfEmpty && !node.count) {
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

  const menuClickHandler = (node) => {
    if (node.children) {
      setCurrentNavigationNode(node);
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

        const [tree] = initTree([navigationRoot], results);

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
      .then((result) => setServicesCount(result));
  }, []);

  /**
   * Initialize list of pci projects
   */
  useEffect(() => {
    reketInstance
      .get('/cloud/project', {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': 5000,
        },
      })
      .then((result) => {
        if (result && result.length) {
          setPciProjects(result);
        }
      });
  }, []);

  /** Watch URL changes to update selected menu dynamically */
  useEffect(() => {
    const listener = () => {
      setContainerURL(routingPlugin.parseContainerURL());
    };
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);

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
        `${(node.routing.hash || '/')
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

    const path = findPathToNodeByApp(
      navigationTree,
      compareFn,
      appId,
      searchHash.replace(/^#/, ''),
    );
    const target = path.pop();
    if (target) {
      setCurrentNavigationNode(target.children ? target : target.parent);
      setHighlightedNode(target);
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
      } else if (currentNavigationNode.id === 'pci') {
        navigationPlugin.navigateTo(
          'public-cloud',
          `#/pci/projects/${pciProjects[0].project_id}`,
        );
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
        .then((result) => {
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
      const count = {
        total: servicesCount?.total,
        serviceTypes: {
          ...servicesCount?.serviceTypes,
          ...(pciProjectServiceCount
            ? pciProjectServiceCount.serviceTypes
            : []),
        },
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
        className={`d-flex ${style.sidebar_logo}`}
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
          href={navigationPlugin.getURL('hub', '#/catalog')}
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
          onClick={() => setCurrentNavigationNode(currentNavigationNode.parent)}
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
                  onProjectChange={(option) => {
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
                  createLabel={t('sidebar_pci_new')}
                />
                {selectedPciProject && (
                  <span
                    className={`d-flex px-1 ${style.sidebar_clipboard}`}
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
        <Assistance containerURL={containerURL} />
      </Suspense>
    </div>
  );
}

export default Sidebar;
