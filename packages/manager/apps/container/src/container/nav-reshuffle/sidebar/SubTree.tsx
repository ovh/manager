import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import ProjectSelector, {
  PciProject,
} from '@/container/nav-reshuffle/sidebar/ProjectSelector/ProjectSelector';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import { Node } from '@/container/nav-reshuffle/sidebar/navigation-tree/node';
import { shouldHideElement } from '@/container/nav-reshuffle/sidebar/utils';
import { Location, useLocation } from 'react-router-dom';
import SubTreeSection from '@/container/nav-reshuffle/sidebar/SubTreeSection';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

interface SubTreeProps {
  rootNode: Node;
  handleBackNavigation(): void;
  handleOnMouseOver(node: Node): void;
}

const parseContainerURL = (
  location: Location,
): { appId: string; appHash: string } => {
  const [, appId, appHash] = /^\/([^/]*)(.*)/.exec(location.pathname);
  return { appId, appHash: `${appHash}${location.search}` };
};

const SubTree = ({
  rootNode,
  handleBackNavigation,
  handleOnMouseOver,
}: SubTreeProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigationPlugin = shell.getPlugin('navigation');

  const location = useLocation();
  const [containerURL, setContainerURL] = useState(parseContainerURL(location));
  const [selectedPciProject, setSelectedPciProject] = useState<PciProject>(
    null,
  );

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
        return response.data[0] as PciProject;
      },
      enabled: rootNode.id === 'pci' && !selectedPciProject,
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
    } else if (defaultPciProjectStatus === 'error') {
      setSelectedPciProject(pciProjects[0]);
    }
  }, [defaultPciProject, defaultPciProjectStatus, pciProjects]);

  return (
    <div className={style.subtree}>
      <div className={style.subtree_content} onMouseOver={() => handleOnMouseOver(rootNode)} onMouseLeave={handleBackNavigation}>
        <button
          className={style.subtree_back_btn}
          onClick={handleBackNavigation}
        >
          <span
            className={`oui-icon oui-icon-arrow-left mx-2`}
            aria-hidden="true"
          ></span>Retour au menu
        </button>
        {rootNode.illustration && (
        <div
          aria-label={t(rootNode.translation)}
          className={`d-block py-3 ${style.subtree_illustration}`}
        >
          <img
            src={rootNode.illustration}
            alt={t(rootNode.translation)}
            aria-hidden="true"
          />
        </div>
        )}

        <div className={rootNode.illustration ? '' : 'pt-4'}>
          <ul className={`${style.subtree_list} mx-3`}>
            <li>
              <h2>{t(rootNode.translation)}</h2>
            </li>

            {rootNode.id.startsWith('pci') && (
              <li>
                <ProjectSelector
                  isLoading={!pciSuccess}
                  projects={pciProjects}
                  selectedProject={selectedPciProject}
                  onProjectChange={(option: typeof selectedPciProject) => {
                    if (selectedPciProject !== option) {
                      setSelectedPciProject(option);
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
                  createLabel={t('sidebar_pci_new')}
                  seeAllButton={true}
                  seeAllLabel={t('sidebar_pci_all')}
                />
                {pciError && (
                  <button
                    className={style.sidebar_pci_refresh}
                    onClick={() => refetchPciProjects()}
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
                  </button>
                )}
              </li>
            )}
            {(rootNode.id !== 'pci' || selectedPciProject !== null) &&
              rootNode.children?.map((node, index) => (
                <li key={node.id} id={node.id} className={style.sidebar_pciEntry}>
                  {!shouldHideElement(node, 1, 2) && (
                    <SubTreeSection
                      node={node}
                      selectedPciProject={selectedPciProject?.project_id}
                    />
                  )}
                  {node.separator && <hr />}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubTree;
