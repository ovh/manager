import { render } from '@testing-library/react';
import { describe } from 'vitest';
import { MaintenanceBanner } from './MaintenanceBanner.component';

describe('MaintenanceBanner component tests', () => {
  it('should display spinner when isPending equal true', () => {
    const props = {
      maintenanceURL: 'https://mocked-url.com',
    };

    const { getByTestId } = render(<MaintenanceBanner {...props} />);

    expect(
      (getByTestId('maintennaceBanner_link') as HTMLOsdsLinkElement).href,
    ).toBe(props.maintenanceURL);
  });
});
