import { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { BAREMETAL_MOCK } from '@ovh-ux/backup-agent/mocks/baremetals/baremetals.mocks';

import OnboardingPage from './Onboarding.page';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, opts?: Record<string, unknown>) =>
      // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
      `${k}${opts?.productName ? `:${opts.productName}` : ''}`,
  }),
}));

const { useBaremetalsListMock } = vi.hoisted(() => ({
  useBaremetalsListMock: vi
    .fn()
    .mockReturnValue({ data: undefined, isLoading: true, isError: false }),
}));

vi.mock('@ovh-ux/backup-agent/data/hooks/baremetal/useBaremetalsList', () => {
  return {
    useBaremetalsList: useBaremetalsListMock,
  };
});

// --- Mock manager-react-components ---
interface OnboardingLayoutProps {
  title: string;
  img?: { src: string; alt: string };
  description: ReactNode;
  orderButtonLabel: string;
  children?: ReactNode;
  isOrderDisabled: boolean;
  tooltipContent: string;
}

interface CardProps {
  href: string;
  texts: { title: string; description: string; category: string };
  hrefLabel: string;
}

vi.mock('@/components/onboarding/onboardingLayout/OnboardingLayout.component', () => ({
  OnboardingLayout: ({
    title,
    img,
    description,
    orderButtonLabel,
    children,
    isOrderDisabled,
    tooltipContent,
  }: OnboardingLayoutProps) => (
    <div>
      <h1 data-testid="title">{title}</h1>
      {img && <img data-testid="hero" src={img.src} alt={img.alt} />}
      <div data-testid="description">{description}</div>
      <button data-testid="order" data-disabled={isOrderDisabled}>
        {orderButtonLabel}
      </button>
      <div data-testid="cards">{children}</div>
      {tooltipContent && <span>{tooltipContent}</span>}
    </div>
  ),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  Card: ({ href, texts, hrefLabel }: CardProps) => (
    <a data-testid="card" href={href}>
      <h2>{texts.title}</h2>
      <p>{texts.description}</p>
      <span>{texts.category}</span>
      <span>{hrefLabel}</span>
    </a>
  ),
}));

// --- Mock hooks ---
vi.mock('@/hooks/onboarding/useOnboardingData', () => ({
  useOnboardingContent: () => ({
    productName: 'TestProduct',
    productCategory: 'Category',
    brand: 'BrandX',
    title: 'Welcome!',
    heroImage: { src: '/hero.png', alt: 'Hero alt' },
    tiles: [
      { id: '1', key: 'discover', linkKey: 'discover' },
      { id: '2', key: 'faq', linkKey: 'faq' },
    ],
  }),
}));

vi.mock('@ovh-ux/backup-agent/hooks/useGuideUtils.ts', () => ({
  useGuideUtils: () => ({
    main: '/backup-agent-guides',
    discover: '/discover-link',
    tutorial: '', // missing to test filtering
    faq: '/faq-link',
  }),
}));

describe('FirstOrderPage', () => {
  it('renders title, description, and order button', () => {
    render(<OnboardingPage />);
    expect(screen.getByTestId('title')).toHaveTextContent('Welcome!');
    expect(screen.getByTestId('description')).toBeInTheDocument();
    expect(screen.getByTestId('order')).toBeInTheDocument();
  });

  it('renders hero image with alt text', () => {
    render(<OnboardingPage />);
    const img = screen.getByTestId('hero');
    expect(img).toHaveAttribute('src', '/hero.png');
    expect(img).toHaveAttribute('alt', 'Hero alt');
  });

  it('renders only cards with valid links', () => {
    render(<OnboardingPage />);
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2); // discover + faq, tutorial skipped
    expect(cards[0]).toHaveAttribute('href', '/discover-link');
    expect(cards[1]).toHaveAttribute('href', '/faq-link');
  });

  it.each([
    [BAREMETAL_MOCK, false],
    [[], true],
  ])(
    'renders onboarding and expected disabled if no baremetal : $expectedDisabled',
    async (mock, expectedDisabled) => {
      useBaremetalsListMock.mockReturnValue({
        flattenData: mock,
        isLoading: false,
        isError: false,
      });

      render(<OnboardingPage />);

      await waitFor(
        () =>
          expect(screen.getByTestId('order')).toHaveAttribute(
            'data-disabled',
            `${expectedDisabled}`,
          ),
        { timeout: 1000 },
      );
    },
  );
});
