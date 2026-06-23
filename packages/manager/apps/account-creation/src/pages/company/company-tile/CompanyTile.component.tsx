import { OdsText, OdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { Company } from '@/types/company';
import { useTranslation } from 'react-i18next';
import { sanitizedLabel } from './CompanyTile.helpers';

type Props = {
  company: Company;
  onClick: () => void;
};

export default function CompanyTile({ company, onClick }: Props) {
  const { t } = useTranslation('company');
  return (
    <div
      className="flex border border-solid items-center justify-between rounded-md px-6 py-4"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {sanitizedLabel(company.name ?? '', t)}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          SIREN: {company.primaryCNIN}
        </OdsText>
        {company.secondaryCNIN && (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            SIRET: {company.secondaryCNIN}
          </OdsText>
        )}
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {sanitizedLabel(company.address ?? '', t)}
        </OdsText>
      </div>
      <OdsIcon name="chevron-right" />
    </div>
  );
}
