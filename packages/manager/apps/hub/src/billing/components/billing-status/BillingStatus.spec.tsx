import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FourServices } from '@/__mocks__/billingServices';

import BillingStatus from './BillingStatus.component';

describe('BillingStatus W3C Validation', () => {
  const [
    serviceResiliated,
    serviceWithManualRenewNotResiliatedWithoutDebt,
    serviceOneShotWithoutResiliation,
    serviceWithoutUrlAndSuspendedBilling,
  ] = FourServices.services;

  it('should have a valid html for service Resiliated', () => {
    const { container } = render(<BillingStatus service={serviceResiliated} />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });

  it('should have a valid html for service With Manual Renew Not ResiliatedWithoutDebt', () => {
    const { container } = render(
      <BillingStatus service={serviceWithManualRenewNotResiliatedWithoutDebt} />,
    );
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });

  it('should have a valid html for service OneSho tWithout Resiliation', () => {
    const { container } = render(<BillingStatus service={serviceOneShotWithoutResiliation} />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });

  it('should have a valid html for service Without Url And Suspended Billing', () => {
    const { container } = render(<BillingStatus service={serviceWithoutUrlAndSuspendedBilling} />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });
});
