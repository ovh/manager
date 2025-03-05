import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import Welcome from '@/components/welcome/Welcome.component';

const user = {
  firstname: 'first-test',
  isTrusted: false,
};

const shellContext = {
  environment: {
    user,
  },
};

const renderComponent = () => {
  return render(
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      <Welcome />
    </ShellContext.Provider>,
  );
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string, params: any) =>
      `${translationKey} ${params?.name}`,
  }),
}));

describe('Welcome.component', () => {
  it('should display customer first name', async () => {
    const { getByText } = renderComponent();

    expect(
      getByText(`manager_hub_dashboard_welcome ${user.firstname}`),
    ).not.toBeNull();
  });

  it('should not display SNC badge for non trusted customer', async () => {
    const { queryByTestId } = renderComponent();

    expect(queryByTestId('snc_chip')).not.toBeInTheDocument();
  });

  it('should display SNC badge for trusted customer', async () => {
    user.isTrusted = true;
    const { getByTestId } = renderComponent();

    expect(getByTestId('snc_chip')).not.toBeNull();
  });
});
