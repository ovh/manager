import { waitFor } from '@testing-library/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
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

    it('should have design system correctly set for texts', async () => {
      // given
      const cardProps: Partial<CardProps> = {
        texts: {
          title: 'my title',
          description: 'my decription',
          category: 'my category',
        },
      };

      // when
      const { getByText } = await setupSpecTest(cardProps);

      // then
      const titleElement = getByText(cardProps.texts.title);
      expect(titleElement).toHaveAttribute('level', ODS_TEXT_LEVEL.heading);
      expect(titleElement).toHaveAttribute('size', ODS_TEXT_SIZE._500);
      expect(titleElement).toHaveAttribute(
        'color',
        ODS_THEME_COLOR_INTENT.primary,
      );
      expect(titleElement).toHaveAttribute('hue', ODS_THEME_COLOR_HUE._800);

      // and
      const descElement = getByText(cardProps.texts.description);
      expect(descElement).toHaveAttribute('level', ODS_TEXT_LEVEL.body);
      expect(descElement).toHaveAttribute('size', ODS_TEXT_SIZE._400);
      expect(descElement).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.text);
      expect(descElement).toHaveAttribute('hue', ODS_THEME_COLOR_HUE._500);

      // and
      const catElement = getByText(cardProps.texts.category);
      expect(catElement).toHaveAttribute('level', ODS_TEXT_LEVEL.heading);
      expect(catElement).toHaveAttribute('size', ODS_TEXT_SIZE._400);
      expect(catElement).toHaveAttribute(
        'color',
        ODS_THEME_COLOR_INTENT.primary,
      );
      expect(catElement).toHaveAttribute('hue', ODS_THEME_COLOR_HUE._500);

      // and
      expect(getByText('En savoir plus')).toBeDefined();
    });

    it('should override href label', async () => {
      // given
      const cardProps: Partial<CardProps> = {
        texts: {
          title: 'my title',
          description: 'my decription',
          category: 'my category',
        },
        hrefLabel: 'custom label',
      };

      // when
      const { getByText } = await setupSpecTest(cardProps);

      // then
      expect(getByText('custom label')).toBeDefined();
    });
  });
});
