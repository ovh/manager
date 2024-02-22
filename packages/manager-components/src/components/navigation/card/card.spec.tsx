import { waitFor } from '@testing-library/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Card, CardProps } from './card.component';
import { defaultProps } from './card.stories';
import { render } from '../../../utils/test.provider';

const setupSpecTest = async (customProps?: Partial<CardProps>) =>
  waitFor(() => render(<Card {...defaultProps} {...customProps} />));

describe('specs:Card', () => {
  it('renders without error', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText('Titre du produit');

    expect(title).not.toBeNull();
  });

  describe('contents', () => {
    it('should have a badges if provided', async () => {
      const screen = await setupSpecTest({
        badges: [{ text: 'Beta', color: ODS_THEME_COLOR_INTENT.primary }],
      });
      expect(screen.getByText('Beta')).toBeTruthy();
    });
  });
});
