import React, { useEffect, useState, Suspense } from 'react';

import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

import logo from '@/assets/images/OVHcloud_logo.svg';
import Assistance from './Assistance';
import navigationRoot from './navigation-tree/root';
import SidebarLink from './SidebarLink';
import style from './style.module.scss';
import { initTree, countServices, findPathToNode } from './utils';

function Sidebar(): JSX.Element {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigationPlugin = shell.getPlugin('navigation');
  const routingPlugin = shell.getPlugin('routing');
  const environment = shell.getPlugin('environment').getEnvironment();
  const currentRegion = environment.getRegion();
  const reketInstance = useReket();

  const [containerURL, setContainerURL] = useState(
    routingPlugin.parseContainerURL(),
  );
  const [navigationTree, setNavigationTree] = useState({});
  const [currentNavigationNode, setCurrentNavigationNode] = useState(
    navigationTree,
  );
  const [servicesCount, setServicesCount] = useState(null);
  const [pciProjects, setPciProjects] = useState(null);
  const [selectedPciProject, setSelectedPciProject] = useState(null);
  const [pciProjectServiceCount, setPciProjectServiceCount] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);

  const logoLink = navigationPlugin.getURL('hub', '#/');

  const menuClickHandler = (node) => {
    if (node.children) {
      setCurrentNavigationNode(node);
      if (node.id === 'pci' && selectedPciProject) {
        navigationPlugin.navigateTo(
          'public-cloud',
          `#/pci/projects/${selectedPciProject.project_id}`,
        );
      }
      setHighlightedNode(null);
    } else {
      setHighlightedNode(node);
    }
  };

  /** Initialize navigation tree */
  useEffect(() => {
    const tree = initTree(navigationRoot);
    setNavigationTree(tree);
    setCurrentNavigationNode(tree);
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
    const { appId, appHash } = routingPlugin.parseContainerURL();
    const getRouteComparator = (isExact) => {
      return (node) => {
        if (!node?.routing?.hash) return false;
        const hashRegexp = new RegExp(
          `${(node.routing.hash || '/')
            .replace(/^#/, '')
            .replace(/{[^}]+}/g, '[^/]+')}?${isExact ? '$' : ''}`,
        );
        return node.routing.application === appId && hashRegexp.test(appHash);
      };
    };
    let path = findPathToNode(navigationTree, getRouteComparator(true));
    if (!path || path.length === 0) {
      path = findPathToNode(navigationTree, getRouteComparator(false));
    }
    const target = path.pop();
    if (target) {
      if (target.children) {
        setCurrentNavigationNode(target);
        setHighlightedNode(null);
      } else {
        setCurrentNavigationNode(target.parent);
        setHighlightedNode(target);
      }
    }
  }, [navigationTree]);

  /**
   * Synchronize selected public cloud project with pci's project id in URL
   */
  useEffect(() => {
    if (!pciProjects?.length) return;
    const { appHash } = routingPlugin.parseContainerURL();
    const pciProjectMatch = (appHash || '').match(/^\/pci\/projects\/([^/]+)/);
    if (pciProjectMatch && pciProjectMatch.length >= 2) {
      const [, pciProjectId] = pciProjectMatch;
      const project = pciProjects.find((p) => p.project_id === pciProjectId);
      if (project) {
        setSelectedPciProject(project);
        return;
      }
    }
    setSelectedPciProject(pciProjects[0]);
  }, [pciProjects, containerURL]);

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
          if (!abort) {
            setPciProjectServiceCount(result);
          }
        });
    }
    return () => {
      abort = true;
    };
  }, [selectedPciProject]);

  /**
   * Displayed menu items are the children of current navigation node
   * filtered by region if the attribute is provided
   */
  const getMenuItems = () => {
    const count = {
      total: servicesCount?.total,
      serviceTypes: {
        ...servicesCount?.serviceTypes,
      },
    };
    if (pciProjectServiceCount) {
      count.serviceTypes = {
        ...pciProjectServiceCount.serviceTypes,
        ...servicesCount?.serviceTypes,
      };
    }
    return currentNavigationNode.children
      ?.filter((node) => {
        if (node.region) {
          const regionFilter = [].concat(node.region);
          return regionFilter.includes(currentRegion);
        }
        if (node.hideIfEmpty && !node.count) {
          return false;
        }
        return true;
      })
      .map((node) => (
        <li
          key={node.id}
          className={node === highlightedNode ? style.sidebar_selected : ''}
        >
          <SidebarLink
            node={node}
            count={
              node.count === false ? node.count : countServices(count, node)
            }
            linkParams={{
              projectId: selectedPciProject?.project_id,
            }}
            onClick={() => menuClickHandler(node)}
            id={node.idAttr}
          />
        </li>
      ));
  };

  return (
    <div className={style.sidebar}>
      <a
        role="img"
        className={style.sidebar_logo}
        aria-label="OVHcloud"
        target="_top"
        href={logoLink}
      >
        <img src={logo} alt="OVHcloud" aria-hidden="true" />
      </a>
      <ul>
        {currentNavigationNode !== navigationTree && (
          <a
            className={style.sidebar_back_btn}
            onClick={() =>
              setCurrentNavigationNode(currentNavigationNode.parent)
            }
          >
            <span
              className="oui-icon oui-icon-chevron-left"
              aria-hidden="true"
            ></span>
            {t('sidebar_back')}
          </a>
        )}
        {/^pci/.test(currentNavigationNode?.id) && pciProjects && (
          <li>
            <select
              value={pciProjects.indexOf(selectedPciProject)}
              onChange={(e) => {
                const project = pciProjects[e.target.value];
                setSelectedPciProject(project);
                navigationPlugin.navigateTo(
                  'public-cloud',
                  `#/pci/projects/${project.project_id}`,
                );
              }}
            >
              {pciProjects.map((project, index) => (
                <option value={index} key={index}>
                  {project.description || project.project_id}
                </option>
              ))}
            </select>
          </li>
        )}
        <li>
          <h2>{t(currentNavigationNode.translation)}</h2>
        </li>
        {getMenuItems()}
      </ul>
      <div className={style.sidebar_action}>
        <a href={navigationPlugin.getURL('hub', '#/catalog')}>
          <span
            className={`oui-icon oui-icon-plus ${style.sidebar_action_icon}`}
            aria-hidden="true"
          ></span>
          <span>{t('sidebar_service_add')}</span>
        </a>
      </div>
      <div className={style.sidebar_filler} aria-hidden="true"></div>
      <Suspense fallback="">
        <Assistance />
      </Suspense>
    </div>
  );
}

export default Sidebar;
