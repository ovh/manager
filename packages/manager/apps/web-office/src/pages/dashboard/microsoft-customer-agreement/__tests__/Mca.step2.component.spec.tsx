import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import dashboardMcaTranslations from '@/public/translations/dashboard/microsoft-customer-agreement/Messages_fr_FR.json';
import { renderWithRouter } from '@/utils/Test.provider';

import McaStep2 from '../McaStep2.component';

const defaultProps = {
  microsoftUrl: '',
  onClick: vi.fn(),
  isLoading: false,
};

describe('McaStep2 Component', () => {
  it('render test', () => {
    renderWithRouter(<McaStep2 {...defaultProps} />);

    expect(
      screen.getByText(dashboardMcaTranslations.signatory_step2_description),
    ).toBeInTheDocument();
  });
});

describe('McaStep2 W3C Validation', () => {
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<McaStep2 {...defaultProps} />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
