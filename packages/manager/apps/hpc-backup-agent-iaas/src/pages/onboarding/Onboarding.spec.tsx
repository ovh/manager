import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import OnboardingPage from './Onboarding.page';

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, opts?: Record<string, unknown>) =>
      // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
      `${k}${opts?.productName ? `:${opts.productName}` : ''}`,
  }),
}));

// --- Mock manager-react-components ---
interface OnboardingLayoutProps {
  title: string;
  img?: { src: string; alt: string };
  description: ReactNode;
  orderButtonLabel: string;
  children?: ReactNode;
}

interface CardProps {
  href: string;
  texts: { title: string; description: string; category: string };
  hrefLabel: string;
}

vi.mock('@ovh-ux/manager-react-components', () => ({
  OnboardingLayout: ({
    title,
    img,
    description,
    orderButtonLabel,
    children,
  }: OnboardingLayoutProps) => (
    <div>
      <h1 data-testid="title">{title}</h1>
      {img && <img data-testid="hero" src={img.src} alt={img.alt} />}
      <div data-testid="description">{description}</div>
      <button data-testid="order">{orderButtonLabel}</button>
      <div data-testid="cards">{children}</div>
    </div>
  ),
  // eslint-disable-next-line react/no-multi-comp
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
  useGuideLinks: () => ({
    discover: '/discover-link',
    tutorial: '', // missing to test filtering
    faq: '/faq-link',
  }),
}));

describe('OnboardingPage', () => {
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
});
