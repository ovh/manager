import { FormEvent, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Badge,
  Button,
  Divider,
  Icon,
  Message,
  MessageBody,
  MessageIcon,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import RadioTile from '@/components/radio-tile/RadioTile.component';
import { cn, isMultiDeploymentZones } from '@/helpers';
import useStandardPlanAvailable from '@/hooks/useStandardPlanAvailable';
import { DeploymentMode, TClusterPlan, TClusterPlanEnum } from '@/types';

import usePlanData from '../hooks/usePlanData';
import { StepState } from '../hooks/useStep';

export type TPlanTileProps = {
  onSubmit: (plan: TClusterPlan) => void;
  step: StepState;
  type: DeploymentMode;
  codes: string[];
};

const PlanTile = ({ onSubmit, step, type, codes }: TPlanTileProps) => {
  const { t } = useTranslation(['add', 'stepper']);

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(selected);
  };
  const { plans, isPending: isPendingPlans } = usePlanData(codes, isMultiDeploymentZones(type));

  const planIsDisabled = (code: string | null) => !code;

  const CODE_PRIORITY = ['standard', 'free'];

  const sortedPlans = useMemo(
    () =>
      [...plans].sort((a, b) => {
        if (a.code === null) return 1;
        if (b.code === null) return -1;

        return CODE_PRIORITY.indexOf(a.code) - CODE_PRIORITY.indexOf(b.code);
      }),
    [plans],
  );

  const [selected, setSelected] = useState<TClusterPlan>(
    sortedPlans?.[0]?.value ?? TClusterPlanEnum.FREE,
  );

  return (
    <form data-testid="form" onSubmit={onSubmitHandler}>
      {!step.isLocked && <PlanTile.Banner type={type} />}
      {!step.isLocked && (
        <Text className="my-4  block" color="text">
          {t('kube_add_plan_subtitle')}
        </Text>
      )}

      <div>
        {!step.isLocked &&
          (isPendingPlans ? (
            <Spinner size="md" data-testid="spinner" />
          ) : (
            <div className="my-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedPlans.map((plan) => (
                <RadioTile
                  disabled={planIsDisabled(plan.code)}
                  key={plan.value}
                  data-testid={`plan-tile-radio-tile-${plan.value}`}
                  name="plan-select"
                  tileClassName="h-full"
                  onChange={() => !planIsDisabled(plan.code) && setSelected(plan.value)}
                  value={plan.value}
                  checked={selected === plan.value}
                >
                  {PlanTile.Header && plan.title && (
                    <PlanTile.Header
                      type={type}
                      value={plan.value}
                      selected={!planIsDisabled(plan.code) && selected === plan.value}
                      title={plan.title}
                      description={plan.description}
                      disabled={planIsDisabled(plan.code)}
                    />
                  )}
                  <div className="px-6 py-2">
                    <Divider />
                  </div>

                  <div className="flex flex-col gap-3 px-6 py-4 text-sm">
                    <PlanTile.Content
                      disabled={planIsDisabled(plan.code)}
                      contents={plan.content}
                    />
                  </div>

                  <PlanTile.Footer
                    isFreePlan={plan.value === TClusterPlanEnum.FREE}
                    isDisabled={planIsDisabled(plan.code)}
                    price={plan.price}
                    content={`kube_add_plan_footer_${plan.value}`}
                  />
                </RadioTile>
              ))}
            </div>
          ))}
        {step.isLocked && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PlanTile.LockedView value={selected} codes={codes} type={type} />
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
  const hasStandardFeature = useStandardPlanAvailable();
  const [open, setOpen] = useState(true);
  return (
    open &&
    ((isMultiDeploymentZones(type) && hasStandardFeature) || !hasStandardFeature) && (
      <Message
        variant="default"
        dismissible
        onRemove={() => setOpen(false)}
        className="mt-4 flex"
        color="information"
      >
        <MessageIcon name="circle-info" />
        <MessageBody>
          {isMultiDeploymentZones(type)
            ? t('kube_add_plan_content_unavailable_3AZ_banner', {
                plan: 'Free',
              })
            : t('kube_add_plan_content_unavailable_1AZ_banner', {
                plan: 'Standard',
              })}
        </MessageBody>
      </Message>
    )
  );
};

PlanTile.LockedView = function PlanTileLockedView({
  value,
  codes,
  type,
}: {
  value: TClusterPlan;
  codes: string[];
  type: DeploymentMode;
}) {
  const { t } = useTranslation(['add']);
  const { plans } = usePlanData(codes, isMultiDeploymentZones(type));
  const plan = useMemo(() => plans.find((p) => p.value === value), [plans, value]);

  if (!plan) return null;

  return (
    <RadioTile labelClassName="border-[--ods-color-primary-200] border">
      <div className="w-full flex-col p-6 ">
        <h5
          data-testid="plan-header-locked"
          className="m-0 text-base font-bold capitalize text-[--ods-color-text-500]"
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
}: {
  selected: boolean;
  title: string;
  description: string;
  disabled: boolean;
  value: TClusterPlan;
  type: DeploymentMode;
}) {
  const { t } = useTranslation(['add']);

  return (
    <div className=" px-6 py-4">
      <div className="flex flex-wrap gap-4">
        <h5
          data-testid="plan-header"
          className="my-0 text-lg  font-bold capitalize text-[--ods-color-element-background-selected]"
        >
          {t(title)}
        </h5>
        {disabled && (
          <Badge className="rounded-[1rem]" color="information">
            {t('kube_add_plan_content_not_available')}
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
    return <div className=" mt-auto min-h-10 w-full rounded-b-md border-none bg-neutral-100" />;

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
