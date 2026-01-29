import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GeneralInformations from './GeneralInformations';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { length?: number }) => {
      if (
        key === 'domain_reseller_general_informations_domains_length' &&
        options?.length !== undefined
      ) {
        return `${options.length} domain(s)`;
      }
      return key;
    },
  }),
}));

describe('GeneralInformations', () => {
  it('should render without crashing', () => {
    const { container } = render(<GeneralInformations domainsLength={5} />);
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    render(<GeneralInformations domainsLength={5} />);
    expect(
      screen.getByText(`${NAMESPACES.DASHBOARD}:general_information`),
    ).toBeInTheDocument();
  });

  it('should display the label', () => {
    render(<GeneralInformations domainsLength={5} />);
    expect(
      screen.getByText('domain_reseller_general_informations_label'),
    ).toBeInTheDocument();
  });

  it('should display the domains count value', () => {
    render(<GeneralInformations domainsLength={1} />);
    expect(screen.getByText('1 domain(s)')).toBeInTheDocument();
  });

  it('should display different domains count', () => {
    render(<GeneralInformations domainsLength={10} />);
    expect(screen.getByText('10 domain(s)')).toBeInTheDocument();
  });

  it('should display zero domains count', () => {
    render(<GeneralInformations domainsLength={0} />);
    expect(screen.getByText('0 domain(s)')).toBeInTheDocument();
  });
});
