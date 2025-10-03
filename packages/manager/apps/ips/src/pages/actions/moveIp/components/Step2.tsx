import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { TRANSLATION_NAMESPACES } from '@/utils';

export type Step2Props = {
  ip: string;
  destinationService: string;
  nextHop?: string;
};

export default function Step2({ ip, destinationService, nextHop }: Step2Props) {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.moveIp);

  return (
    <div className="flex items-center">
      <OdsText
        className="block mb-4 text-center flex-1"
        preset={ODS_TEXT_PRESET.paragraph}
      >
        <span
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html: t(
              nextHop
                ? 'step2DescriptionWithNextHop'
                : 'step2DescriptionWithoutNextHop',
              { ip, destinationService, nextHop },
            ),
          }}
        />
      </OdsText>
    </div>
  );
}
