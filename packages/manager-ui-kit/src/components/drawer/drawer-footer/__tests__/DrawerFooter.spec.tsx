import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { render } from '@/commons/tests-utils/Render.utils';
import { IamAuthorizationResponse, useAuthorizationIam } from '@/hooks';

import { DrawerFooter } from '../DrawerFooter.component';
import { DrawerFooterProps } from '../DrawerFooter.props';

vitest.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook = useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

export const mockedDrawerFooterProps: DrawerFooterProps = {
  primaryButton: {
    label: 'Confirm',
    isLoading: false,
    isDisabled: false,
    onClick: vi.fn(),
  },
  secondaryButton: {
    label: 'Cancel',
    isLoading: false,
    isDisabled: false,
    onClick: vi.fn(),
  },
};

describe('DrawerFooter', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  it('should display the buttons if they are provided', () => {
    render(<DrawerFooter {...mockedDrawerFooterProps} />);
    const primaryButton = screen.getByText('Confirm');
    const secondaryButton = screen.getByText('Cancel');
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).toHaveTextContent('Confirm');
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveTextContent('Cancel');
  });

  it('should display only the primary button if only the primary button is provided', () => {
    const mockedProps = {
      ...mockedDrawerFooterProps,
      secondaryButton: {
        label: undefined,
      },
    };
    render(<DrawerFooter {...mockedProps} />);

    const primaryButton = screen.getByText('Confirm');
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).toHaveTextContent('Confirm');
    const secondaryButton = screen.queryByText('Cancel');
    expect(secondaryButton).not.toBeInTheDocument();
  });

  it('should display only the secondary button if only the secondary button is provided', () => {
    const mockedProps = {
      ...mockedDrawerFooterProps,
      primaryButton: {
        label: undefined,
      },
    };
    render(<DrawerFooter {...mockedProps} />);

    const secondaryButton = screen.getByText('Cancel');
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveTextContent('Cancel');
    const primaryButton = screen.queryByText('Confirm');
    expect(primaryButton).not.toBeInTheDocument();
  });
});
