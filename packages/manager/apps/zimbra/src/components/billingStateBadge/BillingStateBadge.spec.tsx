import React from 'react';

import { describe, expect } from 'vitest';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { ServiceBillingState } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import BillingStateBadge from './BillingStateBadge.component';

const loadingTestId = 'billing-state-loading';
const defaultTestId = 'billing-state';

describe('BillingStateBadge component', () => {
  it('should be in loading state if isLoading is true', () => {
    const { getByTestId } = render(<BillingStateBadge isLoading />);
    const cmp = getByTestId(loadingTestId);
    expect(cmp).toBeInTheDocument();
  });

  it('should be in loading state if state is not defined', () => {
    const { getByTestId } = render(<BillingStateBadge />);
    const cmp = getByTestId(loadingTestId);
    expect(cmp).toBeInTheDocument();
  });

  it('should correctly display "AUTOMATIC_RENEWAL" state', () => {
    const { getByTestId } = render(
      <BillingStateBadge
        data-testid={defaultTestId}
        state={ServiceBillingState.AUTOMATIC_RENEWAL}
      />,
    );

    const cmp = getByTestId(defaultTestId);
    expect(cmp).toHaveAttribute('label', commonTranslation.service_billing_state_automatic_renewal);
    expect(cmp).toHaveAttribute('color', ODS_BADGE_COLOR.success);
  });

  it('should correctly display "MANUAL_RENEWAL" state', () => {
    const { getByTestId } = render(
      <BillingStateBadge data-testid={defaultTestId} state={ServiceBillingState.MANUAL_RENEWAL} />,
    );

    const cmp = getByTestId(defaultTestId);
    expect(cmp).toHaveAttribute('label', commonTranslation.service_billing_state_manual_renewal);
    expect(cmp).toHaveAttribute('color', ODS_BADGE_COLOR.warning);
  });

  it('should correctly display "CANCELED" state', () => {
    const { getByTestId } = render(
      <BillingStateBadge data-testid={defaultTestId} state={ServiceBillingState.CANCELED} />,
    );

    const cmp = getByTestId(defaultTestId);
    expect(cmp).toHaveAttribute('label', commonTranslation.service_billing_state_canceled);
    expect(cmp).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });

  it('should correctly display "CANCELATION_PLANNED" state', () => {
    const { getByTestId } = render(
      <BillingStateBadge
        data-testid={defaultTestId}
        state={ServiceBillingState.CANCELATION_PLANNED}
      />,
    );

    const cmp = getByTestId(defaultTestId);
    expect(cmp).toHaveAttribute(
      'label',
      commonTranslation.service_billing_state_cancelation_planned,
    );
    expect(cmp).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
});
