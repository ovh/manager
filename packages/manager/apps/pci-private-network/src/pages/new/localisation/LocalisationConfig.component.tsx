import { useCallback, useMemo, useState } from 'react';
import { Links, Subtitle } from '@ovh-ux/manager-react-components';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  RegionSelector,
  useProject,
  PCICommonContext,
  usePCICommonContextFactory,
  useProjectRegions,
  TRegion,
  TDeployment,
  TLocalisation,
  FeaturedDeploymentTilesInput,
  TRegionType,
} from '@ovh-ux/manager-pci-common';
import { Trans, useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import useGuideLink from '@/hooks/useGuideLink/useGuideLink';

const REGION_3AZ_TYPE = 'region-3-az';

const isNetworkUp = (services: TRegion['services']) =>
  services.some(
    (service) => service.name === 'network' && service.status === 'UP',
  );

const isRegionWith3AZ = (regions: TRegion[]) =>
  regions.some(
    (region) => region.type === REGION_3AZ_TYPE && isNetworkUp(region.services),
  );

const GuideLink = ({
  children,
  href,
}: Readonly<{ href: string; children?: string }>) => (
  <Links
    label={children}
    href={href}
    target={OdsHTMLAnchorElementTarget._blank}
  />
);

const LocalisationConfig: React.FC = () => {
  const { t } = useTranslation('new');
  const { data: project } = useProject();
  const { unregister, setValue } = useFormContext<NewPrivateNetworkForm>();

  const { data: projectRegions } = useProjectRegions(project.project_id);

  const has3AZ = useMemo(
    () => (projectRegions ? isRegionWith3AZ(projectRegions) : false),
    [projectRegions],
  );
  const pciCommonProperties = usePCICommonContextFactory({ has3AZ });

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);

  const [selectedRegionType, setSelectedRegionType] = useState<
    TRegionType | undefined
  >();

  const guides = useGuideLink();

  const onSelectRegion = (region: TLocalisation) => {
    unregister('region');
    setSelectedRegionType(undefined);

    if (region) {
      setValue('region', region.name, { shouldValidate: true });
      setValue('isLocalZone', region.isLocalZone, {
        shouldValidate: true,
      });
      setSelectedRegionType(region.type);
    }
  };

  const filterRegion = useCallback(
    (region: TLocalisation) => {
      const regionType = selectedRegionGroup
        ? selectedRegionGroup.name
        : region.type;

      return (
        region.isMacro ||
        (region.type === regionType && isNetworkUp(region.services))
      );
    },
    [selectedRegionGroup, isNetworkUp],
  );

  return (
    <div className="flex flex-col gap-6 my-8">
      <FeaturedDeploymentTilesInput
        value={selectedRegionGroup}
        onChange={setSelectedRegionGroup}
        name="deployment-app"
      />
      <Subtitle>{t('pci_project_network_private_localisation')}</Subtitle>
      <PCICommonContext.Provider value={pciCommonProperties}>
        <RegionSelector
          projectId={project.project_id}
          onSelectRegion={onSelectRegion}
          regionFilter={filterRegion}
        />
      </PCICommonContext.Provider>
      {selectedRegionType === REGION_3AZ_TYPE && (
        <div>
          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
          >
            <Trans
              t={t}
              i18nKey="pci_projects_project_network_private_3az_guide_description"
              components={{
                Link: <GuideLink href={guides['3AZ']} />,
              }}
            />
          </OsdsText>
        </div>
      )}
    </div>
  );
};

export default LocalisationConfig;
