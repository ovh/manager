import { Notifications, TabsComponent } from '@ovh-ux/manager-react-components';
import { OsdsDivider, OsdsText } from '@ovhcloud/ods-components/react';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { useShallow } from 'zustand/react/shallow';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TRegionCategory, TRegionEntity } from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';
import { TabTitle } from '../../../../../components/tab/TabTitle.component';
import { TabContent } from './TabContent.component';
import { Spinner } from '@/components/spinner/Spinner.component';
import { useAppStore } from '@/store/hooks/useAppStore';

type TStepContentProps = {
  data?: TRegionEntity;
  isSelectedRegionActivated: boolean;
  isPending: boolean;
};

export const StepContent: FC<TStepContentProps> = ({
  data,
  isSelectedRegionActivated,
  isPending,
}) => {
  const { t } = useTranslation('regions');
  const { selectedRegion } = useAppStore(
    useShallow((state) => ({
      selectedRegion: state.region(),
    })),
  );

  const regionHasExtraCoast = useMemo((): boolean => {
    const selectedRegionCategory = data?.regions.data.allAvailableRegions.find(
      (region) => region.name === selectedRegion?.name,
    )?.category;
    return (
      selectedRegionCategory === 'oceania' ||
      selectedRegionCategory === 'south_east_asia'
    );
  }, [data?.regions.data.allAvailableRegions, selectedRegion?.name]);

  const tabTitle = useCallback(
    (category: DeepReadonly<TRegionCategory>, isSelected?: boolean) => (
      <TabTitle
        isSelected={!!isSelected}
        label={t(`pci_instances_regions_category_${category.name}_title`)}
      />
    ),
    [t],
  );

  const tabContent = useCallback(
    (category: DeepReadonly<TRegionCategory>) => (
      <TabContent category={category} data={data as TRegionEntity} />
    ),
    [data],
  );

  return (
    <>
      <OsdsDivider />
      <Notifications />
      <OsdsDivider />
      {isPending && <Spinner />}
      {data && !isPending && (
        <>
          <TabsComponent<DeepReadonly<TRegionCategory>>
            items={data.regions.categories as TRegionCategory[]}
            itemKey={({ name }) => name}
            titleElement={tabTitle}
            contentElement={tabContent}
          />
          {selectedRegion && !isSelectedRegionActivated && (
            <div className="mt-6">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.error}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._500}
              >
                {t('pci_instances_regions_not_activated_message')}
              </OsdsText>
            </div>
          )}
          {regionHasExtraCoast && (
            <div className="mt-6">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
              >
                {t('pci_instances_regions_extra_coast_message')}
              </OsdsText>
            </div>
          )}
        </>
      )}
    </>
  );
};
