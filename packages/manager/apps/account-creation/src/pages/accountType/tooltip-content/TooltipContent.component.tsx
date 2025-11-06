import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { LegalForm } from '@ovh-ux/manager-config';

type Props = {
  legalForms: LegalForm[];
};

export default function AccountTypeTooltipContent({ legalForms }: Props) {
  const { t } = useTranslation('account-type');

  return (
    <div className="flex flex-col gap-3">
      {legalForms.map((legalForm: LegalForm) => (
        <div
          className="flex flex-col gap-3"
          key={`legal-form-tooltip-${legalForm}`}
        >
          <OdsText className="caption-title" preset={ODS_TEXT_PRESET.caption}>
            {t(`legal_form_${legalForm}`)}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.caption}>
            {t(`legal_form_tooltip_${legalForm}_description`)}
          </OdsText>
        </div>
      ))}
    </div>
  );
}
