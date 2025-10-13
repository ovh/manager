import '@/common/setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it } from 'vitest';
import NichandleCards from './NichandleCards';
import { ServiceInfoContactEnum } from '@/common/enum/common.enum';
import {
  nichandleCorporation,
  nichandleIndividual,
} from '@/domain/__mocks__/nichandle';

describe('NichandleCards Component', () => {
  const mockServiceName = 'example.com';
  const mockAdministratorNichandle = 'ADMIN123';
  const mockNichandle = 'aa00001-ovh';

  it('should render spinner when no nichandle information', () => {
    render(
      <NichandleCards
        serviceName={mockServiceName}
        administratorNichandle={mockAdministratorNichandle}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
        nichandleInformations={null}
      />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render contact information for individual legal form', () => {
    render(
      <NichandleCards
        serviceName={mockServiceName}
        administratorNichandle={mockAdministratorNichandle}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
        nichandleInformations={nichandleIndividual}
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
    render(
      <NichandleCards
        serviceName={mockServiceName}
        administratorNichandle={mockAdministratorNichandle}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
        nichandleInformations={nichandleCorporation}
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
    render(
      <NichandleCards
        serviceName={mockServiceName}
        administratorNichandle={mockAdministratorNichandle}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockAdministratorNichandle}
        nichandleInformations={nichandleIndividual}
      />,
    );

    expect(screen.getByTestId('modify-button')).toBeDisabled();
  });

  it('should enable and navigate modify button when current nichandle', () => {
    render(
      <NichandleCards
        serviceName={mockServiceName}
        administratorNichandle={mockAdministratorNichandle}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
        nichandleInformations={nichandleIndividual}
      />,
    );

    fireEvent.click(screen.getByTestId('modify-button'));
  });

  it('should disable reassign button when not administrator nichandle', () => {
    render(
      <NichandleCards
        serviceName={mockServiceName}
        administratorNichandle="OTHER123"
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
        nichandleInformations={nichandleIndividual}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'domain_tab_contact_management_button_reassign',
      }),
    ).toBeDisabled();
  });

  it('should enable and navigate reassign button when administrator nichandle', () => {
    render(
      <NichandleCards
        serviceName={mockServiceName}
        administratorNichandle={mockNichandle}
        cardType={ServiceInfoContactEnum.Technical}
        nichandle={mockNichandle}
        nichandleInformations={nichandleIndividual}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'domain_tab_contact_management_button_reassign',
      }),
    );
  });
});
