import { Check, XCircle } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import { TClusterCreationForm } from '../useCusterCreationStepper';
import { StepState } from '../useStep';
import { cn } from '@/helpers';

type Plan = {
  title: string;
  type: 'region' | 'region-3-az';
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
    type: 'region',
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
    type: 'region-3-az',
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
  type: string;
}) => {
  const [selected, setSelected] = useState<TClusterCreationForm['plan']>(
    type === 'region' ? 'standard' : 'premium',
  );
  const { t } = (useTranslation(['add', 'stepper']) as unknown) as {
    t: TFunction<'add'>;
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(selected);
  };

  const planIsDisabled = (plan) =>
    (type === 'region' && plan.value === 'premium') ||
    (type === 'region-3-az' && plan.value === 'standard');

  const sortedPlans = useMemo(() => {
    if (type === 'region-3-az') {
      return [...plans].sort((a) => (a.value === 'premium' ? -1 : 1));
    }
    if (type === 'region') {
      return [...plans].sort((a) => (a.value === 'standard' ? -1 : 1));
    }
    return plans;
  }, [type, plans]);

  return (
    <form data-testid="form" onSubmit={onSubmitHandler}>
      <div className=" mt-6 grid grid-cols-1  lg:grid-cols-2  xl:grid-cols-3  gap-4">
        {!step.isLocked &&
          sortedPlans.map(({ content, ...plan }) => (
            <RadioTile
              disabled={planIsDisabled(plan)}
              key={plan.value}
              data-testid={`plan-tile-radio-tile-${plan.value}`}
              name="plan-select"
              tileClassName="min-h-[350px] "
              onChange={() => !planIsDisabled(plan) && setSelected(plan.value)}
              value={plan.value}
              checked={selected === plan.value}
            >
              {PlanTile.Header && plan.title && (
                <PlanTile.Header
                  selected={!planIsDisabled(plan) && selected === plan.value}
                  title={plan.title}
                  description={plan.description}
                  disabled={planIsDisabled(plan)}
                />
              )}
              <RadioTile.Separator />
              <div className="text-sm flex flex-col p-4">
                <PlanTile.Content
                  disabled={planIsDisabled(plan)}
                  contents={content}
                />
              </div>
              {!planIsDisabled(plan) && (
                <PlanTile.Footer
                  value={plan.value}
                  content="kube_add_plan_footer_standard"
                />
              )}
            </RadioTile>
          ))}
        {step.isLocked && <PlanTile.LockedView value={selected} />}
      </div>
      {!step.isLocked && (
        <Button
          type="submit"
          variant="primary"
          disabled={!selected}
          className=" mt-6 py-4 px-5 "
          size="md"
        >
          {t('stepper:common_stepper_next_button_label')}
        </Button>
      )}
    </form>
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
    <RadioTile labelClassName="border-neutral-200">
      <div className="  px-4 py-2 flex-col w-full ">
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
}: {
  selected: boolean;
  title: string;
  description: string;
  disabled: boolean;
}) {
  const { t } = useTranslation(['add']);
  return (
    <div className="  px-4 py-2 flex-col w-full ">
      <h5
        data-testid="plan-header"
        className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
      >
        {t(title)}
      </h5>
      <div className="mt-2 flex flex-col">
        {disabled && (
          <span className="text-critical-500 inline-flex gap-1">
            <XCircle />
            <span>{t('kube_add_plan_no_available_plan')}</span>
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
  return contents.map((text, index) => (
    <span className="flex items-start gap-1" key={index}>
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
      <p className=" p-4 text-xl text-primary-600">
        <strong data-testid={`plan-footer${value}`}>{t(content)}</strong>
      </p>
    </div>
  );
};

export default PlanTile;
