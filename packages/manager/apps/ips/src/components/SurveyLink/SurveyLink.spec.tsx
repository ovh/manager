import '@/test-utils/setupUnitTests';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
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
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
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
