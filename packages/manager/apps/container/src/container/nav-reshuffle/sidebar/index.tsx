import React, { useEffect, useMemo, useState, Suspense } from 'react';

import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

import logo from '@/assets/images/OVHcloud_logo.svg';
import Assistance from './Assistance';
import navigationRoot from './navigation-tree/root';
import SidebarLink from './SidebarLink';
import style from './style.module.scss';
import { countServices, findPathToNode } from './utils';

function Sidebar(): JSX.Element {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigationPlugin = shell.getPlugin('navigation');
  const routingPlugin = shell.getPlugin('routing');
  const environment = shell.getPlugin('environment').getEnvironment();
  const currentRegion = environment.getRegion();
  const reketInstance = useReket();
  const [currentNavigationNode, setCurrentNavigationNode] = useState(
    navigationRoot,
  );
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [servicesCount, setServicesCount] = useState(null);
  const [isPciMenu, setIsPciMenu] = useState(false);
  const [pciProjects, setPciProjects] = useState(null);
  const [selectedPciProject, setSelectedPciProject] = useState(null);
  const [pciProjectServiceCount, setPciProjectServiceCount] = useState(null);
  const [initialNavigationPath, setInitialNavigationPath] = useState([]);

  const clickHandler = (node) => {
    if (node.children) {
      setNavigationHistory([...navigationHistory, currentNavigationNode]);
      setCurrentNavigationNode(node);
    }
  };

  const goBackHandler = () => {
    setCurrentNavigationNode(navigationHistory.pop());
    setNavigationHistory(navigationHistory);
  };

  /**
   * At startup we try to find the initial path to the node corresponding
   * to the current URL
   */
  useEffect(() => {
    const { appId, appHash } = routingPlugin.parseContainerURL();
    const path = findPathToNode(navigationRoot, (node) => {
      if (!node?.routing) return false;
      const hashRegexp = new RegExp(
        (node.routing.hash || '/')
          .replace(/^#/, '')
          .replace(/{[^}]+}/g, '[^/]+'),
      );
      return node.routing.application === appId && hashRegexp.test(appHash);
    });
    setInitialNavigationPath(path);
  }, []);

  /**
   * While the initial path is not empty, navigate down inside the path
   */
  useEffect(() => {
    if (initialNavigationPath.length) {
      const [nextNode] = initialNavigationPath;
      if (nextNode !== currentNavigationNode) {
        clickHandler(nextNode);
      }
      setInitialNavigationPath(initialNavigationPath.slice(1));
    }
  }, [initialNavigationPath]);

  /**
   * Fetch service count per service type
   */
  useEffect(() => {
    reketInstance
      .get('/services/count', {
        requestType: 'aapi',
      })
      .then((result) => setServicesCount(result));
  }, []);

  /**
   * Fetch public cloud projects when entering the 'services' menu
   */
  useEffect(() => {
    if (currentNavigationNode.id === 'services' && !pciProjects) {
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
            const { appHash } = routingPlugin.parseContainerURL();
            const pciProjectMatch = (appHash || '').match(
              /^#\/pci\/projects\/([^/]+)/,
            );
            if (pciProjectMatch && pciProjectMatch.length >= 2) {
              const [, pciProjectId] = pciProjectMatch;
              const project = result.find((p) => p.project_id === pciProjectId);
              if (project) {
                setSelectedPciProject(project);
                return;
              }
            }
            setSelectedPciProject(result[0]);
          }
        });
    }
  }, [currentNavigationNode]);

  /**
   * Check if we are inside a public cloud section
   */
  useEffect(() => {
    const currentNavigationPath = findPathToNode(
      navigationRoot,
      (node) => node === currentNavigationNode,
    );
    setIsPciMenu(false);
    currentNavigationPath.forEach((node) => {
      if (node.id === 'public-cloud') {
        setIsPciMenu(true);
      }
    });
  }, [currentNavigationNode]);

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
  const menuItems = useMemo(() => {
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
        <li key={node.id}>
          <SidebarLink
            node={node}
            count={countServices(count, node)}
            linkParams={{
              projectId: selectedPciProject?.project_id,
            }}
            onClick={() => clickHandler(node)}
            id={node.idAttr}
          />
        </li>
      ));
  }, [currentNavigationNode, servicesCount, pciProjectServiceCount]);

  return (
    <div className={style.sidebar}>
      <span role="img" className={style.sidebar_logo} aria-label="OVHcloud">
        <img src={logo} alt="OVHcloud" aria-hidden="true" />
      </span>
      <ul>
        {navigationHistory.length > 0 && (
          <a className={style.sidebar_back_btn} onClick={goBackHandler}>
            <span
              className="oui-icon oui-icon-chevron-left"
              aria-hidden="true"
            ></span>
            {t('sidebar_back')}
          </a>
        )}
        {isPciMenu && selectedPciProject && (
          <li>
            <select
              value={pciProjects.indexOf(selectedPciProject)}
              onChange={(e) =>
                setSelectedPciProject(pciProjects[e.target.value])
              }
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
        {menuItems}
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
