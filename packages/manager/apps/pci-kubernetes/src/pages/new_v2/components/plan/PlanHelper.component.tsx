import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { HelpDrawer } from '@/components/help-drawer/HelpDrawer.component';

interface PlanFeature {
  labelKey: string;
  textKey: string;
  subItemKeys?: string[];
}

interface PlanSection {
  titleKey: string;
  features: PlanFeature[];
}

const PLAN_SECTIONS: PlanSection[] = [
  {
    titleKey: 'kube_add_plan_helper_v2_free_title',
    features: [
      {
        labelKey: 'kube_add_plan_helper_v2_free_ideal_label',
        textKey: 'kube_add_plan_helper_v2_free_ideal_text',
      },
      {
        labelKey: 'kube_add_plan_helper_v2_free_availability_label',
        textKey: 'kube_add_plan_helper_v2_free_availability_text',
      },
    ],
  },
  {
    titleKey: 'kube_add_plan_helper_v2_standard_title',
    features: [
      {
        labelKey: 'kube_add_plan_helper_v2_standard_ideal_label',
        textKey: 'kube_add_plan_helper_v2_standard_ideal_text',
      },
      {
        labelKey: 'kube_add_plan_helper_v2_standard_availability_label',
        textKey: '',
        subItemKeys: [
          'kube_add_plan_helper_v2_standard_availability_1az',
          'kube_add_plan_helper_v2_standard_availability_3az',
        ],
      },
    ],
  },
];

export const PlanHelper = () => {
  const { t } = useTranslation('add');

  return (
    <HelpDrawer>
      <Text preset="heading-3" className="font-bold">
        {t('kube_add_plan_helper_v2_title')}
      </Text>

      <Text preset="paragraph" className="pt-4">
        {t('kube_add_plan_helper_v2_intro_1')}{' '}
        <strong>{t('kube_add_plan_helper_v2_intro_control_plane')}</strong>.
      </Text>
      <Text preset="paragraph" className="pb-4 pt-2">
        <strong>{t('kube_add_plan_helper_v2_intro_2')}</strong>
      </Text>

      {PLAN_SECTIONS.map((section) => (
        <div key={section.titleKey}>
          <Text preset="paragraph" className="py-2 font-bold italic">
            {t(section.titleKey)}
          </Text>
          <ul className="list-disc space-y-1 pb-2 pl-5">
            {section.features.map((feature, index) => (
              <li key={index}>
                <Text preset="paragraph">
                  <strong>{t(feature.labelKey)}</strong> {t(feature.textKey)}
                </Text>
                {feature.subItemKeys && (
                  <ul className="list-disc space-y-1 pb-2 pl-5">
                    {feature.subItemKeys.map((subItemKey, subIndex) => (
                      <li key={subIndex}>
                        <Text preset="paragraph">{t(subItemKey)}</Text>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Text preset="paragraph" className="pt-2 font-bold">
        {t('kube_add_plan_helper_v2_warning_title')}
      </Text>
      <Text preset="paragraph" className="pt-2">
        {t('kube_add_plan_helper_v2_warning_text')}{' '}
        <strong>{t('kube_add_plan_helper_v2_warning_plan_standard')}</strong>{' '}
        {t('kube_add_plan_helper_v2_warning_text_suffix')}
      </Text>
      <Text preset="paragraph" className="pb-4 pt-2">
        {t('kube_add_plan_helper_v2_warning_consequence')}
      </Text>
    </HelpDrawer>
  );
};
