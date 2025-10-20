import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import {
  OdsDivider,
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Contracts from '@/components/contracts/Contracts';
import HdsOption from '@/components/hds-option/HdsOption';
import ItalyAgreements from '@/components/italy-agreements/ItalyAgreements';
import { useGetCartSummary } from '@/data/hooks/useCart';
import { Cart, OrderedProduct } from '@/data/types/cart.type';
import { ConfigFormState } from '../hooks/useConfigForm';
import { useHdsManagement } from '../hooks/useHdsManagement';

export type ConfigStepProps = {
  cart: Cart;
  cartProjectItem: OrderedProduct;
  ovhSubsidiary: OvhSubsidiary;
  form: ConfigFormState;
  setForm: Dispatch<SetStateAction<ConfigFormState>>;
};

export default function ConfigStep({
  cart,
  cartProjectItem,
  ovhSubsidiary,
  form,
  setForm,
}: ConfigStepProps) {
  const { t } = useTranslation(['new/config', 'NAMESPACES.FORM']);

  const { cartId } = cart;

  const {
    data: cartSummary,
    isFetching: isContractsFetching,
  } = useGetCartSummary(cartId);

  const {
    shouldDisplayHdsSection,
    isHdsPending,
    handleHdsToggle,
  } = useHdsManagement({
    cartId,
    projectItemId: cartProjectItem.itemId,
    setForm,
  });

  const isPending = isHdsPending || isContractsFetching;

  return (
    <div className="flex flex-col gap-8">
      <OdsFormField
        className="w-full"
        error={
          form.description.trim()
            ? undefined
            : t('error_required_field', { ns: NAMESPACES.FORM })
        }
      >
        <OdsText className="font-bold" preset="caption">
          {t('pci_project_new_config_description_label')}
        </OdsText>

        <OdsInput
          name="project-description"
          className="w-[20em] max-w-full"
          value={form.description}
          maxlength={255}
          onOdsChange={(event) =>
            setForm((prev) => ({
              ...prev,
              description: `${event.detail.value}`,
            }))
          }
        />
      </OdsFormField>

      <OdsDivider />

      {shouldDisplayHdsSection && (
        <HdsOption
          isChecked={form.isHdsChecked}
          isDisabled={isPending}
          onCheckChanged={handleHdsToggle}
          isAlreadyCertifiedProject={false}
          isValidForCertification={true}
          isLightVersion
        />
      )}

      <Contracts
        contracts={cartSummary?.contracts}
        isLoading={isPending}
        isChecked={form.isContractsChecked}
        onCheckChanged={(checked) =>
          setForm((prev) => ({ ...prev, isContractsChecked: checked }))
        }
      />

      {ovhSubsidiary === OvhSubsidiary.IT && (
        <ItalyAgreements
          hasAgreements={form.hasItalyAgreements}
          onSetHasAgreements={(checked) =>
            setForm((prev) => ({ ...prev, hasItalyAgreements: checked }))
          }
        />
      )}
    </div>
  );
}
