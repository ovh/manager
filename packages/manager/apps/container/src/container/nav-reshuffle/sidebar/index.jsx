import React, { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
// import { useReket } from '@ovh-ux/ovh-reket';
import SidebarLink from './sidebar-link';
import { countServices } from './utils';
import Assistance from './assistance';
import style from './style.module.scss';
import navigation from './navigation';

function Sidebar() {
  const { t } = useTranslation('sidebar');
  const [currentNavigationNode, setCurrentNavigationNode] = useState(
    navigation,
  );
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [servicesCount, setServicesCount] = useState(null);
  // const reketInstance = useReket();

  useEffect(() => {
    // @TODO fetch from 2API
    setServicesCount(null);
    // setServicesCount(servicesCountMock);
  }, []);

  const clickHandler = (node) => {
    if (node.children) {
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
        <img src="assets/images/icon-logo-ovh.svg" aria-hidden="true" />
        OVHcloud
      </span>
      <ul>
        {navigationHistory.length > 0 && (
          <a className={style.sidebar_back_btn} onClick={goBackHandler}>
            <span
              className="oui-icon oui-icon-chevron-left"
              aria-hidden="true"
            ></span>
            Back
          </a>
        )}
        <li>
          <h2>{currentNavigationNode.label}</h2>
        </li>
        {currentNavigationNode.children?.map((node) => (
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
