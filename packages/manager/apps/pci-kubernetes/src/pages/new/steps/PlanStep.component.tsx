import { FormEvent, useMemo, useState } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Badge, Button, Icon, Message, MessageIcon, Spinner, Text } from '@ovhcloud/ods-react';

import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import RadioTile from '@/components/radio-tile/RadioTile.component';
import { cn, isMonoDeploymentZone, isMultiDeploymentZones } from '@/helpers';
import { DeploymentMode, TClusterPlan, TClusterPlanEnum } from '@/types';

import usePlanData from '../hooks/usePlanData';
import { StepState } from '../hooks/useStep';

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
    isMonoDeploymentZone(type) ? TClusterPlanEnum.FREE : TClusterPlanEnum.STANDARD,
  );
  const { t } = useTranslation(['add', 'stepper']);

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
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

  const sortedPlans = useMemo(() => [...plans].sort(getSortOrder(type)), [type, plans]);

  return (
    <form data-testid="form" onSubmit={onSubmitHandler}>
      {!step.isLocked && <PlanTile.Banner type={type} />}
      <Text className="my-4  block" color="text">
        {t('kube_add_plan_subtitle')}
      </Text>

      <div>
        {!step.isLocked &&
          (isPendingPlans ? (
            <Spinner size="md" />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-6">
              {sortedPlans.map((plan) => (
                <RadioTile
                  disabled={planIsDisabled(plan.value)}
                  key={plan.value}
                  data-testid={`plan-tile-radio-tile-${plan.value}`}
                  name="plan-select"
                  tileClassName="h-full"
                  onChange={() => !planIsDisabled(plan.value) && setSelected(plan.value)}
                  value={plan.value}
                  checked={selected === plan.value}
                >
                  {PlanTile.Header && plan.title && (
                    <PlanTile.Header
                      type={type}
                      value={plan.value}
                      selected={!planIsDisabled(plan.value) && selected === plan.value}
                      title={plan.title}
                      description={plan.description}
                      disabled={planIsDisabled(plan.value)}
                    />
                  )}
                  <div className="px-6 py-2">
                    <hr
                      className={clsx(
                        'w-full border-solid border-0 border-b border-[--ods-color-neutral-100]',
                      )}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="text-sm flex flex-col px-6 py-4 gap-3">
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
            </div>
          ))}
        {step.isLocked && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PlanTile.LockedView value={selected} />
          </div>
        )}
      </div>
      {!step.isLocked && !isPendingPlans && (
        <Button
          className="mt-2 w-fit p-6"
          size="md"
          type="submit"
          color="primary"
          disabled={!selected}
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
      <Message
        variant="default"
        dismissible
        onRemove={() => setOpen(false)}
        className="mt-4"
        color="information"
      >
        <MessageIcon name="circle-info" />

        {isMultiDeploymentZones(type)
          ? t('kube_add_plan_content_unavailable_3AZ_banner', {
              plan: 'Free',
            })
          : t('kube_add_plan_content_unavailable_1AZ_banner', {
              plan: 'Standard',
            })}
      </Message>
    )
  );
};

PlanTile.LockedView = function PlanTileLockedView({ value }: { value: TClusterPlan }) {
  const { t } = useTranslation(['add']);
  const { plans } = usePlanData();
  const plan = useMemo(() => plans.find((p) => p.value === value), [plans, value]);

  if (!plan) return null;

  return (
    <RadioTile labelClassName="border-[--ods-color-information-100] border">
      <div className="px-4 py-2 flex-col w-full ">
        <h5
          data-testid="plan-header-locked"
          className="capitalize font-bold text-[--ods-color-text-disabled-default]"
        >
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
    <div className=" px-6 py-4">
      <div className="flex flex-wrap gap-4">
        <h5
          data-testid="plan-header"
          className={clsx(
            'capitalize font-bold  text-lg text-[--ods-color-element-background-selected] mb-0 mt-0',
          )}
        >
          {t(title)}
        </h5>
        {displayWarningMessage && (
          <Badge className="rounded-[1rem]" color="information">
            {t('kube_add_plan_content_coming_very_soon')}
          </Badge>
        )}
      </div>

      <div className="mt-2 flex flex-wrap">
        <span className="text-[--ods-color-text-500]">{t(description)}</span>
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
    <span className="flex items-baseline gap-4 text-sm text-[--ods-color-text-500]" key={text}>
      <Icon
        name="check"
        className={cn('shrink-0', {
          'text-[--ods-color-text-500]': disabled,
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
  const { getFormattedHourlyCatalogPrice, getFormattedMonthlyCatalogPrice } = useCatalogPrice(5);
  const hasValidPrice = typeof price === 'number';
  const hourlyPrice = hasValidPrice ? getFormattedHourlyCatalogPrice(price) : null;

  const monthlyPrice = hasValidPrice
    ? getFormattedMonthlyCatalogPrice(convertHourlyPriceToMonthly(price))
    : null;

  if (isDisabled)
    return <div className=" mt-auto w-full rounded-b-md border-none bg-neutral-100 min-h-10" />;

  return (
    <div className=" mt-auto w-full rounded-b-md border-none bg-neutral-100">
      {isFreePlan ? (
        <p className="m-0 p-4 text-xl text-[--ods-color-primary-600]">
          <strong>{t(content)}</strong>
        </p>
      ) : (
        <div className="px-4 pb-4">
          {hourlyPrice && (
            <Text color="text" className="block pt-4">
              <strong>{hourlyPrice}</strong>
            </Text>
          )}
          {monthlyPrice && (
            <Text color="text" className="block">
              ~ {monthlyPrice}
            </Text>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanTile;
