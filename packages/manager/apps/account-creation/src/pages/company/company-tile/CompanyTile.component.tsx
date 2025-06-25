import { OdsText, OdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { Company } from '@/types/company';

type Props = {
  company: Company;
  onClick: () => void;
};

export default function CompanyTile({ company, onClick }: Props) {
  return (
    <div
      className="flex border border-solid items-center justify-between rounded-md px-6 py-4"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>{company.name}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          SIREN: {company.primaryCNIN}
        </OdsText>
        {company.secondaryCNIN && (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            SIRET: {company.secondaryCNIN}
          </OdsText>
        )}
        {company.address && (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {company.address}
          </OdsText>
        )}
      </div>
      <OdsIcon name="chevron-right" />
    </div>
  );
}
