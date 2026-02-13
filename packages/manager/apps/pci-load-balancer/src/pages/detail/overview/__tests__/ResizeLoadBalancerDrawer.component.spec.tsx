import React from 'react';

import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLoadBalancerFlavors } from '@/data/hooks/loadBalancerFlavor/useLoadBalancerFlavors';
import { useResizeLoadBalancerFlavor } from '@/data/hooks/loadBalancerFlavor/useResizeLoadBalancerFlavor';
import ResizeLoadBalancerDrawer from '@/pages/detail/overview/ResizeLoadBalancerDrawer.component';
import { wrapper } from '@/wrapperRenders';

const TITLE_KEY = 'load-balancer/overview:octavia_load_balancer_overview_config_modify_size';
const DESCRIPTION_KEY = 'load-balancer/overview:octavia_load_balancer_resize_drawer.description';
const CANCEL_KEY = 'load-balancer/overview:octavia_load_balancer_resize_drawer.cancel';
const SUBMIT_BUTTON_KEY = TITLE_KEY;

const { mockToast } = vi.hoisted(() => ({
  mockToast: {
    primary: vi.fn(),
    critical: vi.fn(),
  },
}));

vi.mock('@/data/hooks/loadBalancerFlavor/useLoadBalancerFlavors', () => ({
  useLoadBalancerFlavors: vi.fn(),
}));

vi.mock('@/data/hooks/loadBalancerFlavor/useResizeLoadBalancerFlavor', () => ({
  useResizeLoadBalancerFlavor: vi.fn(),
}));

type RadioChildProps = { value?: string };
type RadioElementProps = { children?: React.ReactElement<RadioChildProps> };

/* eslint-disable react/no-multi-comp, react/prop-types -- mock components for ODS in test */
vi.mock('@ovhcloud/ods-react', () => {
  const MockButton = ({
    children,
    onClick,
    loading: _loading,
    disabled,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) => (
    <button type="button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
  const MockDrawer = ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
    open ? <div data-testid="drawer">{children}</div> : null;
  const MockDrawerBody = ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="drawer-body" {...props}>
      {children}
    </div>
  );
  const MockDrawerContent = ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="drawer-content" {...props}>
      {children}
    </div>
  );
  const MockRadio = ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
  }) => (
    <label className={className}>
      <input type="radio" value={value} />
      {children}
    </label>
  );
  const MockRadioGroup = ({
    children,
    value: currentValue,
    onValueChange,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    value: string;
    onValueChange: (detail: { value: string }) => void;
    'aria-label'?: string;
  }) => (
    <div role="radiogroup" aria-label={ariaLabel}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const childProps = (child as React.ReactElement<RadioElementProps>).props;
        const radioChild = childProps?.children;
        const value =
          React.isValidElement<RadioChildProps>(radioChild) && radioChild.props?.value != null
            ? String(radioChild.props.value)
            : undefined;
        return (
          <div
            key={value}
            role="radio"
            aria-checked={value === currentValue}
            tabIndex={0}
            onClick={() => value && onValueChange({ value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (value) onValueChange({ value });
              }
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
  const MockText = ({
    children,
    as,
    className,
  }: {
    children: React.ReactNode;
    preset?: string;
    as?: string;
    className?: string;
  }) => {
    const Tag = (as as keyof JSX.IntrinsicElements) || 'span';
    return <Tag className={className}>{children}</Tag>;
  };
  const MockTile = ({
    children,
    selected,
    className,
  }: {
    children: React.ReactNode;
    selected?: boolean;
    className?: string;
  }) => (
    <div className={className} data-selected={selected}>
      {children}
    </div>
  );
  return {
    Button: MockButton,
    DRAWER_POSITION: { right: 'right' },
    Drawer: MockDrawer,
    DrawerBody: MockDrawerBody,
    DrawerContent: MockDrawerContent,
    ICON_NAME: { circleInfo: 'circleInfo' },
    Icon: () => <span aria-hidden />,
    Radio: MockRadio,
    RadioControl: () => <span />,
    RadioGroup: MockRadioGroup,
    RadioLabel: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Spinner: ({ size }: { size?: string }) => (
      <div role="progressbar" aria-label="loading" data-size={size} />
    ),
    Text: MockText,
    Tile: MockTile,
    toast: mockToast,
  };
});
/* eslint-enable react/no-multi-comp, react/prop-types */

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useCatalogPrice: vi.fn().mockReturnValue({
      getTextPrice: vi.fn((priceInUcents: number) => `${priceInUcents} €`),
    }),
  };
});

const defaultFlavors = [
  { id: 'flavor-small', size: 'small', priceInUcents: 100 },
  { id: 'flavor-medium', size: 'medium', priceInUcents: 200 },
];

const defaultResizeMutate = vi.fn();

const renderDrawer = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    selectedFlavorId: 'flavor-small',
    onDismiss: vi.fn(),
    ...props,
  };
  return render(<ResizeLoadBalancerDrawer {...defaultProps} />, { wrapper });
};

