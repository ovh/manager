import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import OrderPrice from '@/components/order/price/OrderPrice.component';
import { mockedAvailabilitiesFlavorBis } from '@/__tests__/helpers/mocks/updateMock';
import { mockedServicePrice } from '@/__tests__/helpers/mocks/servicePrice';
import * as database from '@/types/cloud/project/database';
import { ServicePricing } from '@/lib/pricingHelper';

describe('OrderPrice component', () => {
  beforeEach(() => {
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string, options: Record<string, string | number>): string => {
          return `${key} ${options?.price}`;
        },
      }),
      Trans: ({ children }: { children: React.ReactNode }) => children,
    }));
    vi.mock('@/hooks/api/catalog/useGetCatalog.hook', () => {
      return {
        useGetCatalog: vi.fn(() => ({
          isSuccess: true,
          data: {
            locale: {
              currencyCode: 'EUR',
            },
          },
        })),
      };
    });
    vi.mock('@/hooks/useLocale', () => {
      return {
        useLocale: vi.fn(() => 'fr_FR'),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display Price component', async () => {
    render(
      <OrderPrice
        prices={mockedServicePrice}
        availability={mockedAvailabilitiesFlavorBis}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('order-price-container')).toBeInTheDocument();
    });
  });
  it('should display Price component with montly values', async () => {
    render(
      <OrderPrice
        availability={mockedAvailabilitiesFlavorBis}
        prices={mockedServicePrice}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('order-price-container')).toBeInTheDocument();
      expect(screen.getByText('pricing_ht 10 €')).toBeInTheDocument();
      expect(screen.getByText('(pricing_ttc 20 €)')).toBeInTheDocument();
    });
  });

  it('should display Price component with FreeBetaInfo', async () => {
    const betaAvailabity: database.Availability = {
      ...mockedAvailabilitiesFlavorBis,
      lifecycle: {
        ...mockedAvailabilitiesFlavorBis.lifecycle,
        status: database.availability.StatusEnum.BETA,
      },
    };
    const servicePricing: ServicePricing = {
      ...mockedServicePrice,
      servicePrice: {
        ...mockedServicePrice.servicePrice,
        hourly: {
          price: 0,
          tax: 0,
        },
      },
    };
    render(
      <OrderPrice prices={servicePricing} availability={betaAvailabity} />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('free-beta-container')).toBeInTheDocument();
    });
  });
});
