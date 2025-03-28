import {
  OsdsMessage,
  OsdsText,
  OsdsButton,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_CHIP_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { Check, XCircle, Clock12 } from 'lucide-react';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RadioTile from '@/components/radio-tile/RadioTile.component';

import { TClusterCreationForm } from '../useCusterCreationStepper';
import { StepState } from '../useStep';
import { cn } from '@/helpers';

import { DeploymentMode } from '@/types';

type Plan = {
  title: string;
  type: DeploymentMode;
  description: string;
  content: string[];
  footer?: string;
  value: TClusterCreationForm['plan'];
};

const plans: Plan[] = [
  {
    title: 'kube_add_plan_title_standard',
    description: 'kube_add_plan_description_standard',
    content: [
      'kube_add_plan_content_standard_control',
      'kube_add_plan_content_standard_high_availability',
      'kube_add_plan_content_standard_SLO',
      'kube_add_plan_content_standard_auto_scaling',
      'kube_add_plan_content_standard_ETCD',
      'kube_add_plan_content_standard_version',
      'kube_add_plan_content_standard_100',
    ],
    value: 'standard',
    type: DeploymentMode.MONO_ZONE,
  },
  {
    title: 'kube_add_plan_title_premium',
    description: 'kube_add_plan_description_premium',
    content: [
      'kube_add_plan_content_premium_3AZ_control_plane',
      'kube_add_plan_content_premium_disponibility',
      'kube_add_plan_content_premium_SLA',
      'kube_add_plan_content_standard_auto_scaling',
      'kube_add_plan_content_premium_ETCD',
      'kube_add_plan_content_premium_version',
      'kube_add_plan_content_premium_500',
    ],
    type: DeploymentMode.MULTI_ZONES,
    value: 'premium',
  },
];

const PlanTile = ({
  onSubmit,
  step,
  type,
}: {
  onSubmit: (plan: TClusterCreationForm['plan']) => void;
  step: StepState;
  type: DeploymentMode;
}) => {
  const [selected, setSelected] = useState<TClusterCreationForm['plan']>(
    type === DeploymentMode.MONO_ZONE ? 'standard' : 'premium',
  );
  const { t } = useTranslation(['add', 'stepper']);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(selected);
  };

  const planIsDisabled = (plan) =>
    (type === DeploymentMode.MONO_ZONE && plan.value === 'premium') ||
    (type === DeploymentMode.MULTI_ZONES && plan.value === 'standard');

  const getSortOrder = (typeRegion: string) => {
    const priority = {
      [DeploymentMode.MULTI_ZONES]: 'premium',
      [DeploymentMode.MONO_ZONE]: 'standard',
    };
    return priority[type]
      ? (a) => (a.value === priority[typeRegion] ? -1 : 1)
      : () => 0;
  };

  const sortedPlans = useMemo(() => [...plans].sort(getSortOrder(type)), [
    type,
    plans,
  ]);

  return (
    <form data-testid="form" onSubmit={onSubmitHandler}>
      {!step.isLocked && <PlanTile.Banner type={type} />}
      <div className=" mt-6 grid grid-cols-1  lg:grid-cols-2  xl:grid-cols-3  gap-4">
        {!step.isLocked && (
          <>
            {sortedPlans.map(({ content, ...plan }) => (
              <RadioTile
                disabled={planIsDisabled(plan)}
                key={plan.value}
                data-testid={`plan-tile-radio-tile-${plan.value}`}
                name="plan-select"
                tileClassName="h-full "
                onChange={() =>
                  !planIsDisabled(plan) && setSelected(plan.value)
                }
                value={plan.value}
                checked={selected === plan.value}
              >
                {PlanTile.Header && plan.title && (
                  <PlanTile.Header
                    type={type}
                    value={plan.value}
                    selected={!planIsDisabled(plan) && selected === plan.value}
                    title={plan.title}
                    description={plan.description}
                    disabled={planIsDisabled(plan)}
                  />
                )}
                <RadioTile.Separator />
                <div className="text-sm flex flex-col py-4 px-6">
                  <PlanTile.Content
                    disabled={planIsDisabled(plan)}
                    contents={content}
                  />
                </div>

                {!planIsDisabled(plan) && (
                  <PlanTile.Footer
                    value={plan.value}
                    content={`kube_add_plan_footer_${plan.value}`}
                  />
                )}
              </RadioTile>
            ))}
          </>
        )}
        {step.isLocked && <PlanTile.LockedView value={selected} />}
      </div>
      {!step.isLocked && (
        <OsdsButton
          className="mt-4"
          type={ODS_BUTTON_TYPE.submit}
          color={ODS_TEXT_COLOR_INTENT.primary}
          inline
          disabled={!selected || undefined}
        >
          {t('stepper:common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </form>
  );
};

PlanTile.Banner = function PlanTileBanner({ type }: { type: DeploymentMode }) {
  const { t } = useTranslation(['add']);
  return (
    <OsdsMessage
      removable
      className="mt-4"
      type={ODS_MESSAGE_TYPE.info}
      color={ODS_THEME_COLOR_INTENT.info}
    >
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        {type === DeploymentMode.MULTI_ZONES
          ? t('kube_add_plan_content_standard_3AZ_banner')
          : t('kube_add_plan_content_premium_1AZ_banner')}
      </OsdsText>
    </OsdsMessage>
  );
};

PlanTile.LockedView = function PlanTileLockedView({
  value,
}: {
  value: string;
}) {
  const { t } = useTranslation(['add']);
  const plan = useMemo(() => plans.find((p) => p.value === value), [value]);

  return (
    <RadioTile labelClassName="border-primary-100">
      <div className="  p-6 flex-col w-full ">
        <h5 data-testid="plan-header-locked" className="capitalize font-bold">
          {t(plan.title)}
        </h5>
      </div>
    </RadioTile>
  );
};

PlanTile.Header = function PlanTileHeader({
  selected,
  title,
  description,
  disabled,
  value,
  type,
}: {
  selected: boolean;
  title: string;
  description: string;
  disabled: boolean;
  value: string;
  type: DeploymentMode;
}) {
  const { t } = useTranslation(['add']);

  const renderWarningMessage = (condition, icon, messageKey, textClass) => {
    if (!condition) return null;
    const IconComponent = icon;
    return (
      <span className={`${textClass} inline-flex gap-1`}>
        <IconComponent />
        <span>{t(messageKey)}</span>
      </span>
    );
  };

  return (
    <div className=" px-6 py-4 flex-col w-full ">
      <div className="flex gap-4">
        <h5
          data-testid="plan-header"
          className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
        >
          {t(title)}
        </h5>
        {value === 'premium' && (
          <div className="flex items-baseline gap-3">
            <OsdsChip
              color={ODS_THEME_COLOR_INTENT.success}
              size={ODS_CHIP_SIZE.sm}
              inline
            >
              {t('add:kubernetes_add_deployment_mode_card_beta')}
            </OsdsChip>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col">
        {renderWarningMessage(
          disabled && value === 'premium' && type === DeploymentMode.MONO_ZONE,
          XCircle,
          'kube_add_plan_no_available_plan',
          'text-critical-500',
        )}
        {renderWarningMessage(
          disabled &&
            value === 'standard' &&
            type === DeploymentMode.MULTI_ZONES,
          Clock12,
          'kube_add_plan_content_standard_very_soon',
          'text-warning-500',
        )}
        <span>{t(description)}</span>
      </div>
    </div>
  );
};

PlanTile.Content = function PlanTileContent({
  contents,
  disabled,
}: {
  contents: string[];
  disabled: boolean;
}) {
  const { t } = useTranslation(['add']);
  return contents.map((text) => (
    <span className="flex items-start gap-1" key={text}>
      <Check
        className={cn('shrink-0', {
          'text-neutral-600': disabled,
          'text-teal-500': !disabled,
        })}
      />
      {t(text)}
    </span>
  ));
};

PlanTile.Footer = function PlanTileFooter({
  value,
  content,
}: {
  value: string;
  content: string;
}) {
  const { t } = useTranslation(['add', 'stepper']);
  return (
    <div className=" mt-auto w-full rounded-b-md border-none bg-neutral-100">
      <p className=" p-6 text-xl text-primary-600">
        <strong data-testid={`plan-footer${value}`}>{t(content)}</strong>
      </p>
    </div>
  );
};

export default PlanTile;
