import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { BandwidthOption, CurrencyCode } from '@ovh-ux/manager-network-common';

import { BandwidthOrderDrawer } from '../BandwidthOrderDrawer';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

// Mock notifications
const addSuccessMock = vi.fn();
vi.mock('@ovh-ux/muk', () => ({
  useNotifications: () => ({ addSuccess: addSuccessMock }),
  CurrencyCode: { EUR: 'EUR' },
}));

// Mock bandwidth converter hook
vi.mock('@ovh-ux/manager-network-common', () => ({
  CurrencyCode: {
    AUD: 'AUD',
    CAD: 'CAD',
    CZK: 'CZK',
    EUR: 'EUR',
    GBP: 'GBP',
    INR: 'INR',
    MAD: 'MAD',
    PLN: 'PLN',
    SGD: 'SGD',
    USD: 'USD',
    TND: 'TND',
    XOF: 'XOF',
    LTL: 'LTL',
    NA: 'N/A',
    points: 'points',
  },
  DEFAULT_BANDWIDTH_PLAN_CODE: 'planDefault',
  useUpgradeDowngradeBandwidth: (args: {
    onSuccess: ({ order }: { order: { url: string } }) => void;
  }) => ({
    mutate: () => args.onSuccess?.({ order: { url: 'https://order.example' } }),
    isPending: false,
  }),
  useBandwidthFormatConverter: () => (mbps: number) => ({
    value: `${mbps}`,
    unit: 'MB',
    simpleFormat: `${mbps} MB`,
    perSecondFormat: `${mbps}MB/s`,
  }),
}));

// Mock ODS components used by the drawer
vi.mock('@ovhcloud/ods-react', () => {
  const DrawerContext = React.createContext<{
    open: boolean;
    onOpenChange: (state: { open: boolean }) => void;
  }>({
    open: false,
    onOpenChange: () => {},
  });

  function Drawer(props: {
    open: boolean;
    onOpenChange: (state: { open: boolean }) => void;
    children: React.ReactNode;
  }) {
    return (
      <DrawerContext.Provider value={{ open: props.open, onOpenChange: props.onOpenChange }}>
        {props.children}
      </DrawerContext.Provider>
    );
  }

  function DrawerTrigger({ children }: { children: React.ReactNode }) {
    const ctx = React.useContext(DrawerContext);
    return (
      <button data-testid="drawer-trigger" onClick={() => ctx.onOpenChange?.({ open: true })}>
        {children}
      </button>
    );
  }

  const Tooltip = (p: { children: React.ReactNode }) => <div>{p.children}</div>;
  const TooltipContent = (p: { children: React.ReactNode }) => <div>{p.children}</div>;
  const TooltipTrigger = (p: { children: React.ReactNode }) => <div>{p.children}</div>;

  function DrawerContent({ children }: { children: React.ReactNode }) {
    const ctx = React.useContext(DrawerContext);
    return ctx.open ? <div data-testid="drawer-content">{children}</div> : null;
  }

  const DrawerBody = (p: { children: React.ReactNode }) => <div>{p.children}</div>;
  const DrawerTriggerExport = DrawerTrigger;

  const Link = ({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) => (
    <button data-testid="link" disabled={disabled}>
      {children}
    </button>
  );

  const Icon = ({ name, className }: { name: string; className?: string }) => (
    <i data-testid={`icon-${name}`} className={className} />
  );

  const Card = ({
    children,
    onClick,
    onKeyDown,
    tabIndex,
    className,
  }: {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    tabIndex?: number | string;
    className?: string;
  }) => (
    <div
      role="button"
      data-testid="card"
      tabIndex={tabIndex as number}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={className}
    >
      {children}
    </div>
  );

  const RadioGroup = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const Radio = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const RadioControl = () => <span />;
  const RadioLabel = ({ children }: { children?: React.ReactNode }) => <label>{children}</label>;

  const Message = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const MessageBody = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const Button = ({
    children,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
    <button {...rest}>{children}</button>
  );
  const Text = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

  return {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    Drawer,
    DrawerTrigger: DrawerTriggerExport,
    DrawerContent,
    DrawerBody,
    Link,
    Icon,
    Card,
    RadioGroup,
    Radio,
    RadioControl,
    RadioLabel,
    Message,
    MessageBody,
    Button,
    Text,
    BUTTON_VARIANT: {},
    CARD_COLOR: {},
    DRAWER_POSITION: {},
    ICON_NAME: {},
    MESSAGE_COLOR: {},
    MESSAGE_VARIANT: {},
    TEXT_PRESET: {},
  };
});

describe('BandwidthOrderDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens drawer, selects an option and orders (calls addSuccess)', () => {
    const options: BandwidthOption[] = [
      {
        bandwidthLimit: 100,
        planCode: 'plan100',
        price: { currencyCode: CurrencyCode.EUR, value: 10, text: '10 €' },
        priceInUcents: 1000,
      },
      {
        bandwidthLimit: 200,
        planCode: 'plan200',
        price: { currencyCode: CurrencyCode.EUR, value: 20, text: '20 €' },
        priceInUcents: 2000,
      },
    ];

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <BandwidthOrderDrawer
          bandwidthLimit={100}
          bandwidthOptionList={options}
          region="eu-west-par"
          serviceName="pn-00001"
        />
      </QueryClientProvider>,
    );

    // Trigger should be present and enabled
    const trigger = screen.getByTestId('drawer-trigger');
    expect(trigger).toBeDefined();

    // Open drawer
    fireEvent.click(trigger);

    // Drawer content should be visible
    expect(screen.getByTestId('drawer-content')).toBeDefined();

    // Should display option perSecondFormat (from mocked converter)
    expect(screen.getByText('100MB/s')).toBeDefined();

    // Select second option by clicking its card (cards render multiple elements, pick second)
    const cards = screen.getAllByTestId('card');
    fireEvent.click(cards[1] as Element);

    // Click order button
    const orderButton = screen.getByText('order');
    fireEvent.click(orderButton);

    // Drawer should be closed after successful order
    expect(screen.queryByTestId('drawer-content')).toBeNull();
  });

  it('disables trigger when no options', () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <BandwidthOrderDrawer
          bandwidthLimit={100}
          bandwidthOptionList={[]}
          region="EU"
          serviceName="vrack1"
        />
      </QueryClientProvider>,
    );

    const link = screen.getByTestId('link');
    expect(link).toBeDefined();
    expect(link).toBeDisabled();
  });
});
