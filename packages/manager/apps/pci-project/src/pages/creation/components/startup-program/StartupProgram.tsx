import { OdsText, OdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation, Trans } from 'react-i18next';
import { STARTUP_PROGRAM_GUIDE_URL } from '@/constants';

type StartupProgramProps = {
  value: string;
};

export default function StartupProgram({ value }: StartupProgramProps) {
  const { t } = useTranslation('new/startup-program');

  return (
    <div>
      <OdsText preset="heading-3" className="mb-4">
        {t('pci_project_new_payment_startup_program_title')}
      </OdsText>

      <OdsText>{t('pci_project_new_payment_startup_program_info')}</OdsText>

      <OdsText className="font-bold mb-4">
        {t('pci_project_new_payment_startup_program_amount_available', {
          amount: value,
        })}
      </OdsText>

      <OdsText preset="caption" className="mb-4">
        <Trans
          t={t}
          i18nKey="pci_project_new_payment_startup_program_explain"
          values={{ guide: STARTUP_PROGRAM_GUIDE_URL }}
          components={{
            guideLink: (
              <OdsLink
                href={STARTUP_PROGRAM_GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="guide-link"
              />
            ),
          }}
        />
      </OdsText>
    </div>
  );
}
