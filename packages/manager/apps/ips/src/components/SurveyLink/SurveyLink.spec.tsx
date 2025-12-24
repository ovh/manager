import React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';

import '@/test-utils/setupUnitTests';

import { SurveyLink } from './SurveyLink';

const shellContext = {
  environment: {
    user: {
      nichandle: 'test-nic',
      ovhSubsidiary: 'FR',
    },
  },
  shell: {
    tracking: {
      trackClick: vi.fn(),
      trackPage: vi.fn(),
      init: vi.fn(),
    },
  },
};

/** RENDER */
const renderComponent = () => {
  return render(
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      <SurveyLink />
    </ShellContext.Provider>,
  );
};

describe('SurveyLink Component', () => {
  it('Should render correctly with survey URL and tooltip', () => {
    const { asFragment } = renderComponent();

    expect(asFragment()).toMatchSnapshot();
  });
});
