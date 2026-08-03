import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectModel from './SelectModel';
import {
  InstanceInfo,
  InstanceTechnicalName,
  TechnicalInfo,
} from '@/types/CreatePlan.type';

import { render } from '@/utils/testProvider';

const defaultProps = {
  technicalInfo: [] as TechnicalInfo[],
  instanceCategory: InstanceTechnicalName.b3,
  isInstance: true,
  isTechnicalInfoLoading: false,
  onSelectModel: vi.fn(),
  setInstanceCategory: vi.fn(),
  tabsList: [] as InstanceInfo[],
  technicalModel: 'b3-8',
};

const setupSpecTest = (props = {}) =>
  render(<SelectModel {...defaultProps} {...props} />);

describe('SelectModel', () => {
  it('should render the model description mentioning storage by default', () => {
    setupSpecTest();

    expect(
      screen.getByText('select_model_description_instance_b3'),
    ).toBeInTheDocument();
  });

  it('should render the storage free model description when storage is not displayed', () => {
    setupSpecTest({ isStorageDisplayed: false });

    expect(
      screen.getByText('select_model_description_instance_b3_without_storage'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('select_model_description_instance_b3'),
    ).not.toBeInTheDocument();
  });

  it.each([
    InstanceTechnicalName.c3,
    InstanceTechnicalName.r3,
    InstanceTechnicalName.rancher,
  ])(
    'should keep the standard description for %s when storage is not displayed',
    (instanceCategory) => {
      setupSpecTest({ instanceCategory, isStorageDisplayed: false });

      expect(
        screen.getByText(
          `select_model_description_instance_${instanceCategory}`,
        ),
      ).toBeInTheDocument();
    },
  );
});
