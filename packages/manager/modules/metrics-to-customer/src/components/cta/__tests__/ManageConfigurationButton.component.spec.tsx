import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import ManageConfigurationButton from '@/components/cta/ManageConfigurationButton.component';
import { ManageConfigurationButtonProps } from '@/components/cta/ManageConfigurationButton.props';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @ovhcloud/ods-react
vi.mock('@ovhcloud/ods-react', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button data-testid="manage-configuration-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  BUTTON_VARIANT: { default: 'default' },
}));

describe('ManageConfigurationButton', () => {
  const defaultProps: ManageConfigurationButtonProps = {
    configUrl: '/configuration',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render button with correct text', () => {
      // Act
      render(<ManageConfigurationButton {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('manage-configuration-button')).toBeInTheDocument();
      expect(screen.getByText('manage_configuration_button')).toBeInTheDocument();
    });

    it('should render button with default variant', () => {
      // Act
      render(<ManageConfigurationButton {...defaultProps} />);

      // Assert
      const button = screen.getByTestId('manage-configuration-button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to configUrl when button is clicked', () => {
      // Act
      render(<ManageConfigurationButton {...defaultProps} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/configuration');
    });

    it('should navigate to different configUrl when provided', () => {
      // Arrange
      const propsWithDifferentUrl = {
        configUrl: '/settings/advanced',
      };

      // Act
      render(<ManageConfigurationButton {...propsWithDifferentUrl} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/settings/advanced');
    });

    it('should navigate to root path when configUrl is "/"', () => {
      // Arrange
      const propsWithRootUrl = {
        configUrl: '/',
      };

      // Act
      render(<ManageConfigurationButton {...propsWithRootUrl} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to nested path when configUrl is nested', () => {
      // Arrange
      const propsWithNestedUrl = {
        configUrl: '/settings/configuration/advanced',
      };

      // Act
      render(<ManageConfigurationButton {...propsWithNestedUrl} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/settings/configuration/advanced');
    });
  });

  describe('Button Interactions', () => {
    it('should be clickable', () => {
      // Act
      render(<ManageConfigurationButton {...defaultProps} />);

      const button = screen.getByTestId('manage-configuration-button');
      
      // Assert
      expect(button).not.toBeDisabled();
    });

    it('should call navigate on each click', () => {
      // Act
      render(<ManageConfigurationButton {...defaultProps} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('/configuration');
    });
  });

  describe('Translation', () => {
    it('should use correct translation key', () => {
      // Act
      render(<ManageConfigurationButton {...defaultProps} />);

      // Assert
      expect(screen.getByText('manage_configuration_button')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty configUrl', () => {
      // Arrange
      const propsWithEmptyUrl = {
        configUrl: '',
      };

      // Act
      render(<ManageConfigurationButton {...propsWithEmptyUrl} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('');
    });

    it('should handle configUrl with query parameters', () => {
      // Arrange
      const propsWithQueryParams = {
        configUrl: '/configuration?tab=advanced&mode=edit',
      };

      // Act
      render(<ManageConfigurationButton {...propsWithQueryParams} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/configuration?tab=advanced&mode=edit');
    });

    it('should handle configUrl with hash', () => {
      // Arrange
      const propsWithHash = {
        configUrl: '/configuration#section-1',
      };

      // Act
      render(<ManageConfigurationButton {...propsWithHash} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/configuration#section-1');
    });

    it('should handle relative paths', () => {
      // Arrange
      const propsWithRelativePath = {
        configUrl: '../settings',
      };

      // Act
      render(<ManageConfigurationButton {...propsWithRelativePath} />);

      const button = screen.getByTestId('manage-configuration-button');
      fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('../settings');
    });
  });
});

