import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TileTechnicalInfo } from './TileTechnicalInfo';

import { render } from '@/utils/testProvider';

type TTechnical = React.ComponentProps<typeof TileTechnicalInfo>['technical'];

const technical: TTechnical = {
  bandwidth: { guaranteed: true, level: 1000, unlimited: false },
  cpu: { cores: 8, frequency: 2.3, model: 'b3', type: 'shared' },
  memory: { size: 32 },
  storage: {
    disks: [{ capacity: 50, number: 1, technology: 'NVMe' }],
    raid: '0',
  },
};

const setupSpecTest = ({
  technicalInfo = technical,
  isStorageDisplayed,
}: {
  technicalInfo?: TTechnical;
  isStorageDisplayed?: boolean;
} = {}) =>
  render(
    <TileTechnicalInfo
      name="b3-8"
      technical={technicalInfo}
      isStorageDisplayed={isStorageDisplayed}
    />,
  );

describe('TileTechnicalInfo', () => {
  it('should render the model name', () => {
    setupSpecTest();
    expect(screen.getByText('b3-8')).toBeInTheDocument();
  });

  it('should render memory, cpu and bandwidth characteristics', () => {
    setupSpecTest();

    expect(
      screen.getByText('resource_model_characteristics_gb'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('resource_model_characteristics_cpu'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('resource_model_characteristics_mbits'),
    ).toBeInTheDocument();
  });

  it('should render the storage characteristic by default', () => {
    setupSpecTest();

    expect(
      screen.getByText('resource_model_characteristics_disk'),
    ).toBeInTheDocument();
  });

  it('should render the storage characteristic when storage is displayed', () => {
    setupSpecTest({ isStorageDisplayed: true });

    expect(
      screen.getByText('resource_model_characteristics_disk'),
    ).toBeInTheDocument();
  });

  it('should not render the storage characteristic when storage is not displayed', () => {
    setupSpecTest({ isStorageDisplayed: false });

    expect(
      screen.queryByText('resource_model_characteristics_disk'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('resource_model_characteristics_gb'),
    ).toBeInTheDocument();
  });

  it('should render a flavor that has no storage blob', () => {
    const { storage, ...technicalWithoutStorage } = technical;
    setupSpecTest({ technicalInfo: technicalWithoutStorage });

    expect(screen.getByText('b3-8')).toBeInTheDocument();
    expect(
      screen.queryByText('resource_model_characteristics_disk'),
    ).not.toBeInTheDocument();
  });
});
