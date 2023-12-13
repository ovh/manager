import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ScTile, ScTileProps } from './tile';
import { defaultProps } from './tile.stories';
import { render, waitFor } from '../../utils/test.provider';

const setupSpecTest = async (customProps?: Partial<ScTileProps>) =>
  await waitFor(() => render(<ScTile {...defaultProps} {...customProps} />));

describe('specs:msc-tile', () => {
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
