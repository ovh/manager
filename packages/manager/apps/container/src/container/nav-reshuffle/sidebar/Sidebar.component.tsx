import logo from '@/assets/images/OVHcloud_logo.svg';
import { FC, Suspense, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Assistance from './Assistance';
import ProjectSelector, { PciProject } from './ProjectSelector/ProjectSelector';
import SidebarLink from './SidebarLink';
import style from './style.module.scss';
import { Node } from './navigation-tree/node';
import { ServicesCount } from './sidebar.type';

type SidebarComponentProps = {
  logoLink: string;
  currentNavigationNode: Node;
  highlightedNode: Node;
  setCurrentNavigationNode: (node: Node) => void;
  trackingPlugin: Record<string, CallableFunction>;
  navigationPlugin: any;

  setIsAssistanceOpen: (val: boolean) => void;
  fetchPciProjects: () => void;
  pciProjects: PciProject[];
  selectedPciProject: PciProject;
  pciError: boolean;
  menuItems: Array<{ node: Node; count: number | boolean }>;
  menuClickHandler: (node: Node) => void;
  containerURL: {
    appId: string;
    appHash: string;
  };
  isAssistanceOpen: boolean;
  betaVersion: number;
  servicesCount: ServicesCount;
};

const shouldHideElement = (
  node: Node,
  count: number | boolean,
  betaVersion: number,
) => {
  if (node.hideIfEmpty && !count) {
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

const SidebarComponent: FC<SidebarComponentProps> = memo(({
  logoLink,
  currentNavigationNode,
  trackingPlugin,
  navigationPlugin,
  servicesCount,
  betaVersion,
  pciError,
  setIsAssistanceOpen,
  fetchPciProjects,
  pciProjects,
  selectedPciProject,
  menuItems,
  menuClickHandler,
  highlightedNode,
  containerURL,
  setCurrentNavigationNode,
  isAssistanceOpen,
}) => {
  const { t } = useTranslation('sidebar');

  return (
    <div className={style.sidebar}>
      <a
        role="img"
        className={`block ${style.sidebar_logo}`}
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
          href={navigationPlugin.getURL('catalog', '/')}
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
          onClick={() => {
            setCurrentNavigationNode(currentNavigationNode.parent);
            setIsAssistanceOpen(false);
          }}
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
                  onProjectChange={(option: typeof selectedPciProject) => {
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
                  onSeeAllProjects={() => {
                    navigationPlugin.navigateTo(
                      'public-cloud',
                      `#/pci/projects`,
                    );
                  }}
                  onMenuOpen={() => setIsAssistanceOpen(false)}
                  createLabel={t('sidebar_pci_new')}
                  seeAllButton={true}
                  seeAllLabel={t('sidebar_pci_all')}
                />
                {pciError && (
                  <button
                    className={style.sidebar_pci_refresh}
                    onClick={() => fetchPciProjects()}
                  >
                    <span>{t('sidebar_pci_load_error')}</span>
                    <span className="oui-icon oui-icon-refresh"></span>
                  </button>
                )}
                {selectedPciProject && (
                  <span
                    className={`flex px-1 ${style.sidebar_clipboard}`}
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
                {!shouldHideElement(node, count, betaVersion) && (
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
        <Assistance
          containerURL={containerURL}
          isOpen={isAssistanceOpen}
          onToggle={(isOpen) => setIsAssistanceOpen(isOpen)}
        />
      </Suspense>
    </div>
  );
});

export default SidebarComponent;
