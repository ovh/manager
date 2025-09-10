import {
  OsdsMessage,
  OsdsText,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { Check, Clock12 } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import { useMemo, useState } from 'react';
import {
  useCatalogPrice,
  convertHourlyPriceToMonthly,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import RadioTile from '@/components/radio-tile/RadioTile.component';

import { StepState } from '../hooks/useStep';
import { cn, isMonoDeploymentZone, isMultiDeploymentZones } from '@/helpers';

import { DeploymentMode, TClusterPlan, TClusterPlanEnum } from '@/types';

import usePlanData from '../hooks/usePlanData';

const PlanTile = ({
  onSubmit,
  step,
  type,
}: {
  onSubmit: (plan: TClusterPlan) => void;
  step: StepState;
  type: DeploymentMode;
}) => {
  const [selected, setSelected] = useState<TClusterPlan>(
    isMonoDeploymentZone(type)
      ? TClusterPlanEnum.FREE
      : TClusterPlanEnum.STANDARD,
  );
  const { t } = useTranslation(['add', 'stepper']);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(selected);
  };
  const { plans, isPending: isPendingPlans } = usePlanData();

  const planIsDisabled = (plan: TClusterPlan) =>
    (isMonoDeploymentZone(type) && plan === TClusterPlanEnum.STANDARD) ||
    (isMultiDeploymentZones(type) && plan === TClusterPlanEnum.FREE);

  const getSortOrder = (typeRegion: string) => {
    const priority = {
      [DeploymentMode.MULTI_ZONES]: TClusterPlanEnum.STANDARD,
      [DeploymentMode.MONO_ZONE]: TClusterPlanEnum.FREE,
    };
    return priority[type as keyof typeof priority]
      ? (a: { value: string }) =>
          a.value === priority[typeRegion as keyof typeof priority] ? -1 : 1
      : () => 0;
  };

  const sortedPlans = useMemo(() => [...plans].sort(getSortOrder(type)), [
    type,
    plans,
  ]);

  return (
    <form data-testid="form" onSubmit={onSubmitHandler}>
      {!step.isLocked && <PlanTile.Banner type={type} />}
      <OsdsText
        className="my-4  block"
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('kube_add_plan_subtitle')}
      </OsdsText>

      <div className=" mt-6 grid grid-cols-1  lg:grid-cols-2  xl:grid-cols-3  gap-4">
        {!step.isLocked &&
          (isPendingPlans ? (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          ) : (
            <>
              {sortedPlans.map((plan) => (
                <RadioTile
                  disabled={planIsDisabled(plan.value)}
                  key={plan.value}
                  data-testid={`plan-tile-radio-tile-${plan.value}`}
                  name="plan-select"
                  tileClassName="h-full "
                  onChange={() =>
                    !planIsDisabled(plan.value) && setSelected(plan.value)
                  }
                  value={plan.value}
                  checked={selected === plan.value}
                >
                  {PlanTile.Header && plan.title && (
                    <PlanTile.Header
                      type={type}
                      value={plan.value}
                      selected={
                        !planIsDisabled(plan.value) && selected === plan.value
                      }
                      title={plan.title}
                      description={plan.description}
                      disabled={planIsDisabled(plan.value)}
                    />
                  )}
                  <RadioTile.Separator />
                  <div className="text-sm flex flex-col p-4">
                    <PlanTile.Content
                      disabled={planIsDisabled(plan.value)}
                      contents={plan.content}
                    />
                  </div>

                  <PlanTile.Footer
                    isFreePlan={plan.value === TClusterPlanEnum.FREE}
                    isDisabled={planIsDisabled(plan.value)}
                    price={plan.price}
                    content={`kube_add_plan_footer_${plan.value}`}
                  />
                </RadioTile>
              ))}
            </>
          ))}
        {step.isLocked && <PlanTile.LockedView value={selected} />}
      </div>
      {!step.isLocked && (
        <Button
          type="submit"
          variant="primary"
          disabled={!selected}
          className=" mt-6 py-8 px-6"
          size="md"
        >
          {t('stepper:common_stepper_next_button_label')}
        </Button>
      )}
    </form>
  );
};

PlanTile.Banner = function PlanTileBanner({ type }: { type: DeploymentMode }) {
  const { t } = useTranslation(['add']);
  const [open, setOpen] = useState(true);
  return (
    open && (
      <OsdsMessage
        removable
        onOdsRemoveClick={() => setOpen(false)}
        className="mt-4"
        type={ODS_MESSAGE_TYPE.info}
        color={ODS_THEME_COLOR_INTENT.info}
      >
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          {isMultiDeploymentZones(type)
            ? t('kube_add_plan_content_unavailable_3AZ_banner', {
                plan: 'Free',
              })
            : t('kube_add_plan_content_unavailable_1AZ_banner', {
                plan: 'Standard',
              })}
        </OsdsText>
      </OsdsMessage>
    )
  );
};

PlanTile.LockedView = function PlanTileLockedView({
  value,
}: {
  value: TClusterPlan;
}) {
  const { t } = useTranslation(['add']);
  const { plans } = usePlanData();
  const plan = useMemo(() => plans.find((p) => p.value === value), [
    plans,
    value,
  ]);

  if (!plan) return null;

  return (
    <RadioTile labelClassName="border-primary-100">
      <div className="  px-4 py-2 flex-col w-full ">
        <h5 data-testid="plan-header-locked" className="capitalize font-bold">
          {t(plan.title)}
        </h5>
      </div>
    </RadioTile>
  );
};

PlanTile.Header = function PlanTileHeader({
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
  value: TClusterPlan;
  type: DeploymentMode;
}) {
  const { t } = useTranslation(['add']);
  const displayWarningMessage =
    disabled &&
    ((value === TClusterPlanEnum.FREE && isMultiDeploymentZones(type)) ||
      (value === TClusterPlanEnum.STANDARD && isMonoDeploymentZone(type)));

  return (
    <div className=" px-6 py-4 flex-col w-full ">
      <div className="flex gap-4">
        <h5 data-testid="plan-header" className="capitalize font-bold">
          {t(title)}
        </h5>
      </div>

      <div className="mt-2 flex flex-col">
        {displayWarningMessage && (
          <span className="text-warning-500 inline-flex gap-1">
            <Clock12 />
            <span>{t('kube_add_plan_content_coming_very_soon')}</span>
          </span>
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
  content,
  price,
  isFreePlan,
  isDisabled,
}: {
  content: string;
  price: number | null;
  isFreePlan: boolean;
  isDisabled: boolean;
}) {
  const { t } = useTranslation(['add', 'stepper', 'flavor-billing']);
  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(5);
  const hasValidPrice = typeof price === 'number';
  const hourlyPrice = hasValidPrice
    ? getFormattedHourlyCatalogPrice(price)
    : null;

  const monthlyPrice = hasValidPrice
    ? getFormattedMonthlyCatalogPrice(convertHourlyPriceToMonthly(price))
    : null;

  if (isDisabled)
    return (
      <div className=" mt-auto w-full rounded-b-md border-none bg-neutral-100 min-h-10" />
    );

  return (
    <div className=" mt-auto w-full rounded-b-md border-none bg-neutral-100">
      {isFreePlan ? (
        <p className=" p-4 text-xl text-primary-600">
          <strong>{t(content)}</strong>
        </p>
      ) : (
        <div className="px-4 pb-4">
          {hourlyPrice && (
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="block pt-4"
            >
              <strong>{hourlyPrice}</strong>
            </OsdsText>
          )}
          {monthlyPrice && (
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="block"
            >
              ~ {monthlyPrice}
            </OsdsText>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanTile;
