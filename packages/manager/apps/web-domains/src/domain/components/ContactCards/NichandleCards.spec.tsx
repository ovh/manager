import '@/common/setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@/common/utils/test.provider';
import { describe, it, Mock } from 'vitest';
import NichandleCard from './NichandleCard';
import { ServiceInfoContactEnum } from '@/common/enum/common.enum';
import {
  nichandleCorporation,
  nichandleIndividual,
} from '@/domain/__mocks__/nichandle';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';

describe('NichandleCard Component', () => {
  const mockServiceName = 'example.com';
  const mockAdministratorNichandle = 'ADMIN123';
  const mockNichandle = 'aa00001-ovh';

  it('should render spinner when no nichandle information', () => {
    (useNichandleInformation as Mock).mockReturnValue({
      nichandleInformation: null,
    });

    render(
      <NichandleCard
        serviceName={mockServiceName}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
      />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render contact information for individual legal form', () => {
    (useNichandleInformation as Mock).mockReturnValue({
      nichandleInformation: nichandleIndividual,
    });

    render(
      <NichandleCard
        serviceName={mockServiceName}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
      />,
    );

    expect(
      screen.getByText(
        `domain_tab_contact_management_tech_title (${mockNichandle})`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('789 Avenue 67890 FR')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('+33987654321')).toBeInTheDocument();
  });

  it('should render contact information for corporation legal form', () => {
    (useNichandleInformation as Mock).mockReturnValue({
      nichandleInformation: nichandleCorporation,
    });

    render(
      <NichandleCard
        serviceName={mockServiceName}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
      />,
    );

    expect(
      screen.getByText(
        `domain_tab_contact_management_tech_title (${mockNichandle})`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Acme Inc SA')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('789 Avenue 67890 FR')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('+33987654321')).toBeInTheDocument();
    expect(screen.getByText('DEF')).toBeInTheDocument();
    expect(screen.getByText('ABC')).toBeInTheDocument();
    expect(screen.getByText('GHI')).toBeInTheDocument();
  });

  it('should disable modify button when not current nichandle', () => {
    (useNichandleInformation as Mock).mockReturnValue({
      nichandleInformation: nichandleIndividual,
    });

    render(
      <NichandleCard
        serviceName={mockServiceName}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockAdministratorNichandle}
      />,
    );

    expect(
      screen.getByText('@ovh-ux/manager-common-translations/actions:modify'),
    ).toBeDisabled();
  });

  it('should enable and navigate modify button when current nichandle', () => {
    (useNichandleInformation as Mock).mockReturnValue({
      nichandleInformation: nichandleIndividual,
    });

    render(
      <NichandleCard
        serviceName={mockServiceName}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
      />,
    );

    fireEvent.click(
      screen.getByText('@ovh-ux/manager-common-translations/actions:modify'),
    );
  });

  it('should disable reassign button when not current connected nichandle', () => {
    (useNichandleInformation as Mock).mockReturnValue({
      nichandleInformation: nichandleIndividual,
    });

    render(
      <NichandleCard
        serviceName={mockServiceName}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockAdministratorNichandle}
      />,
    );

    expect(
      screen.getByText('@ovh-ux/manager-common-translations/actions:modify'),
    ).toBeDisabled();
  });

  it('should enable and navigate reassign button when administrator nichandle', () => {
    (useNichandleInformation as Mock).mockReturnValue({
      nichandleInformation: nichandleIndividual,
    });

    render(
      <NichandleCard
        serviceName={mockServiceName}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
      />,
    );

    fireEvent.click(
      screen.getByText('@ovh-ux/manager-common-translations/actions:modify'),
    );
  });
});
