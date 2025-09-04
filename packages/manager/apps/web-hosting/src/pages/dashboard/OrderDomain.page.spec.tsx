import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import OrderDomainModal from './OrderDomain.page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({ serviceName: 'serviceName' }),
  useNavigate: () => mockNavigate,
}));

vi.mock('@/constants', async (importActual) => {
  const actual = await importActual<typeof import('@/constants')>();
  return {
    ...actual,
    DOMAIN_ORDER_URL: {
      FR: {
        FR: 'https://order.example/fr',
        DE: 'https://order.example/de',
      },
    },
  };
});

describe('OrderDomainModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('display radio button and validate button is disabled', () => {
    const { container } = render(<OrderDomainModal />);

    const orderRadio = container.querySelector('ods-radio[value="ORDER"]');
    const attachRadio = container.querySelector('ods-radio[value="ATTACH"]');
    expect(orderRadio).not.toBeNull();
    expect(attachRadio).not.toBeNull();

    const primaryBtn = screen.getByTestId(
      'primary-button',
    ) as HTMLButtonElement;
    expect(primaryBtn.getAttribute('is-disabled')).toBe('true');
  });

  it('select ORDER : activate button and open order page and close modal', async () => {
    const { container } = render(<OrderDomainModal />);

    const primaryBtn = screen.getByTestId(
      'primary-button',
    ) as HTMLButtonElement;
    expect(primaryBtn.getAttribute('is-disabled')).toBe('true');

    const orderRadio = container.querySelector('ods-radio[value="ORDER"]');
    expect(orderRadio).not.toBeNull();

    fireEvent(
      orderRadio ??
        (() => {
          throw new Error('orderRadio not found');
        })(),
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    expect(primaryBtn.getAttribute('is-disabled')).toBe('false');

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    await fireEvent.click(primaryBtn);

    expect(openSpy.mock.calls.length).toBe(1);
    const [urlArg, targetArg] = openSpy.mock.calls[0];
    expect(urlArg).toBe('https://order.example/fr');
    expect(targetArg).toBe('_blank');

    expect(mockNavigate.mock.calls.length).toBeGreaterThan(0);
  });

  it('select ATTACH : activate validate button and navigate to addDomain', async () => {
    const { container } = render(<OrderDomainModal />);

    const primaryBtn = screen.getByTestId(
      'primary-button',
    ) as HTMLButtonElement;
    const attachRadio = container.querySelector('ods-radio[value="ATTACH"]');

    fireEvent(
      attachRadio ??
        (() => {
          throw new Error('orderRadio not found');
        })(),
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );
    expect(primaryBtn.getAttribute('is-disabled')).toBe('false');

    await fireEvent.click(primaryBtn);

    expect(mockNavigate.mock.calls.length).toBe(1);
    const [pathArg] = mockNavigate.mock.calls[0];
    expect(pathArg).toBe('/serviceName/add-domain');
  });

  it('cancel button close modal', async () => {
    render(<OrderDomainModal />);

    await fireEvent.click(screen.getByTestId('secondary-button'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
