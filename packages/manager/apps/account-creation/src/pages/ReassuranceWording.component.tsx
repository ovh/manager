import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useReassuranceWording } from '@/hooks/reassuranceWording/useReassuranceWording';

export default function ReassuranceWording() {
  const { t } = useTranslation('reassurance-wording');
  const { title, description } = useReassuranceWording();
  console.log(title);

  return (
    <div
      className="reassurance-wording flex flex-col gap-[1.5rem]"
      key={`reassurance_wording_${title}`}
    >
      <OdsText
        preset={ODS_TEXT_PRESET.heading1}
        data-testid="reassurance_wording_title"
      >
        {t(title)}
      </OdsText>
      <OdsText
        preset={ODS_TEXT_PRESET.paragraph}
        data-testid="reassurance_wording_description"
      >
        {t(description)}
      </OdsText>
    </div>
  );
}
