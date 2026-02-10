import { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { beforeAll, vi } from 'vitest';

import { BAREMETALS_MOCK } from '@ovh-ux/backup-agent/mocks/baremetals/baremetals.mocks';
import { mockVaults } from '@ovh-ux/backup-agent/mocks/vaults/vaults.mock';

import OnboardingPage from './Onboarding.page';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn().mockReturnValue([{ get: vi.fn() }]),
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

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn().mockReturnValue({ data: undefined, isPending: false, isError: false }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: useQueryMock,
  useQueryClient: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  ...(await vi.importActual('@ovh-ux/manager-react-shell-client')),
  useNavigationGetUrl: vi.fn().mockReturnValue({ isPending: false, data: '' }),
  useOvhTracking: vi.fn().mockReturnValue({
    trackClick: vi.fn(),
    trackCurrentPage: vi.fn(),
    trackPage: vi.fn(),
  }),
}));

vi.mock('@ovh-ux/backup-agent/data/queries/baremetals.queries', () => ({
  baremetalsQueries: { all: vi.fn() },
}));

vi.mock('@ovh-ux/backup-agent/data/queries/vaults.queries', () => ({
  vaultsQueries: { withClient: vi.fn().mockReturnValue({ list: vi.fn() }) },
}));

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
  RedirectionGuard: ({ children }: { children: ReactNode }) => children,
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
  beforeAll(() => {
    // useQuery is called twice: 1st for baremetals, 2nd for vaults
    useQueryMock.mockReturnValue({
      data: mockVaults,
      isPending: false,
      isError: false,
    });
  });

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
    [BAREMETALS_MOCK, false],
    [[], true],
  ])(
    'renders onboarding and expected disabled if no baremetal : $expectedDisabled',
    async (mock, expectedDisabled) => {
      // useQuery is called twice: 1st for baremetals, 2nd for vaults
      useQueryMock
        .mockReturnValueOnce({
          data: mock,
          isPending: false,
          isError: false,
        })
        .mockReturnValueOnce({
          data: undefined,
          isPending: false,
          isError: true,
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
