import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GeneralInformation from '@/domain-reseller/components/Dashboard/GeneralInformation';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

describe('GeneralInformation', () => {
  it('should render without crashing', () => {
    const { container } = render(<GeneralInformation domainsLength={5} />);
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    render(<GeneralInformation domainsLength={5} />);
    expect(
      screen.getByText(`${NAMESPACES.DASHBOARD}:general_information`),
    ).toBeInTheDocument();
  });

  it('should display the label', () => {
    render(<GeneralInformation domainsLength={5} />);
    expect(
      screen.getByText('domain_reseller_general_informations_label'),
    ).toBeInTheDocument();
  });

  it('should display the domains count value', () => {
    render(<GeneralInformation domainsLength={1} />);
    expect(
      screen.getByText('domain_reseller_general_informations_domains_length'),
    ).toBeInTheDocument();
  });

  it('should display different domains count', () => {
    render(<GeneralInformation domainsLength={10} />);
    expect(
      screen.getByText('domain_reseller_general_informations_domains_length'),
    ).toBeInTheDocument();
  });

  it('should display zero domains count', () => {
    render(<GeneralInformation domainsLength={0} />);
    expect(
      screen.getByText('domain_reseller_general_informations_no_domains'),
    ).toBeInTheDocument();
  });
});
