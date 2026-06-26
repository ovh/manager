import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsIcon, OdsText } from '@ovhcloud/ods-components/react';

import { LinkType, Links } from '@ovh-ux/manager-react-components';

import { useTunnelLinks } from '@/hooks/useTunnelLinks';

export type TunnelStepsSidebarProps = {
  currentStep: 1 | 2;
};

const STEPS: { id: 1 | 2; labelKey: string }[] = [
  { id: 1, labelKey: 'tunnel:step1_sidebar_label' },
  { id: 2, labelKey: 'tunnel:step2_sidebar_label' },
];

export const TunnelStepsSidebar = ({ currentStep }: TunnelStepsSidebarProps) => {
  const { t } = useTranslation('tunnel');
  const tunnelLinks = useTunnelLinks();

  return (
    <aside
      className="sticky top-8 self-start flex flex-col gap-6"
      aria-label={t('tunnel:steps_aria_label')}
    >
      <nav aria-label={t('tunnel:steps_aria_label')}>
        <ol className="flex flex-col">
          {STEPS.map((step, index) => {
            const isPast = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const badgeColor = isPast
              ? 'var(--ods-color-success-500)'
              : isCurrent
                ? 'var(--ods-color-primary-500)'
                : 'var(--ods-color-neutral-300)';

            return (
              <li key={step.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: badgeColor }}
                    aria-hidden="true"
                  >
                    {isPast ? (
                      <OdsIcon name={ODS_ICON_NAME.check} className="text-white" />
                    ) : (
                      step.id
                    )}
                  </span>
                  {index < STEPS.length - 1 && (
                    <span
                      className={`w-[2px] flex-1 min-h-8 ${
                        currentStep > step.id
                          ? 'bg-[var(--ods-color-success-500)]'
                          : 'bg-[var(--ods-color-neutral-200)]'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="pb-6 pt-1" {...(isCurrent ? { 'aria-current': 'step' } : {})}>
                  <OdsText preset="heading-6">{t(step.labelKey)}</OdsText>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      <section
        className="ml-11 flex flex-col gap-2 rounded-md p-4"
        style={{ backgroundColor: 'var(--ods-color-information-100)' }}
        aria-label={t('tunnel:faq_subtitle')}
      >
        <OdsText preset="heading-6">{t('tunnel:faq_subtitle')}</OdsText>
        <Links
          href={tunnelLinks.faq}
          target="_blank"
          type={LinkType.external}
          label={t('tunnel:faq_link')}
        />
      </section>
    </aside>
  );
};

export default TunnelStepsSidebar;
