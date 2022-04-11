import React, { Suspense, useEffect, useState } from 'react';

import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';

import logo from '@/assets/images/icon-logo-ovh.svg';
import Assistance from './Assistance';
import navigationRoot from './navigation-tree/root';
import PciMenu from './PCI';
import SidebarLink from './SidebarLink';
import style from './style.module.scss';
import { countServices, findNodeById } from './utils';

function Sidebar(): JSX.Element {
  const { t } = useTranslation('sidebar');
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
            findNodeById(navigationRoot, 'public-cloud').count = result.length;
            setPciProjects(result);
            setSelectedPciProject(result[0]);
          }
        });
    }
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

  const clickHandler = (node) => {
    if (node.id === 'public-cloud') {
      setIsPciMenu(true);
    } else if (node.children) {
      setNavigationHistory([...navigationHistory, currentNavigationNode]);
      setCurrentNavigationNode(node);
    } else if (node.path) {
      // @TODO use navigation plugin
      // console.log('navigate to', node.path);
    }
  };

  const goBackHandler = () => {
    setCurrentNavigationNode(navigationHistory.pop());
    setNavigationHistory(navigationHistory);
  };

  return (
    <div className={style.sidebar}>
      <span className={style.sidebar_logo}>
        <img src={logo} alt="OVHcloud" aria-hidden="true" />
        OVHcloud
      </span>
      <ul>
        {navigationHistory.length > 0 && !isPciMenu && (
          <a className={style.sidebar_back_btn} onClick={goBackHandler}>
            <span
              className="oui-icon oui-icon-chevron-left"
              aria-hidden="true"
            ></span>
            {t('sidebar_back')}
          </a>
        )}
        <li>
          <h2>{currentNavigationNode.label}</h2>
        </li>
        {isPciMenu && (
          <PciMenu
            onExit={() => setIsPciMenu(false)}
            projects={pciProjects}
            selectedProject={selectedPciProject}
            servicesCount={pciProjectServiceCount}
            onSelectProject={(project) => setSelectedPciProject(project)}
          />
        )}
        {!isPciMenu &&
          currentNavigationNode.children?.map((node) => (
            <li key={node.id}>
              <SidebarLink
                node={node}
                count={countServices(servicesCount, node)}
                onClick={() => clickHandler(node)}
              />
            </li>
          ))}
      </ul>
      <div className={style.sidebar_action}>
        <a href="#">
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
