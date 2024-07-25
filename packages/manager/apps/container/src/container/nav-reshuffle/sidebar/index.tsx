import { useEffect, useState, useMemo, Suspense } from 'react';

import { useLocation } from 'react-router-dom';
import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import logo from '@/assets/images/OVHcloud_logo.svg';
import shortLogo from '@/assets/images/icon-logo-ovh.svg';
import Assistance from './Assistance';
import navigationTree from './navigation-tree/root';
import SidebarLink from './SidebarLink';
import SubTree from '@/container/nav-reshuffle/sidebar/SubTree';
import style from './style.module.scss';
import {
  initTree,
  isMobile,
  countServices,
  findNodeById,
  findPathToNode,
  initFeatureNames,
  shouldHideElement,
  findUniverse,
  splitPathIntoSegmentsWithoutRouteParams,
} from './utils';
import { Node } from './navigation-tree/node';
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
    closeNavigationSidebar,
  } = useProductNavReshuffle();
  const [servicesCount, setServicesCount] = useState<ServicesCount>(null);
  const [menuItems, setMenuItems] = useState<
    Array<{ node: Node; count: number | boolean }>
  >([]);
  const [selectedNode, setSelectedNode] = useState<Node>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<Node>(null);
  const [open, setOpen] = useState<boolean>(true);
  const [assistanceTree, setAssistanceTree] = useState<Node>(null);
  const mobile = isMobile();
  const logoLink = navigationPlugin.getURL('hub', '#/');
  const savedLocationKey = 'NAVRESHUFFLE_SAVED_LOCATION';

  const toggleSidebar = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuClickHandler = (node: Node) => {
    setSelectedNode(node);
    setSelectedSubMenu(null);

    let trackingIdComplement = 'navbar_v2_entry_';
    const history = findPathToNode(
      currentNavigationNode,
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
  const memoizedNavigationTree = useMemo(() => {
    const initializeNavigationTree = async () => {
      const features = initFeatureNames(navigationTree);

      const results: Record<string, boolean> = await reketInstance.get(
        `/feature/${features.join(',')}/availability`,
        {
          requestType: 'aapi',
        },
      );

      const region = environmentPlugin.getEnvironment().getRegion();
      const [tree] = initTree([navigationTree], results, region);

      const mxPlanNode = findNodeById(tree, 'mxplan');
      if (mxPlanNode && region === 'CA') {
        mxPlanNode.routing.hash = '#/email_mxplan';
      }

      setAssistanceTree(findNodeById(tree, 'assistance'));
      setCurrentNavigationNode(findNodeById(tree, 'sidebar'));

      return tree;
    };
    return initializeNavigationTree();
  }, [navigationTree]);

  useEffect(() => {
    const init = async () => {
      await memoizedNavigationTree;
    };
    init();
  }, [memoizedNavigationTree]);

  const memoizedServiceCount = useMemo(() => {
    return reketInstance.get('/services/count', {
      requestType: 'aapi',
    });
  }, []);

  useEffect(() => {
    memoizedServiceCount.then((servicesCount: ServicesCount) => {
      setServicesCount(servicesCount);
    });
  }, [memoizedServiceCount]);

  const selectSubMenu = (node: Node, parent: Node) => {
    setSelectedNode(parent);
    setSelectedSubMenu(node);
    window.localStorage.setItem(savedLocationKey, node.id);
    mobile ? closeNavigationSidebar() : setOpen(false);
  };

  const closeSubMenu = () => {
    setSelectedNode(null);
    setSelectedSubMenu(null);
  };

  useEffect(() => {
    if (selectedNode) return;

    const pathname = location.pathname;
    const savedNodeID = window.localStorage.getItem(savedLocationKey);
    if (!savedNodeID) return;
    const node = findNodeById(currentNavigationNode, savedNodeID);
    if (!node || !node.universe) {
      window.localStorage.removeItem(savedLocationKey);
      return;
    }

    const parent = findNodeById(currentNavigationNode, node.universe);
    if (parent) {
      const nodePath = node.routing.hash
        ? node.routing.hash.replace('#', node.routing.application)
        : '/' + node.routing.application;

      const parsedPath = splitPathIntoSegmentsWithoutRouteParams(nodePath);
      const isMatching = parsedPath.reduce(
        (acc: boolean, segment: string) => acc && pathname.includes(segment),
        true,
      );
      if (isMatching) {
        selectSubMenu(node, parent);
        return;
      } else {
        window.localStorage.removeItem(savedLocationKey);
      }
    }

    const universe = findUniverse(currentNavigationNode, pathname);
    if (universe) {
      selectSubMenu(universe.node, universe.parent);
    }
  }, [currentNavigationNode]);

  /**
   * Initialize menu items based on currentNavigationNode
   */
  useEffect(() => {
    const count: ServicesCount = {
      total: servicesCount?.total,
      serviceTypes: {
        ...servicesCount?.serviceTypes,
      } as Record<string, number>,
    };
    setMenuItems(
      currentNavigationNode.children?.map((node: Node) => ({
        node,
        count: node.count === false ? node.count : countServices(count, node),
      })),
    );
  }, [currentNavigationNode, servicesCount]);

  return (
    <div
      className={`${style.sidebar} ${
        selectedNode ? style.sidebar_selected : ''
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

        <div className={style.sidebar_menu}>
          {servicesCount && currentNavigationNode && (
            <ul id="menu">
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
                      node.id === selectedNode?.id
                        ? style.sidebar_menu_items_selected
                        : ''
                    }`}
                  >
                    <SidebarLink
                      node={node}
                      count={count}
                      handleOnClick={() => menuClickHandler(node)}
                      id={node.idAttr}
                      isShortText={!open}
                    />
                    {node.separator && <hr />}
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
            >
              <span
                className={`oui-icon oui-icon-cart ${style.sidebar_action_icon}`}
                aria-hidden="true"
              ></span>
              {open && <span className="ml-3">{t('sidebar_service_add')}</span>}
            </a>
          </div>
        </div>

        {open && assistanceTree && (
          <Suspense fallback="">
            <Assistance nodeTree={assistanceTree} />
          </Suspense>
        )}

        <button className={style.sidebar_toggle_btn} onClick={toggleSidebar}>
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
      {selectedNode !== null && (
        <SubTree
          handleBackNavigation={() => {
            if (mobile) setSelectedNode(null);
          }}
          selectedNode={selectedSubMenu}
          handleCloseSideBar={closeSubMenu}
          handleOnSubMenuClick={(childNode) =>
            selectSubMenu(childNode, selectedNode)
          }
          rootNode={selectedNode}
        ></SubTree>
      )}
    </div>
  );
};

export default Sidebar;
