import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Location, useLocation } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import ProjectSelector from '../ProjectSelector/ProjectSelector';
import { PciProject } from '../ProjectSelector/PciProject';
import { Node } from '../navigation-tree/node';
import { useShell } from '@/context';
import { shouldHideElement } from '@/container/nav-reshuffle/sidebar/utils';
import style from '../style.module.scss';
import SubTreeSection from '@/container/nav-reshuffle/sidebar/SubTree/SubTreeSection';
import { PUBLICCLOUD_UNIVERSE_ID } from '../navigation-tree/services/publicCloud';
import { useDefaultPublicCloudProject } from '@/container/nav-reshuffle/data/hooks/defaultPublicCloudProject/useDefaultPublicCloudProject';

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
  const environment = shell.getPlugin('environment').getEnvironment();
  const user = environment.getUser();

  const location = useLocation();

  const parseContainerURL = (
    location: Location,
  ): { appId: string; appHash: string } => {
    const [, appId, appHash] = /^\/([^/]*)(.*)/.exec(location.pathname);
    return { appId, appHash: `${appHash}${location.search}` };
  };

  const [containerURL, setContainerURL] = useState(parseContainerURL(location));

  const canCreateProject = useMemo(() => user.kycValidated, [user.kycValidated]);

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

  const { data: defaultPciProject,  isFetched: isDefaultProjectFetched  } = useDefaultPublicCloudProject({
    select: (defaultProjectId: string | null): PciProject | null => {
      return defaultProjectId !== null
        ? pciProjects?.find(
            (project: PciProject) => project.project_id === defaultProjectId,
          ) || null
        : null;
    },
    enabled:
      rootNode.id === PUBLICCLOUD_UNIVERSE_ID &&
      !selectedPciProject &&
      !pciProjects,
  });

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
      } else if (defaultPciProject) {
        setSelectedPciProject(defaultPciProject);
      } else if (isDefaultProjectFetched) {
        // In order to avoid loading the first project before loading the default project, we'll wait till the default project has been loaded
        setSelectedPciProject(pciProjects[0]);
      }
    }
  }, [rootNode, containerURL, pciProjects, defaultPciProject]);

  useEffect(() => {
    if (
      selectedPciProject &&
      rootNode.id === PUBLICCLOUD_UNIVERSE_ID &&
      containerURL.appId !== rootNode.routing?.application
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
              trackingPlugin.trackClick({
                name:
                  'navbar_v3_entry_home::pci::specific_project_from_listing',
                type: 'navigation',
              });
              setSelectedPciProject(option);
              navigationPlugin.navigateTo(
                'public-cloud',
                `#/pci/projects/${option.project_id}`,
              );
            }
          }}
          onSeeAllProjects={() => {
            navigationPlugin.navigateTo('public-cloud', `#/pci/projects`);
          }}
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
            className={`d-flex ${style.button_as_div} ${style.sidebar_clipboard}`}
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
      <li className="px-3 mt-3 flex">
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          type={ODS_BUTTON_TYPE.button}
          disabled={canCreateProject ? undefined : true}
          size={ODS_BUTTON_SIZE.sm}
          data-testid="pci-create-project"
          variant={ODS_BUTTON_VARIANT.flat}
          onClick={() =>
            navigationPlugin.navigateTo('public-cloud', `#/pci/projects/new`)
          }
        >
          {t('sidebar_pci_new')} +
        </OsdsButton>
      </li>
      {selectedPciProject !== null &&
        rootNode.children
          ?.filter((childNode) => !shouldHideElement(childNode, childNode.hasService ?? true))
          .map((node) => (
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
