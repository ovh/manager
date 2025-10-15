import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { navigate } from '@/utils/test.setup';

import OrderDomainModal from './OrderDomain.page';

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

    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn.getAttribute('is-disabled')).toBe('true');
  });

  it('select ORDER : activate button and open order page and close modal', () => {
    const { container } = render(<OrderDomainModal />);

    const primaryBtn = screen.getByTestId('primary-button');
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

    fireEvent.click(primaryBtn);

    expect(openSpy.mock.calls.length).toBe(1);
    const [urlArg, targetArg] = openSpy.mock.calls[0];
    expect(urlArg).toBe('https://order.example/fr');
    expect(targetArg).toBe('_blank');

    expect(navigate.mock.calls.length).toBeGreaterThan(0);
  });

  it('select ATTACH : activate validate button and navigate to addDomain', () => {
    const { container } = render(<OrderDomainModal />);

    const primaryBtn = screen.getByTestId('primary-button');
    const attachRadio = container.querySelector('ods-radio[value="ATTACH"]');

    fireEvent(
      attachRadio ??
        (() => {
          throw new Error('orderRadio not found');
        })(),
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );
    expect(primaryBtn.getAttribute('is-disabled')).toBe('false');

    fireEvent.click(primaryBtn);

    expect(navigate.mock.calls.length).toBe(1);
    const mocks = navigate.mock.calls[0];
    expect(mocks[0]).toBe('/serviceName/add-domain');
  });

  it('cancel button close modal', () => {
    render(<OrderDomainModal />);

    fireEvent.click(screen.getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
});
