/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import { createOptimalWrapper } from '@ovh-ux/manager-react-components';

import { GeneralInformationTab } from './GeneralInformation.tab';
import type { NashaServiceDetails } from '@/types/Nasha.type';

const mockService: NashaServiceDetails = {
  serviceName: 'nasha-12345',
  customName: 'My NAS-HA Service',
  datacenter: 'GRA11',
  localeDatacenter: 'Gravelines',
  diskType: 'high-speed',
  canCreatePartition: true,
  monitored: true,
  use: {
    size: { value: 100 * 1024 * 1024 * 1024, unit: 'B', name: 'size' },
    used: { value: 25 * 1024 * 1024 * 1024, unit: 'B', name: 'used' },
    usedbysnapshots: { value: 10 * 1024 * 1024 * 1024, unit: 'B', name: 'snapshots' },
  },
  serviceInfos: {
    serviceType: 'nasha',
    engagedUpTo: '2024-12-31T00:00:00Z',
  },
} as any;

const mockProps = {
  service: mockService,
  onEditName: jest.fn(),
  onGoToPartitions: jest.fn(),
};

describe('GeneralInformationTab', () => {
  it('should display service information', () => {
    render(<GeneralInformationTab {...mockProps} />);

    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('My NAS-HA Service')).toBeInTheDocument();
    expect(screen.getByText('nasha-12345')).toBeInTheDocument();
    expect(screen.getByText('Gravelines')).toBeInTheDocument();
    expect(screen.getByText('HIGH-SPEED')).toBeInTheDocument();
  });

  it('should display configuration with space meter', () => {
    render(<GeneralInformationTab {...mockProps} />);

    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Quota')).toBeInTheDocument();
    expect(screen.getByText(/35.*GB.*used.*\/.*100.*GB/i)).toBeInTheDocument();
  });

  it('should call onEditName when edit button is clicked', () => {
    render(<GeneralInformationTab {...mockProps} />);

    const editButton = screen.getByText('Modifier');
    fireEvent.click(editButton);

    expect(mockProps.onEditName).toHaveBeenCalledTimes(1);
  });

  it('should call onGoToPartitions when partitions button is clicked', () => {
    render(<GeneralInformationTab {...mockProps} />);

    const partitionsButton = screen.getByText('Gérer les partitions');
    fireEvent.click(partitionsButton);

    expect(mockProps.onGoToPartitions).toHaveBeenCalledTimes(1);
  });

  it('should display billing information', () => {
    render(<GeneralInformationTab {...mockProps} />);

    expect(screen.getByText('Facturation')).toBeInTheDocument();
    expect(screen.getByText('nasha')).toBeInTheDocument();
    expect(screen.getByText('31/12/2024')).toBeInTheDocument();
  });
});
