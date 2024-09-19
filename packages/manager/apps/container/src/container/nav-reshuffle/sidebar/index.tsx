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
  countServices,
  findNodeById,
  findPathToNode,
  initFeatureNames,
  shouldHideElement,
  findNodeByRouting,
  splitPathIntoSegmentsWithoutRouteParams,
  IServicesCount,
} from './utils';
import { Node } from './navigation-tree/node';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { fetchFeatureAvailabilityData } from '@ovh-ux/manager-react-components';
import { SvgIconWrapper } from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

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
    isMobile,
  } = useProductNavReshuffle();
  const [servicesCount, setServicesCount] = useState<ServicesCount>(null);
  const [selectedNode, setSelectedNode] = useState<Node>(null);
  const [showSubTree, setShowSubTree] = useState<boolean>(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState<Node>(null);
  const [open, setOpen] = useState<boolean>(true);
  const [assistanceTree, setAssistanceTree] = useState<Node>(null);
  const logoLink = navigationPlugin.getURL('hub', '#/');
  const savedLocationKey = 'NAVRESHUFFLE_SAVED_LOCATION';
  const [savedNodeID, setSavedNodeID] = useState<string>(
    window.localStorage.getItem(savedLocationKey),
  );

  // Memoized calls

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

      return tree;
    };
    initializeNavigationTree();
  }, []);

  useEffect(() => {
    const fetchServiceCount = async () => {
      const result = await reketInstance.get('/services/count', {
        requestType: 'aapi',
      });
      setServicesCount(result);
      return result;
    };
    fetchServiceCount();
  }, []);

  useEffect(() => {
    if (isMobile) setOpen(true);
  }, [isMobile])

  useEffect(() => {
    if (!currentNavigationNode) return;

    // We want to know if we already stored a node in the memory or in the local storage
    const pathname = location.pathname;
    let savedNode: Node = null;
    if (savedNodeID && !selectedSubMenu) {
      savedNode = findNodeById(currentNavigationNode, savedNodeID);
      if (!savedNode || !savedNode.universe) {
        setSavedNode(null);
        return;
      }
    }
    const currentNode: Node = selectedSubMenu || savedNode;

    if (currentNode) {
      // We already stored a node, we want to know if it stills in coherence with the current path
      // If not, we reset the node to null to not keep wrong information.
      const universe = findNodeById(currentNavigationNode, currentNode.universe);
      // A node need a valid universe, if we can't find it, we reset it.
      if (universe) {
        // We have to parse the path to try to match it with the stored node
        const parsedPath = splitPathIntoSegmentsWithoutRouteParams(
          currentNode.routing.hash
            ? currentNode.routing.hash.replace(
              '#',
              currentNode.routing.application,
            )
            : '/' + currentNode.routing.application,
        );

        // If we match the stored node with the path, it's coherent and we reselect the stored node.
        // If not, we reset it
        if (
          parsedPath.reduce(
            (acc: boolean, segment: string) =>
              acc && pathname.includes(segment),
            true,
          )
        ) {
          selectSubMenu(currentNode);
          setSelectedNode(universe);
          setShowSubTree(Boolean(universe));

          return;
        } else {
          selectedNode ? setSelectedNode(null) : setSavedNode(null);
        }
      } else {
        selectedNode ? setSelectedNode(null) : setSavedNode(null);
      }
    }

    // If we didn't have a stored node or if we have reset it,
    // we search in the full navigation tree a node that could match the current path
    const foundNode = findNodeByRouting(currentNavigationNode, pathname);
    if (foundNode) {
      selectSubMenu(foundNode.node);
      setSelectedNode(foundNode.universe);
      setShowSubTree(Boolean(foundNode.universe));
    }
  }, [currentNavigationNode, location]);

  /**
   * Initialize menu items based on currentNavigationNode
   */
  useEffect(() => {
    if (!currentNavigationNode || !servicesCount) return;
    const count = {
      total: servicesCount?.total,
      serviceTypes: { ...servicesCount?.serviceTypes },
    };
    processNode(count, currentNavigationNode);
  }, [currentNavigationNode, servicesCount]);

  // Functions

  const computeNodeCount = (
    count: IServicesCount,
    node: Node,
  ): number | boolean => {
    if (node.count === false) return node.count;
    return countServices(count, node);
  };

  const processNode = (count: IServicesCount, node: Node) => {
    node.count = computeNodeCount(count, node);
    node.children?.map((childNode: Node) => processNode(count, childNode));
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

  // Callbacks

  const toggleSidebar = () => {
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

  const selectSubMenu = (node: Node) => {
    setSelectedSubMenu(node);
    setSavedNode(node);
    isMobile ? closeNavigationSidebar() : setOpen(false);
  };

  const closeSubMenu = () => {
    setShowSubTree(false);
  };

  const menuClickHandler = (node: Node) => {
    setSelectedNode(node);
    setSelectedSubMenu(null);
    setShowSubTree(true);

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
  };

  const onEnter = (node: Node) => {
    const getFirstChild = (node: Node): Node =>
      !node.children ? node : getFirstChild(node.children[0]);
    const firstElement = window.document.getElementById(
      getFirstChild(node)?.idAttr,
    );
    if (firstElement) firstElement.focus();
  };

  return (
    <div
      className={`${style.sidebar} ${
        selectedNode ? style.sidebar_selected : ''
        }`}
    >
      <div
        className={`${style.sidebar_wrapper} ${!open && style.sidebar_short}`}
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
            <img
              className={`${open ? 'mx-4' : 'mx-2'} my-3`}
              src={open ? logo : shortLogo}
              alt="OVHcloud"
              aria-hidden="true"
            />
          </a>
        )}

        <div
          className={style.sidebar_menu}
          role="menubar"
        >
          <ul id="menu" role="menu">

          <li className="px-3 mb-3 mt-2 h-8">
              {open && currentNavigationNode && (
                <h2>{t(currentNavigationNode.translation)}</h2>
              )}
          </li>

            {currentNavigationNode?.children
              ?.filter((node) => !shouldHideElement(node, node.count))
              .map((node: Node) => (
                <li
                  key={node.id}
                  id={node.id}
                  className={`${style.sidebar_menu_items} ${
                    node.id === selectedNode?.id
                    ? style.sidebar_menu_items_selected
                    : ''
                    }`}
                  role="menuitem"
                >
                  <SidebarLink
                    node={node}
                    count={node.count}
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
              onClick={() =>
                trackingPlugin.trackClick({
                  name: 'navbar_v3_entry_home::cta_add_a_service',
                  type: 'action',
                })
              }
              href={navigationPlugin.getURL('catalog', '/')}
              role="link"
              title={t('sidebar_service_add')}
            >
              <div className='flex justify-center align-middle p-0 m-0'>
                <SvgIconWrapper name={OvhProductName.SHOPPINGCARTPLUS} height={24} width={24} className='fill-[var(--ods-color-primary-500)]' />
                {open && <span className="ml-3">{t('sidebar_service_add')}</span>}
              </div>
            </OsdsButton>
          </div>
        </div>

        {assistanceTree && (
          <Suspense fallback="">
            <Assistance nodeTree={assistanceTree} selectedNode={selectedNode} isShort={!open}/>
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
      {showSubTree && (
        <SubTree
          handleBackNavigation={() => {
            if (isMobile) setSelectedNode(null);
          }}
          selectedNode={selectedSubMenu}
          handleCloseSideBar={closeSubMenu}
          handleOnSubMenuClick={selectSubMenu}
          rootNode={selectedNode}
        ></SubTree>
      )}
    </div>
  );
};

export default Sidebar;
