/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createWrapper } from '@/wrapperRenders';
import IncreaseQuota from './IncreaseQuota';
import { SUPPORT_URL } from '@/constants';

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true,
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('IncreaseQuota', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<IncreaseQuota />, { wrapper: createWrapper() });
  };

  it('should render the modal with correct props', () => {
    renderComponent();

    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('data-isopen', 'true');
    expect(modal).toHaveAttribute('color', 'critical');
  });

  it('should display the correct Modal content message', () => {
    renderComponent();

    const contentMessage = screen.getByText(
      'pci_project_new_error_ask_increase_projects_quota',
    );
    expect(contentMessage).toBeInTheDocument();
  });

  it('should render primary button with correct label', () => {
    renderComponent();

    const primaryButton = screen.getByTestId('primary-button');
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).toHaveAttribute(
      'label',
      'pci_project_new_error_contact_support',
    );
  });

  it('should render secondary button with correct label', () => {
    renderComponent();

    const secondaryButton = screen.getByTestId('secondary-button');
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveAttribute(
      'label',
      'pci_project_new_error_cancel',
    );
  });

  it('should call navigate with ".." when close button is clicked', () => {
    renderComponent();

    const closeButton = screen.getByTestId('secondary-button');
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should use correct subsidiary in support URL', () => {
    const customShellContext = {
      environment: {
        getUser: () => ({ ovhSubsidiary: 'US' }),
        getRegion: () => 'US',
      },
      shell: {
        navigation: {
          navigateTo: vi.fn(),
          getURL: vi.fn(),
        },
      },
    };

    const CustomWrapper = createWrapper(customShellContext as any);
    render(<IncreaseQuota />, { wrapper: CustomWrapper });

    const contactSupportButton = screen.getByTestId('primary-button');
    fireEvent.click(contactSupportButton);

    expect(mockOpen).toHaveBeenCalledWith(`${SUPPORT_URL}US`, '_blank');
  });

  it('should have modal open by default', () => {
    renderComponent();

    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('data-isopen', 'true');
  });

  it('should handle multiple close actions correctly', () => {
    renderComponent();

    const closeButton = screen.getByTestId('secondary-button');
    fireEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('..');

    vi.clearAllMocks();

    const contactSupportButton = screen.getByTestId('primary-button');
    fireEvent.click(contactSupportButton);
    expect(mockOpen).toHaveBeenCalledWith(`${SUPPORT_URL}FR`, '_blank');
  });

  it('should have proper modal attributes', () => {
    renderComponent();

    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('data-isdismissible', 'true');
    expect(modal).toHaveAttribute('data-isopen', 'true');
  });

  it('should have proper button attributes', () => {
    renderComponent();

    const primaryButton = screen.getByTestId('primary-button');
    const secondaryButton = screen.getByTestId('secondary-button');

    expect(primaryButton).toBeInTheDocument();
    expect(secondaryButton).toBeInTheDocument();
    expect(primaryButton).toHaveAttribute(
      'label',
      'pci_project_new_error_contact_support',
    );
    expect(secondaryButton).toHaveAttribute(
      'label',
      'pci_project_new_error_cancel',
    );
  });
});
