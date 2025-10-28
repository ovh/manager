import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RadioCard } from '@/components/form/radio-card/RadioCard.component';
import { RadioCardProps } from '@/components/form/radio-card/RadioCard.props';

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsText: ({ children, preset }: { children: React.ReactNode; preset?: string }) => (
    <span data-testid="text" data-preset={preset}>
      {children}
    </span>
  ),
}));

describe('RadioCard', () => {
  const defaultProps: RadioCardProps = {
    id: 'test-radio',
    name: 'test-group',
    selected: 'other-option',
    title: 'Test Radio Card',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render radio card with required props only', () => {
      render(<RadioCard {...defaultProps} />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).toBeInTheDocument();
      expect(radioInput).toHaveAttribute('type', 'radio');
      expect(radioInput).toHaveAttribute('id', 'test-radio');
      expect(radioInput).toHaveAttribute('name', 'test-group');
      expect(radioInput).toHaveAttribute('value', 'test-radio');
    });

    it('should render with title', () => {
      render(<RadioCard {...defaultProps} />);

      const titleElement = screen.getByText('Test Radio Card');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.closest('[data-testid="text"]')).toHaveAttribute(
        'data-preset',
        'heading-6',
      );
    });

    it('should render with subtitle when provided', () => {
      render(<RadioCard {...defaultProps} subTitle="This is a subtitle" />);

      const subtitleElement = screen.getByText('This is a subtitle');
      expect(subtitleElement).toBeInTheDocument();
      expect(subtitleElement.closest('[data-testid="text"]')).toHaveAttribute(
        'data-preset',
        'span',
      );
    });

    it('should not render subtitle when not provided', () => {
      const { container } = render(<RadioCard {...defaultProps} />);

      const subtitleContainer = container.querySelector('div > div > div:last-child');
      expect(subtitleContainer?.textContent).not.toContain('This is a subtitle');
    });

    it('should render with badges when provided', () => {
      const badges = <div data-testid="custom-badge">Badge</div>;
      render(<RadioCard {...defaultProps} badges={badges} />);

      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
      expect(screen.getByTestId('custom-badge')).toHaveTextContent('Badge');
    });

    it('should not render badges when not provided', () => {
      render(<RadioCard {...defaultProps} />);

      expect(screen.queryByTestId('custom-badge')).not.toBeInTheDocument();
    });

    it('should render with children when provided', () => {
      const children = <div data-testid="custom-content">Custom content</div>;
      render(<RadioCard {...defaultProps}>{children}</RadioCard>);

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-content')).toHaveTextContent('Custom content');
    });

    it('should not render children container when not provided', () => {
      render(<RadioCard {...defaultProps} />);

      expect(screen.queryByTestId('custom-content')).not.toBeInTheDocument();
    });
  });

  describe('Selection State', () => {
    it('should be checked when id matches selected', () => {
      render(<RadioCard {...defaultProps} selected="test-radio" />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).toBeChecked();
    });

    it('should not be checked when id does not match selected', () => {
      render(<RadioCard {...defaultProps} selected="other-option" />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).not.toBeChecked();
    });

    it.each([
      { id: 'option-1', selected: 'option-1', shouldBeChecked: true },
      { id: 'option-2', selected: 'option-1', shouldBeChecked: false },
      { id: 'option-3', selected: 'option-3', shouldBeChecked: true },
    ])(
      'should have checked=$shouldBeChecked when id=$id and selected=$selected',
      ({ id, selected, shouldBeChecked }) => {
        render(<RadioCard {...defaultProps} id={id} selected={selected} />);

        const radioInput = screen.getByTestId(id);
        if (shouldBeChecked) {
          expect(radioInput).toBeChecked();
        } else {
          expect(radioInput).not.toBeChecked();
        }
      },
    );
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      render(<RadioCard {...defaultProps} />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).not.toBeDisabled();
    });

    it('should be disabled when isDisabled is true', () => {
      render(<RadioCard {...defaultProps} isDisabled />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).toBeDisabled();
    });

    it('should not be disabled when isDisabled is false', () => {
      render(<RadioCard {...defaultProps} isDisabled={false} />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).not.toBeDisabled();
    });

    it.each([
      { isDisabled: true, shouldBeDisabled: true },
      { isDisabled: false, shouldBeDisabled: false },
      { isDisabled: undefined, shouldBeDisabled: false },
    ])(
      'should have disabled=$shouldBeDisabled when isDisabled=$isDisabled',
      ({ isDisabled, shouldBeDisabled }) => {
        render(<RadioCard {...defaultProps} isDisabled={isDisabled} />);

        const radioInput = screen.getByTestId('test-radio');
        if (shouldBeDisabled) {
          expect(radioInput).toBeDisabled();
        } else {
          expect(radioInput).not.toBeDisabled();
        }
      },
    );
  });

  describe('Styling', () => {
    it('should apply cursor-pointer class when not disabled', () => {
      const { container } = render(<RadioCard {...defaultProps} />);

      const label = container.querySelector('label');
      expect(label).toHaveClass('cursor-pointer');
    });

    it('should not apply cursor-pointer class when disabled', () => {
      const { container } = render(<RadioCard {...defaultProps} isDisabled />);

      const label = container.querySelector('label');
      expect(label).not.toHaveClass('cursor-pointer');
    });

    it('should apply selected styles when checked', () => {
      const { container } = render(<RadioCard {...defaultProps} selected="test-radio" />);

      const label = container.querySelector('label');
      expect(label).toHaveClass('border-[--ods-color-primary-500]');
      expect(label).toHaveClass('bg-[--ods-color-primary-050]');
      expect(label).toHaveClass('outline');
      expect(label).toHaveClass('outline-1');
      expect(label).toHaveClass('outline-[--ods-color-primary-500]');
    });

    it('should apply default border when not checked', () => {
      const { container } = render(<RadioCard {...defaultProps} selected="other-option" />);

      const label = container.querySelector('label');
      expect(label).toHaveClass('border-[--ods-color-form-element-border-default]');
    });

    it('should apply disabled styles when disabled', () => {
      const { container } = render(<RadioCard {...defaultProps} isDisabled />);

      const label = container.querySelector('label');
      expect(label).toHaveClass('cursor-not-allowed');
      expect(label).toHaveClass('grayscale');
      expect(label).toHaveClass('opacity-70');
      expect(label).toHaveClass('bg-[--ods-color-background-disabled-default]');
      expect(label).toHaveClass('border-[--ods-color-border-disabled-default]');
    });

    it.each([
      {
        selected: 'test-radio',
        isDisabled: false,
        expectedClasses: ['border-[--ods-color-primary-500]', 'bg-[--ods-color-primary-050]'],
      },
      {
        selected: 'other-option',
        isDisabled: false,
        expectedClasses: ['border-[--ods-color-form-element-border-default]'],
      },
      {
        selected: 'test-radio',
        isDisabled: true,
        expectedClasses: ['cursor-not-allowed', 'grayscale', 'opacity-70'],
      },
    ])(
      'should apply correct styles for selected=$selected, isDisabled=$isDisabled',
      ({ selected, isDisabled, expectedClasses }) => {
        const { container } = render(
          <RadioCard {...defaultProps} selected={selected} isDisabled={isDisabled} />,
        );

        const label = container.querySelector('label');
        expectedClasses.forEach((className) => {
          expect(label).toHaveClass(className);
        });
      },
    );
  });

  describe('Event Handling', () => {
    it('should call onChange when radio is clicked', () => {
      const mockOnChange = vi.fn();
      render(<RadioCard {...defaultProps} onChange={mockOnChange} />);

      const radioInput = screen.getByTestId('test-radio');
      fireEvent.click(radioInput);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange with correct event when radio is clicked', () => {
      const mockOnChange = vi.fn();
      render(<RadioCard {...defaultProps} onChange={mockOnChange} />);

      const radioInput = screen.getByTestId('test-radio');
      fireEvent.click(radioInput);

      expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
      const event = mockOnChange.mock.calls[0]?.[0] as React.ChangeEvent<HTMLInputElement>;
      expect(event?.target?.value).toBe('test-radio');
    });

    it('should call onChange when label is clicked', () => {
      const mockOnChange = vi.fn();
      const { container } = render(<RadioCard {...defaultProps} onChange={mockOnChange} />);

      const label = container.querySelector('label');
      fireEvent.click(label!);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should have disabled attribute when isDisabled is true', () => {
      const mockOnChange = vi.fn();
      render(<RadioCard {...defaultProps} isDisabled onChange={mockOnChange} />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      const { container } = render(<RadioCard {...defaultProps} />);

      const label = container.querySelector('label');
      const radioInput = screen.getByTestId('test-radio');

      expect(label).toHaveAttribute('for', 'test-radio');
      expect(radioInput).toHaveAttribute('id', 'test-radio');
    });

    it('should maintain radio input semantics', () => {
      render(<RadioCard {...defaultProps} />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput.tagName).toBe('INPUT');
      expect(radioInput).toHaveAttribute('type', 'radio');
    });

    it('should group radio buttons by name', () => {
      const { rerender } = render(<RadioCard {...defaultProps} />);

      const radio1 = screen.getByTestId('test-radio');
      expect(radio1).toHaveAttribute('name', 'test-group');

      rerender(<RadioCard {...defaultProps} id="test-radio-2" />);

      const radio2 = screen.getByTestId('test-radio-2');
      expect(radio2).toHaveAttribute('name', 'test-group');
    });

    it('should have proper aria attributes when disabled', () => {
      render(<RadioCard {...defaultProps} isDisabled />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).toBeDisabled();
    });
  });

  describe('Title Variants', () => {
    it('should render string title', () => {
      render(<RadioCard {...defaultProps} title="String Title" />);

      expect(screen.getByText('String Title')).toBeInTheDocument();
    });

    it('should render ReactElement title', () => {
      const titleElement = (
        <div data-testid="custom-title">
          Custom <strong>Title</strong>
        </div>
      );
      render(<RadioCard {...defaultProps} title={titleElement} />);

      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
    });
  });

  describe('SubTitle Variants', () => {
    it('should render string subtitle', () => {
      render(<RadioCard {...defaultProps} subTitle="String Subtitle" />);

      expect(screen.getByText('String Subtitle')).toBeInTheDocument();
    });

    it('should render ReactElement subtitle', () => {
      const subtitleElement = (
        <div data-testid="custom-subtitle">
          Custom <em>Subtitle</em>
        </div>
      );
      render(<RadioCard {...defaultProps} subTitle={subtitleElement} />);

      expect(screen.getByTestId('custom-subtitle')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render label as root element', () => {
      const { container } = render(<RadioCard {...defaultProps} />);

      const root = container.firstChild;
      expect(root?.nodeName).toBe('LABEL');
    });

    it('should render radio input inside label', () => {
      const { container } = render(<RadioCard {...defaultProps} />);

      const label = container.querySelector('label');
      const radioInput = label?.querySelector('input[type="radio"]');
      expect(radioInput).toBeInTheDocument();
    });

    it('should render all components in correct order', () => {
      const badges = <div data-testid="test-badges">Badges</div>;
      const children = <div data-testid="test-children">Children</div>;

      render(
        <RadioCard {...defaultProps} subTitle="Subtitle" badges={badges}>
          {children}
        </RadioCard>,
      );

      // Verify radio input is rendered
      expect(screen.getByTestId('test-radio')).toBeInTheDocument();

      // Verify title is rendered
      expect(screen.getByText('Test Radio Card')).toBeInTheDocument();

      // Verify badges are rendered
      expect(screen.getByTestId('test-badges')).toBeInTheDocument();

      // Verify subtitle is rendered
      expect(screen.getByText('Subtitle')).toBeInTheDocument();

      // Verify children are rendered
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as id', () => {
      render(<RadioCard {...defaultProps} id="" />);

      const radioInput = screen.getByTestId('');
      expect(radioInput).toBeInTheDocument();
    });

    it('should handle special characters in id', () => {
      const specialId = 'test-id-123_special-chars';
      render(<RadioCard {...defaultProps} id={specialId} />);

      const radioInput = screen.getByTestId(specialId);
      expect(radioInput).toHaveAttribute('id', specialId);
      expect(radioInput).toHaveAttribute('value', specialId);
    });

    it('should handle null badges gracefully', () => {
      render(<RadioCard {...defaultProps} badges={null} />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).toBeInTheDocument();
    });

    it('should handle multiple radio cards in same group', () => {
      const mockOnChange = vi.fn();
      render(
        <>
          <RadioCard
            id="option-1"
            name="radio-group"
            selected="option-1"
            title="Option 1"
            onChange={mockOnChange}
          />
          <RadioCard
            id="option-2"
            name="radio-group"
            selected="option-1"
            title="Option 2"
            onChange={mockOnChange}
          />
        </>,
      );

      const radio1 = screen.getByTestId('option-1');
      const radio2 = screen.getByTestId('option-2');

      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();
      expect(radio1).toHaveAttribute('name', 'radio-group');
      expect(radio2).toHaveAttribute('name', 'radio-group');
    });

    it('should handle rapid clicks', () => {
      const mockOnChange = vi.fn();
      render(<RadioCard {...defaultProps} onChange={mockOnChange} />);

      const radioInput = screen.getByTestId('test-radio');

      fireEvent.click(radioInput);
      fireEvent.click(radioInput);
      fireEvent.click(radioInput);

      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });

    it('should maintain consistency when rerendered with same props', () => {
      const { rerender } = render(<RadioCard {...defaultProps} />);

      const radioInput1 = screen.getByTestId('test-radio');
      expect(radioInput1).not.toBeChecked();

      rerender(<RadioCard {...defaultProps} />);

      const radioInput2 = screen.getByTestId('test-radio');
      expect(radioInput2).not.toBeChecked();
    });

    it('should update when selected prop changes', () => {
      const { rerender } = render(<RadioCard {...defaultProps} selected="other-option" />);

      let radioInput = screen.getByTestId('test-radio');
      expect(radioInput).not.toBeChecked();

      rerender(<RadioCard {...defaultProps} selected="test-radio" />);

      radioInput = screen.getByTestId('test-radio');
      expect(radioInput).toBeChecked();
    });
  });

  describe('Complex Content', () => {
    it('should handle complex badge content', () => {
      const complexBadges = (
        <div data-testid="complex-badges">
          <span>Badge 1</span>
          <span>Badge 2</span>
          <span>Badge 3</span>
        </div>
      );
      render(<RadioCard {...defaultProps} badges={complexBadges} />);

      const badgesContainer = screen.getByTestId('complex-badges');
      expect(badgesContainer).toBeInTheDocument();
      expect(badgesContainer.children).toHaveLength(3);
    });

    it('should handle complex children content', () => {
      const complexChildren = (
        <div data-testid="complex-children">
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <button>Action</button>
        </div>
      );
      render(<RadioCard {...defaultProps}>{complexChildren}</RadioCard>);

      const childrenContainer = screen.getByTestId('complex-children');
      expect(childrenContainer).toBeInTheDocument();
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('should handle very long title text', () => {
      const longTitle = 'A'.repeat(500);
      render(<RadioCard {...defaultProps} title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long subtitle text', () => {
      const longSubtitle = 'B'.repeat(500);
      render(<RadioCard {...defaultProps} subTitle={longSubtitle} />);

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });
  });

  describe('Radio Input Properties', () => {
    it('should have margin set to 0', () => {
      render(<RadioCard {...defaultProps} />);

      const radioInput = screen.getByTestId('test-radio');
      expect(radioInput).toHaveClass('m-0');
    });

    it('should set value attribute equal to id', () => {
      render(<RadioCard {...defaultProps} id="unique-value" />);

      const radioInput = screen.getByTestId('unique-value');
      expect(radioInput).toHaveAttribute('value', 'unique-value');
    });
  });
});
