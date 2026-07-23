import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsIcon } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { OrderStepId } from '@/types/Order.type';

interface OrderStepperProps {
  steps: OrderStepId[];
  currentIndex: number;
  /** Si fourni, les étapes déjà franchies deviennent cliquables (retour en arrière). */
  onStepSelect?: (step: OrderStepId) => void;
}

type StepState = 'done' | 'active' | 'idle';

const STEP_LABEL_KEY: Record<OrderStepId, string> = {
  [OrderStepId.LICENSE_TYPE]: 'step.license_type.label',
  [OrderStepId.VDP_TIER]: 'step.vdp_tier.label',
  [OrderStepId.SERVER_VAULT]: 'step.server_vault.label',
};

const DOT_CLASS: Record<StepState, string> = {
  done: 'bg-[var(--ods-color-success-500)] text-white',
  active:
    'border-2 border-[var(--ods-color-primary-500)] bg-[var(--ods-color-primary-100)] text-[var(--ods-color-primary-600)]',
  idle: 'border-2 border-[var(--ods-color-neutral-300)] bg-white text-[var(--ods-color-neutral-600)]',
};

const LABEL_CLASS: Record<StepState, string> = {
  done: 'text-[var(--ods-color-neutral-700)]',
  active: 'text-[var(--ods-color-primary-500)] font-semibold',
  idle: 'text-[var(--ods-color-neutral-500)]',
};

/** Stepper horizontal numéroté (maison — inexistant dans ODS/MRC). */
export default function OrderStepper({ steps, currentIndex, onStepSelect }: OrderStepperProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <div className="mx-auto max-w-[480px] py-8">
      <ol className="flex items-start">
        {steps.map((step, index) => {
          const state: StepState =
            index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'idle';
          const isConnectorDone = index <= currentIndex;
          // On n'autorise le clic que vers une étape déjà franchie (retour arrière) :
          // sauter en avant court-circuiterait la validation du bouton « Continuer ».
          const isClickable = Boolean(onStepSelect) && index < currentIndex;

          const dot = (
            <span
              className={`relative z-10 flex h-[36px] w-[36px] items-center justify-center rounded-full text-sm font-bold ${DOT_CLASS[state]}`}
            >
              {state === 'done' ? (
                <OdsIcon name={ODS_ICON_NAME.check} aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
          );
          const label = (
            <span
              className={`relative z-10 text-center text-xs font-medium leading-tight ${LABEL_CLASS[state]}`}
            >
              {t(STEP_LABEL_KEY[step])}
            </span>
          );

          return (
            <li key={step} className="relative flex flex-1 flex-col items-center px-1">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[calc(-50%_+_22px)] right-[calc(50%_+_22px)] top-[17px] h-[2px] ${
                    isConnectorDone
                      ? 'bg-[var(--ods-color-success-500)]'
                      : 'bg-[var(--ods-color-neutral-200)]'
                  }`}
                />
              )}
              {isClickable ? (
                <button
                  type="button"
                  onClick={() => onStepSelect?.(step)}
                  aria-label={t('step.go_to', { label: t(STEP_LABEL_KEY[step]) })}
                  className="m-0 flex cursor-pointer appearance-none flex-col items-center gap-3 border-0 bg-transparent p-0 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ods-color-primary-500)]"
                >
                  {dot}
                  {label}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {dot}
                  {label}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
