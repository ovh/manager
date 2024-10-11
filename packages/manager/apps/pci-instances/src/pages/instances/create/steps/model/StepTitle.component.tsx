import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { DeepReadonly } from '@/types/utils.type';
import { useAppStore } from '@/store/hooks/useAppStore';
import { TStep } from '@/store/slices/stepper.slice';

type TStepTitleProps = DeepReadonly<{
  modelStepState?: TStep;
  modelMonthlyPrice?: string;
}>;

export const StepTitle: FC<TStepTitleProps> = ({
  modelStepState,
  modelMonthlyPrice,
}) => {
  const { t } = useTranslation('models');

  const { modelName } = useAppStore(
    useShallow((state) => ({
      modelName: state.modelName(),
    })),
  );

  const modelStepTitle = useMemo(
    () =>
      modelName && !modelStepState?.isOpen
        ? `${t('pci_instances_models_chosen_model_message', {
            model: modelName.toUpperCase(),
          })} ${modelMonthlyPrice || ''}`
        : t('pci_instances_models_select_template'),
    [modelName, modelStepState?.isOpen, t, modelMonthlyPrice],
  );

  return modelStepTitle;
};
