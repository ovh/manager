import {
  OdsCheckbox,
  OdsFormField,
  OdsLink,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { CartContract } from '@/data/types/cart.type';
import ContractsSkeleton from './ContractsSkeleton';

type ContractsProps = {
  contracts?: CartContract[];
  isLoading?: boolean;
  isChecked: boolean;
  onCheckChanged: (isChecked: boolean) => void;
};

export default function Contracts({
  contracts = [],
  isLoading = false,
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
        isDisabled={isLoading || contracts?.length === 0}
        onOdsChange={(event) => onCheckChanged(event.detail.checked)}
      />
      <label className="ml-4 cursor-pointer" htmlFor="cart-contracts">
        <OdsText preset="paragraph">{t('order_contracts_label')}</OdsText>
        {isLoading ? (
          <ContractsSkeleton />
        ) : (
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
        )}
      </label>
    </OdsFormField>
  );
}
