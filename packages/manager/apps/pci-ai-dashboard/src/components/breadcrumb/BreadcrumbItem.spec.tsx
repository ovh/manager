import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import BreadcrumbItem from './BreadcrumbItem.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('BreadcrumbItem component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the breadcrumb item component', async () => {
    const translationKey = 'testKey';
    render(
      <BreadcrumbItem translationKey={translationKey} namespace="namespace" />,
    );
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });
});
