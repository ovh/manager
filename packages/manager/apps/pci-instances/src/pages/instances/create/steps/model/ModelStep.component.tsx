import {
  StepComponent,
  useCatalogPrice,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useCatalog } from '@/data/hooks/catalog/useCatalog';
import { TModelPricing, TPriceInterval } from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';
import { useAppStore } from '@/store/hooks/useAppStore';
import { TStep, TStepId } from '@/store/slices/stepper.slice';
import { StepTitle } from './StepTitle.component';
import { StepContent } from './StepContent.component';

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
const regionStepOpen: Partial<TStep> = {
  isOpen: true,
  isLocked: false,
  isChecked: false,
};

const getModelPriceByInterval = (
  pricings: DeepReadonly<TModelPricing[]>,
  key: TPriceInterval,
): number | undefined =>
  pricings.find((price) => price.interval === key)?.price;

export const ModelStep: FC = () => {
  const { projectId } = useParams() as { projectId: string };
  const { t } = useTranslation(['models', 'stepper']);
  const { clearNotifications, addError } = useNotifications();
  const { getTextPrice } = useCatalogPrice(4, {
    exclVat: true,
  });

  const { data, isLoading, refetch, isError } = useCatalog<'modelSelector'>(
    projectId,
    {
      selector: 'modelSelector',
    },
  );

  const { stepStateById, modelName, updateStep } = useAppStore(
    useShallow((state) => ({
      stepStateById: state.stepStateById(),
      modelName: state.modelName(),
      updateStep: state.updateStep,
    })),
  );

  const getSelectedModelMonthlyPrice = useCallback((): string | undefined => {
    const selectedModelMonthlyPrice = getModelPriceByInterval(
      data?.models.data.find((model) => model.name === modelName)?.pricings ??
        [],
      'month',
    );
    return selectedModelMonthlyPrice
      ? t('pci_instances_models_monthly_price_excl_vat', {
          price: getTextPrice(selectedModelMonthlyPrice),
        })
      : undefined;
  }, [data?.models.data, getTextPrice, modelName, t]);

  const handleRefetch = useCallback(() => {
    clearNotifications();
    refetch();
  }, [clearNotifications, refetch]);

  const errorMessage = useMemo(
    () => (
      <>
        <Trans
          t={t}
          i18nKey="pci_instances_models_error_message1"
          tOptions={{ interpolation: { escapeValue: true } }}
          shouldUnescape
          components={{
            Link: (
              <OsdsLink
                color={ODS_THEME_COLOR_INTENT.error}
                onClick={handleRefetch}
              />
            ),
          }}
        />
        <br />
        <Trans t={t} i18nKey="pci_instances_models_error_message2" />
      </>
    ),
    [handleRefetch, t],
  );

  const modelStepState = useMemo(() => stepStateById(modelStepId), [
    stepStateById,
  ]);

  const handleNextStep = useCallback(
    (id: string) => {
      updateStep(id as TStepId, validatedModelStepState);
      updateStep('region', regionStepOpen);
    },
    [updateStep],
  );

  const handleEditStep = useCallback(
    (id: string) => {
      updateStep(id as TStepId, editedModelStepState);
      updateStep('region', { isOpen: false });
    },
    [updateStep],
  );

  const handleError = useCallback(() => {
    if (isError) addError(errorMessage);
  }, [isError, addError, errorMessage]);

  useEffect(() => {
    handleError();
    return () => clearNotifications();
  }, [isError, addError, errorMessage, clearNotifications, handleError]);

  return (
    <div>
      <StepComponent
        id={modelStepId}
        isOpen={!!modelStepState?.isOpen}
        isChecked={!!modelStepState?.isChecked}
        isLocked={!!modelStepState?.isLocked}
        order={1}
        title={
          <StepTitle
            modelStepState={modelStepState}
            modelMonthlyPrice={getSelectedModelMonthlyPrice()}
          />
        }
        {...(!isLoading &&
          !isError && {
            next: {
              action: handleNextStep,
              label: t('stepper:pci_instances_stepper_next_button_label'),
              isDisabled: !modelName,
            },
          })}
        edit={{
          action: handleEditStep,
          label: t('stepper:pci_instances_stepper_edit_step_label'),
          isDisabled: false,
        }}
      >
        <StepContent
          data={data}
          isStepLoading={isLoading}
          isNotificationOpen={isError}
          getModelPriceByInterval={getModelPriceByInterval}
        />
      </StepComponent>
    </div>
  );
};
