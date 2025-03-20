import { Check, XCircle } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import { TClusterCreationForm } from '../useCusterCreationStepper';
import { StepState } from '../useStep';

type Plan = {
  disabled: boolean;
  getTitle: ({ t }: { t: TFunction<'add'> }) => string;
  getDescription: ({ t }: { t: TFunction<'add'> }) => JSX.Element;
  getContent: ({ t }: { t: TFunction<'add'> }) => JSX.Element[];
  getFooter?: ({ t }: { t: TFunction<'add'> }) => string;
  value: TClusterCreationForm['plan'];
};

const plans: Plan[] = [
  {
    disabled: false,
    getFooter: ({ t }) => t('kube_add_plan_footer_standard'),
    getTitle: ({ t }) => t('kube_add_plan_title_standard'),
    getDescription: ({ t }) => (
      <>
        <span>{t('kube_add_plan_description_standard')},</span>
      </>
    ),

    getContent: ({ t }) =>
      [
        'kube_add_plan_content_standard_control',
        'kube_add_plan_content_standard_high_availability',
        'kube_add_plan_content_standard_auto_scaling',
        'kube_add_plan_content_standard_version',
      ].map((text, index) => (
        <span className="flex items-start gap-1" key={index}>
          <Check className="text-teal-500" />
          {t(text)}
        </span>
      )),

    value: 'standard',
  },
  {
    disabled: true,
    getTitle: ({ t }) => t('kube_add_plan_title_premium'),
    getDescription: ({ t }) => (
      <>
        <span className="text-critical-500 inline-flex gap-1">
          <XCircle />
          <span>{t('kube_add_plan_no_available_plan')}</span>
        </span>
        <span>{t('kube_add_plan_description_premium')}</span>
      </>
    ),

    getContent: ({ t }) =>
      [
        'kube_add_plan_content_premium_SLA',
        'kube_add_plan_content_premium_3AZ_control_plane',
        'kube_add_plan_content_premium_scaling',
        'kube_add_plan_content_premium_version',
      ].map((text, index) => (
        <span className="flex items-start gap-1" key={index}>
          <Check className="text-neutral-600" />
          {t(text)}
        </span>
      )),
    value: 'premium',
  },
];

const PlanTile = ({
  onSubmit,
  step,
}: {
  onSubmit: (plan: TClusterCreationForm['plan']) => void;
  step: StepState;
}) => {
  const [selected, setSelected] = useState<TClusterCreationForm['plan']>(
    'standard',
  );
  const { t } = (useTranslation(['add', 'stepper']) as unknown) as {
    t: TFunction<'add'>;
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(selected);
  };

  return (
    <form data-testid="form" onSubmit={onSubmitHandler}>
      <div className=" mt-6 grid grid-cols-1  lg:grid-cols-2  xl:grid-cols-4  gap-4">
        {!step.isLocked &&
          plans.map((plan) => (
            <RadioTile
              disabled={plan.disabled}
              key={plan.value}
              data-testid={`plan-tile-radio-tile-${plan.value}`}
              name="plan-select"
              tileClassName="min-h-[350px] "
              onChange={() => !plan.disabled && setSelected(plan.value)}
              value={plan.value}
              checked={selected === plan.value}
            >
              <div className="  px-4 py-2 flex-col w-full ">
                <h5
                  data-testid="plan-header"
                  className={`capitalize ${
                    !plan.disabled && selected === plan.value
                      ? 'font-bold'
                      : 'font-normal'
                  }`}
                >
                  {plan.getTitle({ t })}
                </h5>
                <div className="mt-2 flex flex-col">
                  {plan.getDescription({ t })}
                </div>
              </div>
              <RadioTile.Separator />
              <div className="text-sm flex flex-col p-4">
                {plan.getContent({ t })}
              </div>
              {plan.getFooter && (
                <div className=" mt-auto w-full rounded-b-md border-none bg-neutral-100">
                  <p className=" p-4 text-xl text-primary-600">
                    <strong data-testid={`plan-footer${plan.value}`}>
                      {plan.getFooter({ t })}
                    </strong>
                  </p>
                </div>
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
  const { t } = (useTranslation(['add', 'stepper']) as unknown) as {
    t: TFunction<'add'>;
  };
  const plan = plans.find((p) => p.value === value);

  return (
    <RadioTile labelClassName="border-neutral-200">
      <div className="  px-4 py-2 flex-col w-full ">
        <h5 data-testid="plan-header-locked" className="capitalize font-bold">
          {plan.getTitle({ t })}
        </h5>
      </div>
    </RadioTile>
  );
};

export default PlanTile;
