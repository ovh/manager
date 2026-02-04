import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { Links } from '@ovh-ux/manager-react-components';

import { useGuideUtils } from '@/utils';

export function OnboardingIpOptionsAdvantages() {
  const { t } = useTranslation('onboarding');
  const { links } = useGuideUtils();

  const ADVANTAGES = [
    {
      title: t('advantage1Title'),
      description: t('advantage1Description'),
    },
    {
      title: t('advantage2Title'),
      description: t('advantage2Description'),
    },
    {
      title: t('advantage3Title'),
      description: t('advantage3Description'),
    },
    {
      title: t('advantage4Title'),
      description: t('advantage4Description'),
    },
    {
      title: t('advantage5Title'),
      description: t('advantage5Description'),
      href: links?.byoipLink,
      linkLabel: t('learnMoreByoip'),
    },
  ];

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
        {t('advantagesTitle')}
      </OdsText>
      <div className="mb-8 text-left">
        <ul className="list-disc space-y-4 pl-6">
          {ADVANTAGES.map((advantage) => (
            <li key={advantage.title}>
              <OdsText preset={ODS_TEXT_PRESET.heading5}>
                {advantage.title}:
              </OdsText>
              <OdsText>
                {advantage.description}
                {advantage.href && advantage.linkLabel && (
                  <>
                    {' '}
                    <Links
                      href={advantage.href.link}
                      label={advantage.linkLabel}
                    />
                  </>
                )}
              </OdsText>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default OnboardingIpOptionsAdvantages;
