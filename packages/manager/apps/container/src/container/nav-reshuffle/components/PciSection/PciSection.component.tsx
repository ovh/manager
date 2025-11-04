import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Location, useLocation } from 'react-router-dom';
import { Button, Icon, ICON_NAME } from '@ovh-ux/muk';
import { BUTTON_VARIANT } from '@ovhcloud/ods-react';
import ProjectSelector from '../../sidebar/ProjectSelector/ProjectSelector';
import { PciProject } from '../../sidebar/ProjectSelector/PciProject';
import { usePciProjects } from '../../data/hooks/pciProjects/usePciProjects';
import { useDefaultPublicCloudProject } from '../../data/hooks/defaultPublicCloudProject/useDefaultPublicCloudProject';
import { useShell } from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

export const PciSection = () => {
  const [selectedPciProject, setSelectedPciProject] = useState<PciProject>(
    null,
  );
  const { setSelectedPciProjectId } = useProductNavReshuffle();

  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigationPlugin = shell.getPlugin('navigation');
  const trackingPlugin = shell.getPlugin('tracking');
  const environment = shell.getPlugin('environment').getEnvironment();
  const user = environment.getUser();

  const location = useLocation();

  const parseContainerURL = (
    loc: Location,
  ): { appId: string; appHash: string } => {
    const [, appId, appHash] = /^\/([^/]*)(.*)/.exec(loc.pathname);
    return { appId, appHash: `${appHash}${loc.search}` };
  };

  const [containerURL, setContainerURL] = useState(parseContainerURL(location));

  const canCreateProject = useMemo(() => user.kycValidated, [
    user.kycValidated,
  ]);

  const {
    data: pciProjects,
    isError: pciError,
    isSuccess: pciSuccess,
    refetch: refetchPciProjects,
  } = usePciProjects();

  const {
    data: defaultPciProject,
    isFetched: isDefaultProjectFetched,
  } = useDefaultPublicCloudProject({
    select: (defaultProjectId: string | null): PciProject | null => {
      return defaultProjectId !== null
        ? pciProjects?.find(
            (project: PciProject) => project.project_id === defaultProjectId,
          ) || null
        : null;
    },
    enabled: !selectedPciProject && !pciProjects,
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
        if (!pciProjectMatch) {
          navigationPlugin.navigateTo(
            'public-cloud',
            `#/pci/projects/${defaultPciProject.project_id}`,
          );
        }
      } else if (isDefaultProjectFetched) {
        // In order to avoid loading the first project before loading the default project, we'll wait till the default project has been loaded
        const firstProject = pciProjects[0];
        setSelectedPciProject(firstProject);
        if (!pciProjectMatch) {
          navigationPlugin.navigateTo(
            'public-cloud',
            `#/pci/projects/${firstProject.project_id}`,
          );
        }
      }
    }
  }, [containerURL, pciProjects, defaultPciProject, navigationPlugin]);

  useEffect(() => {
    setSelectedPciProjectId(selectedPciProject?.project_id || null);
  }, [selectedPciProject, setSelectedPciProjectId]);

  return (
    <>
      <div className="px-3" data-testid="public-cloud-panel">
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
          <Button
            variant={BUTTON_VARIANT.ghost}
            className="flex items-center gap-2 w-full mt-2 text-sm px-2"
            onClick={() => refetchPciProjects()}
          >
            <>
              <span>{t('sidebar_pci_load_error')}</span>
              <Icon name={ICON_NAME.refresh} className="text-base" />
            </>
          </Button>
        )}
        {selectedPciProject && (
          <Button
            variant={BUTTON_VARIANT.ghost}
            className="flex justify-between items-center w-full mb-2 text-xs px-2"
            onClick={() =>
              navigator.clipboard.writeText(selectedPciProject.project_id)
            }
          >
            <>
              <span className="whitespace-nowrap">
                {selectedPciProject.project_id}
              </span>
              <Icon name={ICON_NAME.fileCopy} className="ml-auto text-base" />
            </>
          </Button>
        )}
      </div>
      <div className="px-3 mt-3 flex">
        <Button
          variant={BUTTON_VARIANT.default}
          className="w-full text-sm rounded-lg"
          disabled={!canCreateProject}
          data-testid="pci-create-project"
          onClick={() =>
            navigationPlugin.navigateTo('public-cloud', `#/pci/projects/new`)
          }
        >
          <>{t('sidebar_pci_new')} +</>
        </Button>
      </div>
    </>
  );
};
