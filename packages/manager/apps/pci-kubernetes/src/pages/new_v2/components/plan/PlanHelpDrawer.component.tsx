import { Fragment } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';

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

export const PlanHelpDrawer = () => {
  const { t } = useTranslation('add');

  return (
    <HelpDrawer headerContent={t('kube_add_plan_helper_v2_title')}>
      <Text>
        <Trans i18nKey="kube_add_plan_helper_v2_intro_1" ns="add" components={{ b: <strong /> }} />
      </Text>
      <Text>
        <Trans i18nKey="kube_add_plan_helper_v2_intro_2" ns="add" components={{ b: <strong /> }} />
      </Text>

      {PLAN_SECTIONS.map((section) => (
        <Fragment key={section.titleKey}>
          <Text preset="heading-4" className="mt-9">
            {t(section.titleKey)}
          </Text>
          {section.features.map((feature, index) => (
            <Fragment key={index}>
              <Text preset="paragraph" className="mt-5">
                <strong>{t(feature.labelKey)}</strong> {t(feature.textKey)}
              </Text>

              {feature.subItemKeys && (
                <ul className="my-0 mt-3 list-disc space-y-1 pl-8">
                  {feature.subItemKeys.map((subItemKey, subIndex) => (
                    <li key={subIndex}>
                      <Text preset="paragraph">{t(subItemKey)}</Text>
                    </li>
                  ))}
                </ul>
              )}
            </Fragment>
          ))}
        </Fragment>
      ))}

      <Text preset="heading-4" className="mt-9">
        {t('kube_add_plan_helper_v2_warning_title')}
      </Text>
      <Text className="mt-5">
        <Trans
          i18nKey="kube_add_plan_helper_v2_warning_text"
          ns="add"
          components={{ b: <strong /> }}
        />
      </Text>
      <Text className="mt-5">{t('kube_add_plan_helper_v2_warning_consequence')}</Text>
    </HelpDrawer>
  );
};
