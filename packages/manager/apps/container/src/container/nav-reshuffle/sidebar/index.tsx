import { useEffect, useState, useMemo, Suspense, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { aapi } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { fetchFeatureAvailabilityData } from '@ovh-ux/manager-react-components';
import { SvgIconWrapper } from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import {
  OsdsButton,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { useShell } from '@/context';
import Assistance from './Assistance';
import navigationTree from './navigation-tree/root';
import SidebarLink from './SidebarLink';
import SubTree from '@/container/nav-reshuffle/sidebar/SubTree';
import style from './style.module.scss';
import {
  initTree,
  findNodeById,
  findPathToNode,
  initFeatureNames,
  shouldHideElement,
  findNodeByRouting,
  isMatchingNode,
  ServicesTypes,
  hasService,
} from './utils';
import { Node } from './navigation-tree/node';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { ExcludedNodeIdsList } from './navigation-tree/excluded';
import { ShortAssistanceLinkItem } from './Assistance/ShortAssistanceLinkItem';

interface ServicesCountError {
  url: string;
  status: number;
  message: string;
}
interface ServicesCount {
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

  const {
    currentNavigationNode,
    setCurrentNavigationNode,
    closeNavigationSidebar,
    isMobile,
    isAnimated,
    setIsAnimated,
    isNavigationSidebarOpened,
    popoverPosition,
  } = useProductNavReshuffle();
  const [servicesCount, setServicesCount] = useState<ServicesCount>(null);
  const [selectedNode, setSelectedNode] = useState<Node>(null);
  const [showSubTree, setShowSubTree] = useState<boolean>(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState<Node>(null);
  const [open, setOpen] = useState<boolean>(
    isMobile ? isNavigationSidebarOpened : true,
  );
  const [assistanceTree, setAssistanceTree] = useState<Node>(null);
  const logoLink = navigationPlugin.getURL('hub', '#/');
  const savedLocationKey = 'NAVRESHUFFLE_SAVED_LOCATION';
  const [savedNodeID, setSavedNodeID] = useState<string>(
    window.localStorage.getItem(savedLocationKey),
  );
  const [isManuallyClosed, setIsManuallyClosed] = useState<boolean>(false);

  // As we don't update any state when we set the hasService variable
  // we miss a render when we don't open the subtree
  // So we simulate a state update when we set the hasService variable
  const [, updateState]: [
    unknown,
    React.Dispatch<React.SetStateAction<unknown>>,
  ] = useState<unknown>();
  const forceUpdate = useCallback(() => updateState({}), []);

  // Functions

  const processNode = (
    servicesTypes: ServicesTypes,
    node: Node,
    isCurrentNavigationNode = false,
  ) => {
    node.children?.map((childNode: Node) =>
      processNode(servicesTypes, childNode),
    );
    node.hasService = hasService(servicesTypes, node, ExcludedNodeIdsList);
    if (isCurrentNavigationNode) forceUpdate();
  };

  const setSavedNode = (node: Node) => {
    if (node) {
      setSavedNodeID(node.id);
      window.localStorage.setItem(savedLocationKey, node.id);
    } else {
      setSavedNodeID(null);
      window.localStorage.removeItem(savedLocationKey);
    }
  };

  const selectLvl1Node = (node: Node | null) => {
    setSelectedNode(node);
    setShowSubTree(!!node);
  };

  const selectSubMenu = (node: Node) => {
    setSelectedSubMenu(node);
    setSavedNode(node);
    if (isMobile) {
      closeNavigationSidebar();
    } else if (!node?.children?.length) {
      setOpen(false);
    }
  };

  /** Initialize navigation tree */
  useEffect(() => {
    const initializeNavigationTree = async () => {
      if (currentNavigationNode) return;
      const features = initFeatureNames(navigationTree);

      const results = await fetchFeatureAvailabilityData(features);

      const region = environmentPlugin.getEnvironment().getRegion();
      const [tree] = initTree([navigationTree], results, region);

      const mxPlanNode = findNodeById(tree, 'mxplan');
      if (mxPlanNode && region === 'CA') {
        mxPlanNode.routing.hash = '#/email_mxplan';
      }
      setAssistanceTree(findNodeById(tree, 'assistance'));
      setCurrentNavigationNode(findNodeById(tree, 'sidebar'));
    };
    initializeNavigationTree();
  }, []);

  useEffect(() => {
    aapi
      .get('/services/count')
      .then((result: Record<string, any>) => {
        setServicesCount(result.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isMobile) setOpen(isNavigationSidebarOpened);
  }, [isMobile, isNavigationSidebarOpened]);

  useEffect(() => {
    if (!currentNavigationNode) return;

    // We want to know if we already stored a node in the memory or in the local storage
    const { pathname } = location;
    let savedNode: Node = null;
    if (savedNodeID && !selectedSubMenu) {
      savedNode = findNodeById(currentNavigationNode, savedNodeID);
      if (!savedNode || !savedNode.universe) {
        setSavedNode(null);
        return;
      }
    }
    const currentNode: Node = selectedSubMenu || savedNode;

    if (currentNode?.routing) {
      // We already stored a node, we want to know if it stills in coherence with the current path
      // If not, we reset the node to null to not keep wrong information.
      const universe = findNodeById(
        currentNavigationNode,
        currentNode.universe,
      );
      // A node need a valid universe, if we can't find it, we reset it.
      if (universe) {
        if (isMatchingNode(currentNode, pathname)?.value) {
          selectSubMenu(currentNode);
          selectLvl1Node(universe);
          return;
        }
      }
    }
    if (selectedNode) {
      selectLvl1Node(null);
    } else {
      setSavedNode(null);
    }

    // If we didn't have a stored node or if we have reset it,
    // we search in the full navigation tree a node that could match the current path
    const foundNode = findNodeByRouting(currentNavigationNode, pathname);
    if (foundNode) {
      selectSubMenu(foundNode.node);
      selectLvl1Node(foundNode.universe);
    } else {
      setOpen(true);
    }
  }, [currentNavigationNode, location]);

  /**
   * Initialize menu items based on currentNavigationNode
   */
  useEffect(() => {
    if (!currentNavigationNode || !servicesCount) return;
    processNode({ ...servicesCount.serviceTypes }, currentNavigationNode, true);
  }, [currentNavigationNode, servicesCount]);

  // Callbacks

  const toggleSidebar = () => {
    setIsAnimated(true);
    setOpen((prevOpen) => {
      const nextOpen = !prevOpen;
      const trackingName = nextOpen
        ? 'navbar_v3::open_navbar'
        : 'navbar_v3::reduce_navbar';
      trackingPlugin.trackClick({
        name: trackingName,
        type: 'action',
      });
      return nextOpen;
    });
  };

  const closeSubMenu = () => {
    setIsAnimated(true);
    setShowSubTree(false);

    const close = () => {
      setIsManuallyClosed(true);
      setSelectedSubMenu(null);
    };

    if (isMobile) {
      close();
    } else {
      setTimeout(() => {
        close();
      }, 300);
    }
  };

  const menuClickHandler = (node: Node) => {
    setIsAnimated(true);
    setSelectedSubMenu(null);
    selectLvl1Node(node);
    setIsManuallyClosed(false);

    let trackingIdComplement = 'navbar_v3_entry_home::';
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

    if (node.forceNavigate && node.routing) {
      navigationPlugin.navigateTo(node.routing.application, node.routing.hash);
    }
  };

  const onEnter = (node: Node) => {
    const getFirstChild = (node: Node): Node =>
      !node.children ? node : getFirstChild(node.children[0]);
    const firstElement = window.document.getElementById(
      getFirstChild(node)?.idAttr,
    );
    if (firstElement) firstElement.focus();
  };

  const isLoading = useMemo<boolean>(() => !currentNavigationNode, [
    currentNavigationNode,
  ]);

  return (
    <div
      className={`${style.sidebar} ${
        selectedNode && !isManuallyClosed ? style.sidebar_selected : ''
      }`}
    >
      <div
        className={`${style.sidebar_wrapper} ${!open &&
          style.sidebar_short} ${isAnimated && style.sidebar_animated}`}
      >
        <div className={style.sidebar_lvl1}>
          {!isMobile && (
            <a
              role="img"
              className={`block ${style.sidebar_logo}`}
              aria-label="OVHcloud"
              target="_top"
              href={logoLink}
            >
              <SvgIconWrapper
                name={open ? OvhProductName.OVH_LOGO : OvhProductName.OVH_SHORT_LOGO}
                className={`${open ? 'mx-4' : 'mx-2'} my-3`}
                aria-hidden="true"
                height={40}
                width={open ? 200 : 50}
              />
            </a>
          )}

          <div className={style.sidebar_menu} role="menubar" aria-label={t('sidebar_description')}>
            <ul id="menu" role="menu">
              <li className="px-3 mb-3 mt-2 h-8">
                {open && currentNavigationNode && (
                  <h2 className="whitespace-nowrap">
                    {t(currentNavigationNode.translation)}
                  </h2>
                )}
              </li>

              {currentNavigationNode?.children
                ?.filter((node) => !shouldHideElement(node, node.hasService))
                .map((node: Node) => (
                  <li
                    key={node.id}
                    id={node.id}
                    className={`py-1 ${style.sidebar_menu_items} ${
                      node.id === selectedNode?.id
                        ? style.sidebar_menu_items_selected
                        : ''
                    }`}
                    role="menuitem"
                  >
                    <SidebarLink
                      node={node}
                      hasService={node.hasService}
                      isLoading={isLoading}
                      handleOnClick={() => menuClickHandler(node)}
                      handleOnEnter={(node: Node) => onEnter(node)}
                      id={node.idAttr}
                      isShortText={!open}
                    />
                    {node.separator && <hr role="separator" />}
                  </li>
                ))}
            </ul>
            <div className={`m-2.5 mt-10`}>
              <OsdsButton
                variant={ODS_BUTTON_VARIANT.stroked}
                size={ODS_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => {
                  setIsAnimated(true);
                  return trackingPlugin.trackClick({
                    name: 'navbar_v3_entry_home::cta_add_a_service',
                    type: 'action',
                  });
                }}
                href={navigationPlugin.getURL('catalog', '/')}
                role="link"
                title={t('sidebar_service_add')}
              >
                <div className="flex justify-center align-middle p-0 m-0">
                  <SvgIconWrapper
                    name={OvhProductName.SHOPPINGCARTPLUS}
                    height={24}
                    width={24}
                    className="fill-[var(--ods-color-primary-500)]"
                  />
                  {open && (
                    <span className="ml-3">{t('sidebar_service_add')}</span>
                  )}
                </div>
              </OsdsButton>
            </div>
          </div>

          {assistanceTree && (
            <Suspense fallback="">
              <Assistance
                nodeTree={assistanceTree}
                selectedNode={selectedNode}
                isLoading={isLoading}
                isShort={!open}
              />
            </Suspense>
          )}

          <button
            className={style.sidebar_toggle_btn}
            onClick={toggleSidebar}
            role="button"
          >
            {open && <span className="mr-2">{t('sidebar_reduce')}</span>}
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
      </div>
      {selectedNode && !isManuallyClosed && (
        <SubTree
          selectedNode={selectedSubMenu}
          handleCloseSideBar={closeSubMenu}
          handleOnSubMenuClick={selectSubMenu}
          rootNode={selectedNode}
          open={showSubTree}
        ></SubTree>
      )}
      {!open && popoverPosition && (
        <div
          className="flex justify-center my-2 position-fixed left-[2px] z-[10000]"
          style={{
            top: popoverPosition - 70,
          }}
        >
          <OsdsPopover id="useful-links" role="menu">
            <OsdsButton
              slot="popover-trigger"
              className="w-[4rem]"
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.ghost}
              size={ODS_BUTTON_SIZE.md}
              title={t('sidebar_assistance_title')}
              onClick={() => setIsAnimated(true)}
              contrasted
            >
              <OsdsIcon
                name={ODS_ICON_NAME.ELLIPSIS}
                size={ODS_ICON_SIZE.sm}
                contrasted
              />
            </OsdsButton>
            <OsdsPopoverContent>
              {assistanceTree.children.map((node: Node) => (
                <ShortAssistanceLinkItem key={node.id} node={node} />
              ))}
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
