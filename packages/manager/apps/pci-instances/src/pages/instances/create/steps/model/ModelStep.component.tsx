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
import { TStepId } from '@/store/slices/stepper.slice';
import { StepTitle } from './StepTitle.component';
import { StepContent } from './StepContent.component';

const modelStepId: TStepId = 'model';

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

  const { stepById, modelName, editStep, validateStep } = useAppStore(
    useShallow((state) => ({
      stepById: state.stepById(),
      modelName: state.modelName(),
      editStep: state.editStep,
      validateStep: state.validateStep,
    })),
  );

  const modelStep = stepById(modelStepId);

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

  const handleNextStep = (id: string) => {
    validateStep(id as TStepId);
  };

  const handleEditStep = (id: string) => {
    editStep(id as TStepId);
  };

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
        isOpen={!!modelStep?.isOpen}
        isChecked={!!modelStep?.isChecked}
        isLocked={!!modelStep?.isLocked}
        order={modelStep?.order ?? 1}
        title={
          <StepTitle
            modelStep={modelStep}
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
