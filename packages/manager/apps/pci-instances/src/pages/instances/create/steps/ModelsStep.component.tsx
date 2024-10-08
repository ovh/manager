import { StepComponent, TabsComponent } from '@ovh-ux/manager-react-components';
import clsx from 'clsx';
import { TFunction } from 'i18next';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';
import { FlavorTile } from '@ovh-ux/manager-pci-common/src/components/flavor-selector/FlavorTile.component';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useCatalog } from '@/data/hooks/catalog/useCatalog';
import { Spinner } from '@/components/spinner/Spinner.component';
import {
  TModelCategory,
  TModelEntity,
  TModelPricing,
  TPriceInterval,
  TStorage,
} from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';
import { useAppStore } from '@/store/hooks/useAppStore';
import { TStep, TStepId } from '@/store/slices/stepper.slice';

const modelStepId: TStepId = 'model';
const validatedModelStepState: Partial<TStep> = {
  isChecked: true,
  isLocked: true,
  isOpen: false,
};
const editedModelStepState: Partial<TStep> = {
  isChecked: false,
  isLocked: false,
  isOpen: true,
};

type TTabProps = {
  t: TFunction;
  category: DeepReadonly<TModelCategory>;
};

type TTabContentProps = TTabProps & {
  modelName: string | null;
  setModelName: (newName: string) => void;
  data?: TModelEntity;
};

type TTabTitleProps = TTabProps & {
  isSelected?: boolean;
};

const TabContent: FC<TTabContentProps> = ({
  t,
  category,
  data,
  modelName,
  setModelName,
}) => {
  const getModelPrice = useCallback(
    (
      pricings: DeepReadonly<TModelPricing[]>,
      key: TPriceInterval,
    ): number | undefined =>
      pricings.find((price) => price.interval === key)?.price,
    [],
  );

  const handleModelTileClick = useCallback(
    (name: string) => () => setModelName(name),
    [setModelName],
  );
  return (
    <div className="p-6 pt-8">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {t(`model_category_${category.name}_description`)}
      </OsdsText>
      <div className="grid gap-6 pt-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {data?.models.data
          .filter((model) => model.category === category.name)
          .map(
            ({
              name,
              specifications,
              compatibleLocalzone,
              compatibleRegion,
              isNew,
              pricings,
            }) => {
              const monthlyPrice = getModelPrice(pricings, 'month');
              const hourlyPrice = getModelPrice(pricings, 'hour') ?? 0;
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
    </div>
  );
};

const TabTitle: FC<TTabTitleProps> = ({ t, category, isSelected }) => (
  <OsdsText
    breakSpaces={false}
    size={ODS_THEME_TYPOGRAPHY_SIZE._600}
    color={
      isSelected ? ODS_THEME_COLOR_INTENT.text : ODS_THEME_COLOR_INTENT.primary
    }
  >
    <div className="flex items-center gap-4">
      <span
        className={clsx(isSelected && 'font-bold', 'whitespace-nowrap text-lg')}
      >
        {t(`model_category_${category.name}_title`)}
      </span>
      {category.isNew && (
        <OsdsChip
          color={ODS_THEME_COLOR_INTENT.error}
          size={ODS_CHIP_SIZE.sm}
          inline
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.promotion}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._100}
          >
            {t('new')}
          </OsdsText>
        </OsdsChip>
      )}
    </div>
  </OsdsText>
);

export const ModelsStep: FC = () => {
  const { projectId } = useParams() as { projectId: string };
  const { t } = useTranslation(['create', 'stepper']);
  const { data, isLoading } = useCatalog<'modelSelector'>(projectId, {
    selector: 'modelSelector',
  });
  const { stepStateById, modelName, setModelName, updateStep } = useAppStore(
    useShallow((state) => ({
      stepStateById: state.stepStateById(),
      modelName: state.modelName(),
      setModelName: state.setModelName,
      updateStep: state.updateStep,
    })),
  );

  const handleNextStep = useCallback(
    (id: string) => {
      updateStep(id as TStepId, validatedModelStepState);
    },
    [updateStep],
  );

  const handleEditStep = useCallback(
    (id: string) => {
      updateStep(id as TStepId, editedModelStepState);
    },
    [updateStep],
  );

  const modelStepState = useMemo(() => stepStateById(modelStepId), [
    stepStateById,
  ]);

  const tabTitle = useCallback(
    (category: DeepReadonly<TModelCategory>, isSelected?: boolean) => (
      <TabTitle isSelected={isSelected} category={category} t={t} />
    ),
    [t],
  );

  const tabElement = useCallback(
    (category: DeepReadonly<TModelCategory>) => (
      <TabContent
        category={category}
        t={t}
        data={data}
        modelName={modelName}
        setModelName={setModelName}
      />
    ),
    [data, modelName, setModelName, t],
  );

  return (
    <div>
      <StepComponent
        id={modelStepId}
        isOpen={!!modelStepState?.isOpen}
        isChecked={!!modelStepState?.isChecked}
        isLocked={!!modelStepState?.isLocked}
        order={1}
        title={t('select_template')}
        {...(modelName && {
          next: {
            action: handleNextStep,
            label: t('stepper:next_button_label'),
            isDisabled: !modelName,
          },
        })}
        edit={{
          action: handleEditStep,
          label: t('stepper:edit_step_label'),
          isDisabled: false,
        }}
      >
        <>
          {isLoading && <Spinner />}
          {data && (
            <TabsComponent<DeepReadonly<TModelCategory>>
              items={data.models.categories as TModelCategory[]}
              itemKey={({ name }) => name}
              titleElement={tabTitle}
              contentElement={tabElement}
            />
          )}
        </>
      </StepComponent>
    </div>
  );
};