describe('ResizeLoadBalancerDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLoadBalancerFlavors).mockReturnValue({
      loadBalancerFlavors: defaultFlavors,
      isPending: false,
    } as ReturnType<typeof useLoadBalancerFlavors>);
    vi.mocked(useResizeLoadBalancerFlavor).mockReturnValue({
      mutate: defaultResizeMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useResizeLoadBalancerFlavor>);
  });

  describe('visibility', () => {
    it('displays title, description and the two buttons', () => {
      renderDrawer();
      const drawerBody = screen.getByTestId('drawer-body');

      expect(within(drawerBody).getByText(TITLE_KEY)).toBeVisible();
      expect(screen.getByText(DESCRIPTION_KEY)).toBeVisible();
      expect(screen.getByRole('button', { name: CANCEL_KEY })).toBeVisible();
      expect(screen.getByRole('button', { name: SUBMIT_BUTTON_KEY })).toBeVisible();
    });
  });

  describe('loadBalancerFlavors', () => {
    it('displays size items when loadBalancerFlavors is not empty', () => {
      renderDrawer();

      expect(
        screen.getByText(
          'load-balancer/overview:octavia_load_balancer_resize_drawer.small_size_label',
        ),
      ).toBeVisible();
      expect(
        screen.getByText(
          'load-balancer/overview:octavia_load_balancer_resize_drawer.medium_size_label',
        ),
      ).toBeVisible();
    });

    it('shows spinner when flavors are loading', () => {
      vi.mocked(useLoadBalancerFlavors).mockReturnValue({
        loadBalancerFlavors: [],
        isPending: true,
      } as ReturnType<typeof useLoadBalancerFlavors>);

      renderDrawer();

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('submit without size change', () => {
    it('does not call resizeLoadBalancerFlavor when size is not changed and submit is clicked', async () => {
      const user = userEvent.setup();
      renderDrawer({ selectedFlavorId: 'flavor-small' });

      const submitButton = screen.getByRole('button', { name: SUBMIT_BUTTON_KEY });
      await user.click(submitButton);

      expect(defaultResizeMutate).not.toHaveBeenCalled();
    });
  });

  describe('submit with new size', () => {
    it('calls resizeLoadBalancerFlavor when a new size is selected and submit is clicked', async () => {
      const user = userEvent.setup();
      renderDrawer({ selectedFlavorId: 'flavor-small' });

      const mediumLabel = screen.getByText(
        'load-balancer/overview:octavia_load_balancer_resize_drawer.medium_size_label',
      );
      await act(async () => {
        await user.click(mediumLabel);
      });

      const submitButton = screen.getByRole('button', { name: SUBMIT_BUTTON_KEY });
      await act(async () => {
        await user.click(submitButton);
      });

      expect(defaultResizeMutate).toHaveBeenCalledWith({ flavorId: 'flavor-medium' });
    });
  });

  describe('toast on success and error', () => {
    it('calls toast.primary with success message when resize succeeds', async () => {
      let capturedOnSuccess: (() => void) | undefined;
      vi.mocked(useResizeLoadBalancerFlavor).mockImplementation(
        ({ callbacks }: Parameters<typeof useResizeLoadBalancerFlavor>[0]) => {
          capturedOnSuccess = callbacks?.onSuccess;
          return {
            mutate: defaultResizeMutate,
            isPending: false,
          } as unknown as ReturnType<typeof useResizeLoadBalancerFlavor>;
        },
      );

      const user = userEvent.setup();
      renderDrawer({ selectedFlavorId: 'flavor-small' });

      const mediumLabel = screen.getByText(
        'load-balancer/overview:octavia_load_balancer_resize_drawer.medium_size_label',
      );
      await act(async () => {
        await user.click(mediumLabel);
      });
      await act(async () => {
        await user.click(screen.getByRole('button', { name: SUBMIT_BUTTON_KEY }));
      });

      expect(defaultResizeMutate).toHaveBeenCalled();
      act(() => {
        capturedOnSuccess?.();
      });

      await waitFor(() => {
        expect(mockToast.primary).toHaveBeenCalledWith(
          'load-balancer/overview:octavia_load_balancer_resize_drawer.resize_in_progress',
          expect.objectContaining({ dismissible: true }),
        );
      });
    });

    it('calls toast.critical with error message when resize fails', async () => {
      let capturedOnError: ((errorMessage: string) => void) | undefined;
      vi.mocked(useResizeLoadBalancerFlavor).mockImplementation(
        ({ callbacks }: Parameters<typeof useResizeLoadBalancerFlavor>[0]) => {
          capturedOnError = callbacks?.onError;
          return {
            mutate: defaultResizeMutate,
            isPending: false,
          } as unknown as ReturnType<typeof useResizeLoadBalancerFlavor>;
        },
      );

      const user = userEvent.setup();
      renderDrawer({ selectedFlavorId: 'flavor-small' });

      const mediumLabel = screen.getByText(
        'load-balancer/overview:octavia_load_balancer_resize_drawer.medium_size_label',
      );
      await act(async () => {
        await user.click(mediumLabel);
      });
      await act(async () => {
        await user.click(screen.getByRole('button', { name: SUBMIT_BUTTON_KEY }));
      });

      const errorMessage = 'API error message';
      act(() => {
        capturedOnError?.(errorMessage);
      });

      await waitFor(() => {
        expect(mockToast.critical).toHaveBeenCalledWith(
          errorMessage,
          expect.objectContaining({ dismissible: true }),
        );
      });
    });
  });
});
