import React from 'react';

import { render, screen } from '@testing-library/react';

import { GeneralInformationProps } from '@/types/GeneralInfo.type';

import GeneralInformationTile from './GeneralInformationTile.component';

describe('GeneralInformationTile', () => {
  const props: GeneralInformationProps = {
    tiles: [
      {
        title: 'Project Information',
        help: 'Extra help tooltip',
        items: [
          { id: '1', label: 'Project Name', value: 'My Project' },
          { id: '2', label: 'Region', value: 'GRA' },
        ],
      },
      {
        title: 'Billing',
        items: [{ id: '3', label: 'Plan', value: 'Premium' }],
      },
    ],
  };

  it('renders all tile titles', () => {
    render(<GeneralInformationTile {...props} />);

    expect(screen.getByText('Project Information')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
  });

  it('renders all item labels and values', () => {
    render(<GeneralInformationTile {...props} />);

    expect(screen.getByText('Project Name')).toBeInTheDocument();
    expect(screen.getByText('My Project')).toBeInTheDocument();

    expect(screen.getByText('Region')).toBeInTheDocument();
    expect(screen.getByText('GRA')).toBeInTheDocument();

    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('renders labels even if help tooltip is provided', () => {
    render(<GeneralInformationTile {...props} />);

    // Just assert the label text shows up
    expect(screen.getByText('Project Name')).toBeInTheDocument();
  });
});
