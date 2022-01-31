import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useReket } from '@ovh-ux/ovh-reket';
import style from './style.module.scss';
import navigation from './navigation';

function SidebarLink(props) {
  const { node } = props;
  const reketInstance = useReket();
  const [count, setCount] = useState(0);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    if (node.count) {
      node
        .count({ reket: reketInstance })
        .then((result) => {
          if (isMounted.current) {
            node.count = () => Promise.resolve(result); // caching
            setCount(result);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted.current = false;
    };
  }, [node]);

  return (
    <a onClick={props.onClick}>
      {node.label}
      {node.children ? (
        <span
          className={`oui-icon oui-icon-chevron-right ${style.sidebar_arrow}`}
          aria-hidden="true"
        ></span>
      ) : (
        ''
      )}
      {count > 0 && (
        <span
          className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_chip}`}
        >
          {count}
        </span>
      )}
    </a>
  );
}

SidebarLink.propTypes = {
  onClick: PropTypes.func.isRequired,
  node: PropTypes.any,
};

/*

      <ul>
        <li>
          <SidebarLink label="Tableau de bord" />
        </li>
        <li>
          <SidebarLink label="Mes services" counter={serviceCount} />
        </li>
        <li>
          <SidebarLink label="Mon compte" />
        </li>
        <li>
          <SidebarLink label="Mes factures" />
        </li>
        <li>
          <SidebarLink label="Mes commandes" />
        </li>
        <li>
          <SidebarLink label="Sunrise" />
        </li>
        <li>
          <SidebarLink label="Marketplace" external={true} />
        </li>
      </ul>
*/

function Sidebar() {
  const [currentNavigationNode, setCurrentNavigationNode] = useState(
    navigation,
  );
  const [navigationHistory, setNavigationHistory] = useState([]);

  const clickHandler = (node) => {
    if (node.children) {
      setNavigationHistory([...navigationHistory, currentNavigationNode]);
      setCurrentNavigationNode(node);
    } else if (node.path) {
      console.log('navigate to', node.path);
      // @TODO use navigation plugin
    }
  };

  const goBackHandler = () => {
    setCurrentNavigationNode(navigationHistory.pop());
    setNavigationHistory(navigationHistory);
  };

  return (
    <div className={style.sidebar}>
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
            <SidebarLink node={node} onClick={() => clickHandler(node)} />
          </li>
        ))}
      </ul>
      <div className={style.sidebar_action}>
        <a href="#">
          <span
            className={`oui-icon oui-icon-plus ${style.sidebar_action_icon}`}
            aria-hidden="true"
          ></span>
          <span>Ajouter un service</span>
        </a>
      </div>
      <div className={style.sidebar_filler} aria-hidden="true"></div>
      <ul>
        <li>
          <h2>Assistance</h2>
        </li>
        <li>
          <SidebarLink node={{ label: "Centre d'aide" }} onClick={() => {}} />
          <SidebarLink
            node={{ label: "Demandes d'assistance" }}
            onClick={() => {}}
          />
          <SidebarLink
            node={{ label: 'Etat du réseau et incidents' }}
            onClick={() => {}}
          />
          <SidebarLink
            node={{ label: 'Niveau de support' }}
            onClick={() => {}}
          />
          <SidebarLink node={{ label: 'Live Chat' }} onClick={() => {}} />
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
