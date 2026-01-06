import { Dispatch, SetStateAction } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OvhSubsidiary, StepComponent } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { Cart, OrderedProduct } from '@/data/models/Cart.type';
import { PROJECTS_TRACKING } from '@/tracking.constant';

import { ConfigFormState } from '../hooks/useConfigForm';
import { Step } from '../hooks/useStepper';
import ConfigStep from './ConfigStep';

type Props = {
  isLocked: boolean;
  isChecked: boolean;
  onEdit: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  cart: Cart;
  projectItem: OrderedProduct;
  ovhSubsidiary: OvhSubsidiary;
  form: ConfigFormState;
  setForm: Dispatch<SetStateAction<ConfigFormState>>;
};

export default function ConfigStepSection({
  isLocked,
  isChecked,
  onEdit,
  onNext,
  isNextDisabled,
  cart,
  projectItem,
  ovhSubsidiary,
  form,
  setForm,
}: Readonly<Props>) {
  const { t } = useTranslation(['new/config', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <StepComponent
      order={Step.Config}
      isOpen
      isLocked={isLocked}
      isChecked={isChecked}
      title={t('pci_project_new_config_description_label')}
      edit={
        isLocked
          ? {
              action: onEdit,
              label: t('modify', { ns: NAMESPACES.ACTIONS }),
              isDisabled: false,
            }
          : undefined
      }
      next={{
        action: () => {
          trackClick({
            actionType: 'action',
            actions: PROJECTS_TRACKING.CREATION.CONFIG_STEP.CTA_NEXT,
          });
          onNext();
        },
        label: t('next', { ns: NAMESPACES.ACTIONS }),
        isDisabled: isNextDisabled,
      }}
      skip={{
        action: () => {
          trackClick({
            actionType: 'action',
            actions: PROJECTS_TRACKING.CREATION.CONFIG_STEP.CTA_BACK,
          });
          navigate('..');
        },
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
      }}
    >
      <ConfigStep
        cart={cart}
        cartProjectItem={projectItem}
        ovhSubsidiary={ovhSubsidiary}
        form={form}
        setForm={setForm}
      />
    </StepComponent>
  );
}
