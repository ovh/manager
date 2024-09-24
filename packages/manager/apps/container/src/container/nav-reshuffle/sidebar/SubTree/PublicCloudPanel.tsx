import ProjectSelector from '../ProjectSelector/ProjectSelector';
import { PciProject } from '../ProjectSelector/PciProject';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Node } from '../navigation-tree/node';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import { shouldHideElement } from '@/container/nav-reshuffle/sidebar/utils';
import { Location, useLocation } from 'react-router-dom';
import style from '../style.module.scss';
import SubTreeSection from '@/container/nav-reshuffle/sidebar/SubTree/SubTreeSection';
import { PUBLICCLOUD_UNIVERSE_ID } from '../navigation-tree/services/publicCloud';

export interface PublicCloudPanelProps {
  rootNode: Node;
  selectedNode: Node;
  handleOnSubMenuClick(node: Node): void;
}

export const PublicCloudPanel: React.FC<ComponentProps<
  PublicCloudPanelProps
>> = ({
  rootNode,
  selectedNode,
  handleOnSubMenuClick,
}: PublicCloudPanelProps) => {
  const [selectedPciProject, setSelectedPciProject] = useState<PciProject>(
    null,
  );

  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigationPlugin = shell.getPlugin('navigation');
  const trackingPlugin = shell.getPlugin('tracking');
  const location = useLocation();

  const parseContainerURL = (
    location: Location,
  ): { appId: string; appHash: string } => {
    const [, appId, appHash] = /^\/([^/]*)(.*)/.exec(location.pathname);
    return { appId, appHash: `${appHash}${location.search}` };
  };

  const [containerURL, setContainerURL] = useState(parseContainerURL(location));

  const {
    data: pciProjects,
    isError: pciError,
    isSuccess: pciSuccess,
    refetch: refetchPciProjects,
  } = useQuery({
    queryKey: ['pci-projects'],
    queryFn: () => {
      return fetchIcebergV6<PciProject>({
        route: '/cloud/project',
        sortBy: 'description',
      });
    },
    select: (response) => {
      return response.data as PciProject[];
    },
  });

  const { data: defaultPciProject, status: defaultPciProjectStatus } = useQuery(
    {
      queryKey: ['default-pci-project'],
      queryFn: () => {
        return fetchIcebergV6<PciProject>({
          route: '/me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
        });
      },
      select: (response) => {
        return response?.data?.length ? (response.data[0] as PciProject) : null;
      },
      enabled: rootNode.id === PUBLICCLOUD_UNIVERSE_ID && !selectedPciProject,
      retry: false,
    },
  );

  /** Watch URL changes to update selected menu dynamically */
  useEffect(() => {
    setContainerURL(parseContainerURL(location));
  }, [location]);

  /**
   * Synchronize selected public cloud project with pci's project id in URL
   */
  useEffect(() => {
    const { appHash } = containerURL;
    if (appHash.startsWith('/pci/projects/new')) {
      setSelectedPciProject(null);
    } else {
      if (!pciProjects?.length) return;

      const pciProjectMatch = (appHash || '').match(
        /^\/pci\/projects\/([^/?]+)/,
      );
      let project;
      if (pciProjectMatch && pciProjectMatch.length >= 2) {
        const [, pciProjectId] = pciProjectMatch;
        project = pciProjects.find(
          (p: { project_id: string }) => p.project_id === pciProjectId,
        );
      }
      if (project) {
        setSelectedPciProject(project);
      }
    }
  }, [pciProjects, rootNode, containerURL]);

  useEffect(() => {
    if (defaultPciProjectStatus === 'success') {
      setSelectedPciProject(defaultPciProject);
    } else if (defaultPciProjectStatus === 'error' && pciProjects?.length) {
      setSelectedPciProject(pciProjects[0]);
    }
  }, [defaultPciProject, defaultPciProjectStatus, pciProjects]);

  useEffect(() => {
    if (
      selectedPciProject &&
      rootNode.id === PUBLICCLOUD_UNIVERSE_ID &&
      containerURL.appId != rootNode.routing?.application
    ) {
      navigationPlugin.navigateTo(
        rootNode.routing.application,
        rootNode.routing.hash.replace(
          '{projectId}',
          selectedPciProject.project_id,
        ),
      );
    }
  }, [selectedPciProject, rootNode]);

  return (
    <>
      <li className="px-3" data-testid="public-cloud-panel">
        <ProjectSelector
          isLoading={!pciSuccess}
          projects={pciProjects}
          selectedProject={selectedPciProject}
          onProjectChange={(option: typeof selectedPciProject) => {
            if (selectedPciProject !== option) {
              trackingPlugin.trackClick({ name: 'navbar_v3_entry_home::pci::specific_project_from_listing', type: 'navigation' });
              setSelectedPciProject(option);
              navigationPlugin.navigateTo(
                'public-cloud',
                `#/pci/projects/${option.project_id}`,
              );
            }
          }}
          onProjectCreate={() => {
            navigationPlugin.navigateTo('public-cloud', `#/pci/projects/new`);
          }}
          onSeeAllProjects={() => {
            navigationPlugin.navigateTo('public-cloud', `#/pci/projects`);
          }}
          createLabel={t('sidebar_pci_new')}
          seeAllButton={true}
          seeAllLabel={t('sidebar_pci_all')}
        />
        {pciError && (
          <button
            className={style.sidebar_pci_refresh}
            onClick={() => refetchPciProjects()}
            role="button"
            title={t('sidebar_pci_load_error')}
          >
            <span>{t('sidebar_pci_load_error')}</span>
            <span className="oui-icon oui-icon-refresh"></span>
          </button>
        )}
        {selectedPciProject && (
          <button
            className={`d-flex ${style['button-as-div']} ${style.sidebar_clipboard}`}
            title={t('sidebar_clipboard_copy')}
            onClick={() =>
              navigator.clipboard.writeText(selectedPciProject.project_id)
            }
            role="button"
          >
            <span className={style.sidebar_clipboard_text}>
              {selectedPciProject.project_id}
            </span>

            <span
              className={`oui-icon oui-icon-copy px-1 mx-1 ml-auto ${style.sidebar_clipboard_copy}`}
            ></span>
          </button>
        )}
      </li>
      {selectedPciProject !== null &&
        rootNode.children?.filter((childNode) => !shouldHideElement(childNode, 1)).map((node) => (
          <li
            key={node.id}
            id={node.id}
            className={style.sidebar_pciEntry}
            role="menuitem"
          >
              <SubTreeSection
                node={node}
                selectedNode={selectedNode}
                selectedPciProject={selectedPciProject?.project_id}
                handleOnSubMenuClick={handleOnSubMenuClick}
              />
            {node.separator && <hr role="separator" />}
          </li>
        ))}
    </>
  );
};
