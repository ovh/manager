/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import { createOptimalWrapper } from '@ovh-ux/manager-react-components';

import { DashboardHeader } from './DashboardHeader.component';

const mockProps = {
  serviceName: 'nasha-12345',
  customName: 'My NAS-HA Service',
  onEditName: jest.fn(),
  guides: [
    {
      id: 'getting-started',
      link: 'https://docs.ovh.com/fr/storage/nas/decouverte/',
      title: 'Getting Started',
      description: 'Learn how to use NAS-HA',
    },
  ],
  isEolService: false,
};

describe('DashboardHeader', () => {
  it('should display service name and custom name', () => {
    render(<DashboardHeader {...mockProps} />);

    expect(screen.getByText('My NAS-HA Service')).toBeInTheDocument();
    expect(screen.getByText('nasha-12345')).toBeInTheDocument();
  });

  it('should display service name when no custom name', () => {
    render(<DashboardHeader {...mockProps} customName={undefined} />);

    expect(screen.getByText('nasha-12345')).toBeInTheDocument();
  });

  it('should call onEditName when edit button is clicked', () => {
    render(<DashboardHeader {...mockProps} />);

    const editButton = screen.getByLabelText('Modifier le nom');
    fireEvent.click(editButton);

    expect(mockProps.onEditName).toHaveBeenCalledTimes(1);
  });

  it('should display EOL warning when service is EOL', () => {
    render(<DashboardHeader {...mockProps} isEolService={true} />);

    expect(screen.getByText(/Ce service arrive en fin de vie/)).toBeInTheDocument();
  });

  it('should not display guides when no guides provided', () => {
    render(<DashboardHeader {...mockProps} guides={[]} />);

    expect(screen.queryByText('Getting Started')).not.toBeInTheDocument();
  });
});
