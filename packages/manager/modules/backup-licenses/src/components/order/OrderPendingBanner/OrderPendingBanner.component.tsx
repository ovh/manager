import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCard,
  OdsMessage,
  OdsProgressBar,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES, PENDING_ORDER_TIMEOUT_MS } from '@/module.constants';

export const ORDER_PENDING_BANNER_TEST_ID = 'order-pending-banner';
export const ORDER_PENDING_PROGRESS_TEST_ID = 'order-pending-progress';
export const ORDER_PENDING_TIMEOUT_TEST_ID = 'order-pending-timeout';
export const ORDER_PENDING_ERROR_TEST_ID = 'order-pending-error';

const SWEEP_DURATION_MS = 1_800;
const SWEEP_TICK_MS = 60;
const PROGRESS_MAX = 100;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const useIndeterminateValue = (): number => {
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [isAnimated] = useState(prefersReducedMotion() === false);

  useEffect(() => {
    if (!isAnimated) return undefined;

    const startedAt = Date.now();
    const interval = setInterval(() => setElapsed(Date.now() - startedAt), SWEEP_TICK_MS);
    return () => clearInterval(interval);
  }, [isAnimated]);

  if (!isAnimated) return PROGRESS_MAX;

  const sweep = ((elapsed ?? 0) % SWEEP_DURATION_MS) / SWEEP_DURATION_MS;
  return Math.round(sweep * PROGRESS_MAX);
};

const useHasTimedOut = (submittedAt: number | null): boolean => {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (submittedAt === null || hasTimedOut) return undefined;

    const remaining = Math.max(PENDING_ORDER_TIMEOUT_MS - (Date.now() - submittedAt), 0);
    const timer = setTimeout(() => setHasTimedOut(true), remaining);
    return () => clearTimeout(timer);
  }, [submittedAt, hasTimedOut]);

  return hasTimedOut;
};

export type OrderPendingBannerProps = {
  submittedAt: number | null;
  orderId: number | null;
  hasDeliveryFailed: boolean;
  onRestart: () => void;
};

export default function OrderPendingBanner({
  submittedAt,
  orderId,
  hasDeliveryFailed,
  onRestart,
}: OrderPendingBannerProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const value = useIndeterminateValue();
  const hasTimedOut = useHasTimedOut(submittedAt);

  if (hasDeliveryFailed) {
    return (
      <OdsCard className="flex flex-col gap-4 p-6" data-testid={ORDER_PENDING_BANNER_TEST_ID}>
        <OdsMessage
          color={ODS_MESSAGE_COLOR.critical}
          isDismissible={false}
          data-testid={ORDER_PENDING_ERROR_TEST_ID}
        >
          {t('pending.error.delivery')}
        </OdsMessage>
        <div>
          <OdsButton
            type="button"
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('pending.restart')}
            onClick={onRestart}
          />
        </div>
      </OdsCard>
    );
  }

  return (
    <OdsCard className="flex flex-col gap-4 p-6" data-testid={ORDER_PENDING_BANNER_TEST_ID}>
      <div className="flex flex-col gap-1">
        <OdsText preset={ODS_TEXT_PRESET.heading5}>{t('pending.title')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('pending.description')}</OdsText>
        {orderId !== null && (
          <OdsText
            preset={ODS_TEXT_PRESET.caption}
            className="[--ods-color-text:var(--ods-color-neutral-500)]"
          >
            {t('pending.order_id', { orderId })}
          </OdsText>
        )}
      </div>

      <OdsProgressBar
        data-testid={ORDER_PENDING_PROGRESS_TEST_ID}
        aria-label={t('pending.progress_label')}
        aria-busy="true"
        className="block w-full"
        value={value}
        max={PROGRESS_MAX}
      />

      {hasTimedOut && (
        <OdsMessage
          color={ODS_MESSAGE_COLOR.warning}
          isDismissible={false}
          data-testid={ORDER_PENDING_TIMEOUT_TEST_ID}
        >
          {t('pending.timeout')}
        </OdsMessage>
      )}

      <div className="sr-only" role="status" aria-live="polite">
        {t('pending.description')}
      </div>
    </OdsCard>
  );
}
