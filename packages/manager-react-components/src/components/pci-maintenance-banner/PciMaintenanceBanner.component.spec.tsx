import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PciMaintenanceBanner } from './PciMaintenanceBanner.component';
import { render } from '../../utils/test.provider';

jest.mock('react-i18next', () => {
  const original = jest.requireActual('react-i18next');
  return {
    ...original,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});

describe('PciMaintenanceBanner', () => {
  it('should display maintenance url', () => {
    const url = 'www.ovhcloud.com';
    render(<PciMaintenanceBanner maintenanceURL={url} />);
    const link = screen.getByTestId('pci-maintenance-banner-link');
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should display project name', () => {
    const url = 'www.ovhcloud.com';
    const name = 'foobar';
    render(<PciMaintenanceBanner maintenanceURL={url} projectName={name} />);
    expect(
      screen.getByText('pci_projects_maintenance_banner_info_project_page'),
    ).toBeDefined();
  });

  it('should display product name', () => {
    const url = 'www.ovhcloud.com';
    const name = 'hello';
    render(<PciMaintenanceBanner maintenanceURL={url} productName={name} />);
    expect(
      screen.getByText('pci_projects_maintenance_banner_info_list_page'),
    ).toBeDefined();
  });

  it('should display service name', () => {
    const url = 'www.ovhcloud.com';
    const name = 'world';
    render(<PciMaintenanceBanner maintenanceURL={url} serviceName={name} />);
    expect(
      screen.getByText('pci_projects_maintenance_banner_info_product_page'),
    ).toBeDefined();
  });
});
