import { useEffect, useState, Suspense } from 'react';

import { useLocation } from 'react-router-dom';
import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import logo from '@/assets/images/OVHcloud_logo.svg';
import shortLogo from '@/assets/images/icon-logo-ovh.svg';
import Assistance from './Assistance';
import navigationRoot from './navigation-tree/root';
import SidebarLink from './SidebarLink';
import SubTree from './SubTree';
import style from './style.module.scss';
import {
  initTree,
  countServices,
  findNodeById,
  findPathToNode,
  initFeatureNames,
  shouldHideElement,
  findUniverse,
  splitPathIntoSegmentsWithoutRouteParams,
  IServicesCount,
} from './utils';
import { Node } from './navigation-tree/node';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { fetchFeatureAvailabilityData } from '@ovhcloud/manager-components';

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

const Sidebar = (): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const location = useLocation();
  const trackingPlugin = shell.getPlugin('tracking');
  const navigationPlugin = shell.getPlugin('navigation');
  const environmentPlugin = shell.getPlugin('environment');
  const reketInstance = useReket();

  const {
    currentNavigationNode,
    setCurrentNavigationNode,
    setNavigationTree,
    isMobile
  } = useProductNavReshuffle();
  const [servicesCount, setServicesCount] = useState<ServicesCount>(null);
  const [menuItems, setMenuItems] = useState<
    Array<{ node: Node; count: number | boolean }>
  >([]);
  const [selectedNode, setSelectedNode] = useState<Node>(null);
  const [displayedNode, setDisplayedNode] = useState<Node>(null);
  const [selectedSubmenu, setSelectedSubmenu] = useState<Node>(null);
  const [open, setOpen] = useState<boolean>(true);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(null);
  const logoLink = navigationPlugin.getURL('hub', '#/');
  const savedLocationKey = 'NAVRESHUFFLE_SAVED_LOCATION';

  const toggleSidebar = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuClickHandler = (node: Node) => {
    setSelectedNode(node);
    setDisplayedNode(node);
    setSelectedSubmenu(null);

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

  const onSidebarLeave = () => {
    clearTimeout(timer);
  };

  const onEnter = (node: Node) => {
    const getFirstChild = (node: Node): Node =>
      !node.children ? node : getFirstChild(node.children[0]);
    const firstElement = window.document.getElementById(getFirstChild(node)?.idAttr);
    if (firstElement) firstElement.focus();
  };

  /** Initialize navigation tree */
  useEffect(() => {
    let abort = false;

    const featuresListPromise = async () => {
      if (!abort) {
        const features = initFeatureNames(navigationRoot);

        const results = await fetchFeatureAvailabilityData(features);

        const region = environmentPlugin.getEnvironment().getRegion();
        const [tree] = initTree([navigationRoot], results, region);

        const mxPlanNode = findNodeById(tree, 'mxplan');
        if (mxPlanNode && region === 'CA') {
          mxPlanNode.routing.hash = '#/email_mxplan';
        }

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

  const selectSubmenu = (node: Node, parent: Node) => {
    setSelectedNode(parent);
    setDisplayedNode(parent);
    setSelectedSubmenu(node);
    window.localStorage.setItem(savedLocationKey, node.id);
    if (!isMobile) setOpen(false);
  };

  const closeSubmenu = () => {
    setDisplayedNode(null);
  };

  useEffect(() => {
    if (displayedNode) return;

    const savedNodeID = window.localStorage.getItem(
      savedLocationKey,
    );

    const pathname = location.pathname;
    if (savedNodeID) {
      const node = findNodeById(navigationRoot, savedNodeID);
      const parent = findNodeById(navigationRoot, node.universe);
      if (node && parent) {
        const nodePath = node.routing.hash
          ? node.routing.hash.replace('#', node.routing.application)
          : '/' + node.routing.application;

        const parsedPath = splitPathIntoSegmentsWithoutRouteParams(nodePath);
        const isMatching = parsedPath.reduce((acc: boolean, segment: string) => acc && pathname.includes(segment), true);
        if (isMatching) {
          selectSubmenu(node, parent);
          return;
        } else {
          window.localStorage.removeItem(savedLocationKey);
        }
      }
    }

    const { node, parent } = findUniverse(navigationRoot, pathname);
    if (node && parent) {
      selectSubmenu(node, parent);
    }
  }, []);

  const computeNodeCount = (count: IServicesCount, node: Node): number | boolean => {
    if (node.count === false) return node.count;
    return countServices(count, node);
  };

  const processNode = (count: IServicesCount, node: Node): Node => {
    return {
      ...node,
      count: computeNodeCount(count, node),
      children: node.children?.map(childNode => processNode(count, childNode))
    };
  };

  /**
 * Initialize menu items based on currentNavigationNode
 */
  useEffect(() => {
    const count = {
      total: servicesCount?.total,
      serviceTypes: { ...servicesCount?.serviceTypes },
    };

    const updatedMenuItems = currentNavigationNode.children?.map(node => ({
      node: processNode(count, node),
      count: computeNodeCount(count, node),
    }));

    setMenuItems(updatedMenuItems);
  }, [currentNavigationNode, servicesCount]);

  return (
    <div
    className={`${style.sidebar} ${
      displayedNode ? style.sidebar_selected : ''
    }`}
    >
      <div
        className={`${style.sidebar_wrapper} ${!open && style.sidebar_short}`}
      >
        <a
          role="img"
          className={`block ${style.sidebar_logo}`}
          aria-label="OVHcloud"
          target="_top"
          href={logoLink}
        >
          <img
            className={`${open ? 'mx-4' : 'mx-2'} my-3`}
            src={open ? logo : shortLogo}
            alt="OVHcloud"
            aria-hidden="true"
          />
        </a>

        <div className={style.sidebar_menu} role="menubar">
          {servicesCount && (
            <ul id="menu" onMouseOut={onSidebarLeave} onBlur={onSidebarLeave} role="menu">
              <li className="px-3 mb-3 mt-2">
                <h2 className={!open ? style.hidden : ''}>
                  {t(currentNavigationNode.translation)}
                </h2>
              </li>
              {menuItems
                ?.filter((node) => !shouldHideElement(node, node.count))
                .map(({ node, count }) => (
                  <li
                    key={node.id}
                    id={node.id}
                    className={`${style.sidebar_menu_items} ${
                      node.id === displayedNode?.id
                      ? style.sidebar_menu_items_selected
                      : ''
                    }`}
                  role="menuitem"
                  >
                    <SidebarLink
                      node={node}
                      count={count}
                      handleNavigation={() => menuClickHandler(node)}
                      handleOnClick={() => menuClickHandler(node)}
                      handleOnEnter={(node: Node) => onEnter(node)}
                    id={node.idAttr}
                      isShortText={!open}
                    />
                    {node.separator && <hr role="separator" />}
                  </li>
                ))}
            </ul>
          )}
          <div className={`m-3 ${style.sidebar_action}`}>
            <a
              onClick={() =>
                trackingPlugin.trackClick({
                  name: 'navbar_v2_cta_add_a_service',
                  type: 'action',
                })
              }
              href={navigationPlugin.getURL('catalog', '/')}
              role="link"
            title={t('sidebar_service_add')}
          >
              <span
                className={`oui-icon oui-icon-cart ${style.sidebar_action_icon}`}
                aria-hidden="true"
              ></span>
              {open && <span className="ml-3">{t('sidebar_service_add')}</span>}
            </a>
          </div>
        </div>

        {open && (
          <Suspense fallback="">
            <Assistance />
          </Suspense>
        )}

        <button className={style.sidebar_toggle_btn} onClick={toggleSidebar} role="button">
          {open && <span className="mr-2">Réduire</span>}
          <span
            className={`${
            style.sidebar_toggle_btn_first_icon
          } oui-icon oui-icon-chevron-${open ? 'left' : 'right'}`}
            aria-hidden="true"
          ></span>
          <span
            className={`oui-icon oui-icon-chevron-${open ? 'left' : 'right'}`}
            aria-hidden="true"
          ></span>
        </button>
      </div>
      {displayedNode !== null && (
        <SubTree
          handleBackNavigation={() => {
            isMobile ? setDisplayedNode(null) : setDisplayedNode(selectedNode);
          }}
          handleOnMouseOver={(node: Node) => setDisplayedNode(node)}
          selectedNode={selectedSubmenu}
          handleCloseSideBar={closeSubmenu}
          handleOnSubmenuClick={(childNode: Node) =>
            selectSubmenu(childNode, displayedNode)
          }
          rootNode={displayedNode}
        ></SubTree>
      )}
    </div>
  );
};

export default Sidebar;
