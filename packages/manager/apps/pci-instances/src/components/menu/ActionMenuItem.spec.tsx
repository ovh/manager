import { describe, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { useHref } from 'react-router-dom';
import { ActionMenuItem } from './ActionMenuItem.component';

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
}));

describe('Considering the ActionsMenu components', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('target', () => {
    it('should render a menu item without a target', () => {
      const label = 'Item 1';
      const link = { path: '/item1', isExternal: false };

      const { getByText } = render(
        <ActionMenuItem label={label} link={link} />,
      );

      const linkElement = getByText(label);
      expect(linkElement).toBeVisible();
      expect(linkElement).not.toHaveAttribute('target');
    });

    it('should render a menu item with a target blank link', () => {
      const label = 'Item 2';
      const link = { path: '/item2', isExternal: true, isTargetBlank: true };

      const { getByText } = render(
        <ActionMenuItem label={label} link={link} />,
      );

      const linkElement = getByText(label);
      expect(linkElement).toBeVisible();
      expect(linkElement).toHaveAttribute('target', '_blank');
    });
  });

  describe('external link', () => {
    it('should be relative path if link is not external', () => {
      vi.resetAllMocks();
      vi.mocked(useHref).mockReturnValue('relativePath');
      const label = 'Item 2';
      const link = { path: '/item2', isExternal: false };

      const { getByText } = render(
        <ActionMenuItem label={label} link={link} />,
      );

      const linkElement = getByText(label);
      expect(linkElement).toHaveAttribute('href', 'relativePath');
      expect(useHref).toHaveBeenCalledWith('/item2');
    });

    it('should full path if link is external', () => {
      vi.resetAllMocks();
      const label = 'Item 2';
      const link = { path: 'https://site', isExternal: true };

      const { getByText } = render(
        <ActionMenuItem label={label} link={link} />,
      );

      const linkElement = getByText(label);
      expect(linkElement).toHaveAttribute('href', 'https://site');
    });
  });
});
