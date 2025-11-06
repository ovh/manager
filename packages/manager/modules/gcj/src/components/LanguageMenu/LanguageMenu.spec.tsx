import React from 'react';
import { it, vi, describe, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { LanguageMenu, Props } from './LanguageMenu';

// Mock the dependencies
vi.mock('react-responsive');
vi.mock('../../constants/constants', () => ({
  SMALL_DEVICE_MAX_SIZE: '30em',
}));
vi.mock('@ovh-ux/manager-config', () => ({
  LANGUAGES: {
    available: [
      { name: 'English', key: 'en_GB' },
      { name: 'Français', key: 'fr_FR' },
      { name: 'Deutsch', key: 'de_DE' },
    ],
  },
}));

vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BUTTON_VARIANT: {
    ghost: 'ghost',
  },
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  ActionMenu: ({ items, label, variant, id }: any) => (
    <div data-testid="action-menu" data-id={id} data-variant={variant}>
      <button data-testid="language-button">{label}</button>
      <ul role="menu">
        {items.map((item: any, index: number) => (
          <li key={item.id || index} role="menuitem">
            <button
              data-testid={`menu-item-${item.label}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

// Add CSS escape polyfill for JSDOM
if (typeof window !== 'undefined') {
  if (!window.CSS) {
    (window as any).CSS = {};
  }
  if (!window.CSS.escape) {
    window.CSS.escape = (string: string) => {
      return string.replace(/([^a-zA-Z0-9])/g, '\\$1');
    };
  }
}

const mockOnLocalUpdate = vi.fn();

const defaultProps: Props = {
  onLocalUpdate: mockOnLocalUpdate,
  initialLocal: 'en_GB',
};

describe('LanguageMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMediaQuery).mockReturnValue(false); // Default to regular device
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (props: Partial<Props> = {}) => {
    return render(<LanguageMenu {...defaultProps} {...props} />);
  };

  it('should render correctly', () => {
    renderComponent();
    expect(screen.getByTestId('action-menu')).toBeDefined();
  });

  it('should display full language name on regular devices', () => {
    vi.mocked(useMediaQuery).mockReturnValue(false);
    renderComponent();

    const button = screen.getByTestId('language-button');
    expect(button.textContent).toBe('English');
  });

  it('should display short language code on small devices', () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);
    renderComponent({ initialLocal: 'en_GB' });

    const button = screen.getByTestId('language-button');
    expect(button.textContent).toBe('GB');
  });

  it('should filter out current locale from available languages', () => {
    renderComponent({ initialLocal: 'en_GB' });

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0].textContent).toBe('Français');
    expect(menuItems[1].textContent).toBe('Deutsch');
  });

  it('should call onLocalUpdate when a language is selected', () => {
    renderComponent({ initialLocal: 'en_GB' });

    const frenchMenuItem = screen.getByTestId('menu-item-Français');
    fireEvent.click(frenchMenuItem);

    expect(mockOnLocalUpdate).toHaveBeenCalledWith('fr_FR');
    expect(mockOnLocalUpdate).toHaveBeenCalledTimes(1);
  });

  it('should handle language selection correctly', () => {
    const { rerender } = renderComponent({ initialLocal: 'en_GB' });

    expect(screen.getByTestId('language-button').textContent).toBe('English');
    let menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);

    // Select French
    const frenchMenuItem = screen.getByTestId('menu-item-Français');
    fireEvent.click(frenchMenuItem);

    // Verify callback was called
    expect(mockOnLocalUpdate).toHaveBeenCalledWith('fr_FR');

    // Simulate the parent component updating the initialLocal prop after selection
    rerender(
      <LanguageMenu onLocalUpdate={mockOnLocalUpdate} initialLocal="fr_FR" />,
    );

    // Verify UI updated
    expect(screen.getByTestId('language-button').textContent).toBe('Français');

    // Now menu should show English and German (excluding French)
    menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0].textContent).toBe('English');
    expect(menuItems[1].textContent).toBe('Deutsch');
  });
});
