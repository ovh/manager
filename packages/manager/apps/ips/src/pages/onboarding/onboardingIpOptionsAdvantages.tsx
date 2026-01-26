import { useTranslation } from 'react-i18next';

import { Link, Text, TEXT_PRESET } from '@ovhcloud/ods-react';

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
      <Text preset={TEXT_PRESET.heading3} className="mb-4">
        {t('advantagesTitle')}
      </Text>
      <div className="mb-8 text-left">
        <ul className="list-disc space-y-4 pl-6">
          {ADVANTAGES.map((advantage) => (
            <li key={advantage.title}>
              <Text preset={TEXT_PRESET.heading5}>{advantage.title}:</Text>
              <Text>
                {advantage.description}
                {advantage.href && advantage.linkLabel && (
                  <>
                    {' '}
                    <Link href={advantage.href.link}>
                      {advantage.linkLabel}
                    </Link>
                  </>
                )}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default OnboardingIpOptionsAdvantages;
