import {
  OdsCheckbox,
  OdsFormField,
  OdsLink,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { CartContract } from '@/data/types/cart.type';

type ContractsProps = {
  contracts?: CartContract[];
  isChecked: boolean;
  onCheckChanged: (isChecked: boolean) => void;
};

export default function Contracts({
  contracts,
  isChecked,
  onCheckChanged,
}: ContractsProps) {
  const { t } = useTranslation('contracts');

  return (
    <OdsFormField className="flex flex-row items-start">
      <OdsCheckbox
        data-testid="contracts-checkbox"
        name="contracts"
        inputId="cart-contracts"
        isChecked={isChecked}
        isDisabled={!contracts || contracts?.length === 0}
        onOdsChange={(event) => onCheckChanged(event.detail.checked)}
      />
      <label className="ml-4 cursor-pointer" htmlFor="cart-contracts">
        <OdsText preset="paragraph">{t('order_contracts_label')}</OdsText>
        {contracts ? (
          <ul className="flex flex-col">
            {contracts.map((contract) => (
              <li key={contract.url}>
                <OdsLink
                  icon="external-link"
                  target="_blank"
                  href={contract.url}
                  label={contract.name}
                />
              </li>
            ))}
          </ul>
        ) : (
          <OdsSpinner size="sm" className="block my-2" />
        )}
      </label>
    </OdsFormField>
  );
}
