import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ScTile, ScTileProps } from './tile';
import { defaultProps } from './tile.stories';
import { render } from '@testing-library/react';

const setupSpecTest = (customProps?: Partial<ScTileProps>) =>
  render(<ScTile {...defaultProps} {...customProps} />);

describe('specs:msc-tile', () => {
  it('renders without error', async () => {
    const screen = setupSpecTest();
    const title = screen.getByText('Titre du produit');

    expect(title).not.toBeNull();
  });

  describe('contents', () => {
    it('should have a badges if provided', async () => {
      const screen = setupSpecTest({
        badges: [{ text: 'Beta', color: ODS_THEME_COLOR_INTENT.primary }],
      });
      expect(screen.getByText('Beta')).toBeTruthy();
    });
  });
});
