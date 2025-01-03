import { useShallow } from 'zustand/react/shallow';
import { FlavorTile } from '@ovh-ux/manager-pci-common/src/components/flavor-selector/FlavorTile.component';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TabContentWrapper } from '@/components/tab/TabContentWrapper.component';
import { useAppStore } from '@/store/hooks/useAppStore';
import {
  TModel,
  TModelCategory,
  TModelEntity,
  TModelPricing,
  TPriceInterval,
  TStorage,
} from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';

type TTabContentProps = {
  category: DeepReadonly<TModelCategory>;
  data?: TModelEntity;
  getModelPriceByInterval: (
    pricings: DeepReadonly<TModelPricing[]>,
    key: TPriceInterval,
  ) => number | undefined;
};

export const TabContent: FC<TTabContentProps> = ({
  category,
  data,
  getModelPriceByInterval,
}) => {
  const { t } = useTranslation('models');
  const { modelName, setModelName } = useAppStore(
    useShallow((state) => ({
      modelName: state.modelName(),
      setModelName: state.setModelName,
    })),
  );

  const filterModels = useCallback(
    (model: DeepReadonly<TModel>) => model.category === category.name,
    [category.name],
  );

  const handleModelTileClick = useCallback(
    (name: string) => () => setModelName(name),
    [setModelName],
  );

  return (
    <TabContentWrapper
      description={t(
        `pci_instances_models_category_${category.name}_description`,
      )}
    >
      <div className="grid gap-6 pt-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {data?.models.data
          .filter(filterModels)
          .map(
            ({
              name,
              specifications,
              compatibleLocalzone,
              compatibleRegion,
              isNew,
              pricings,
            }) => {
              const monthlyPrice = getModelPriceByInterval(pricings, 'month');
              const hourlyPrice =
                getModelPriceByInterval(pricings, 'hour') ?? 0;
              return (
                <div key={name}>
                  <FlavorTile
                    flavorName={name.toUpperCase()}
                    flavorSpecs={{
                      ram: specifications.memory.size,
                      vcores: specifications.cpu.cores,
                      frequency: specifications.cpu.frequency,
                      bandwidth: specifications.bandwidth,
                      gpuModel: specifications.gpu.model,
                      gpuNumber: specifications.gpu.number,
                      disk: specifications.storage as TStorage[],
                      nvme: [],
                    }}
                    flavorCompatibility={{
                      localzone: compatibleLocalzone,
                      globalzone: compatibleRegion,
                    }}
                    isNewFlavor={isNew}
                    isSelected={modelName === name}
                    onClick={handleModelTileClick(name)}
                    flavorPrice={{
                      hourly: hourlyPrice,
                      ...(monthlyPrice && {
                        monthly: monthlyPrice,
                      }),
                    }}
                    hasEnoughQuota
                  />
                </div>
              );
            },
          )}
      </div>
    </TabContentWrapper>
  );
};
