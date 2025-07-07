import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Wrap from '../Wrap.component';
import { WrapPreset } from '../Wrap.props';

vi.mock('@ovhcloud/ods-react', () => ({
  Text: ({ children, preset, className, ...props }: any) => (
    <div
      data-testid="ods-text"
      data-preset={preset}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
}));

describe('Wrap Component', () => {
  const defaultText = 'Test content';

  describe('Rendering', () => {
    it('should render children content', () => {
      render(<Wrap>{defaultText}</Wrap>);
      expect(screen.getByText(defaultText)).toBeInTheDocument();
    });

    it('should render with custom children', () => {
      const customContent = 'Custom test content';
      render(<Wrap>{customContent}</Wrap>);
      expect(screen.getByText(customContent)).toBeInTheDocument();
    });

    it('should render complex children', () => {
      const complexContent = (
        <div>
          <span>Nested content</span>
          <strong>Bold text</strong>
        </div>
      );
      render(<Wrap>{complexContent}</Wrap>);
      expect(screen.getByText('Nested content')).toBeInTheDocument();
      expect(screen.getByText('Bold text')).toBeInTheDocument();
    });
  });

  describe('Preset prop', () => {
    it('should use title preset by default', () => {
      render(<Wrap>{defaultText}</Wrap>);
      const textElement = screen.getByTestId('ods-text');
      expect(textElement).toHaveAttribute('data-preset', WrapPreset.title);
    });

    it('should use title preset when explicitly provided', () => {
      render(<Wrap preset={WrapPreset.title}>{defaultText}</Wrap>);
      const textElement = screen.getByTestId('ods-text');
      expect(textElement).toHaveAttribute('data-preset', WrapPreset.title);
    });

    it('should use subtitle preset when provided', () => {
      render(<Wrap preset={WrapPreset.subtitle}>{defaultText}</Wrap>);
      const textElement = screen.getByTestId('ods-text');
      expect(textElement).toHaveAttribute('data-preset', WrapPreset.subtitle);
    });
  });

  describe('ClassName prop', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-class';
      render(<Wrap className={customClass}>{defaultText}</Wrap>);
      const textElement = screen.getByTestId('ods-text');
      expect(textElement).toHaveClass(customClass);
    });

    it('should handle multiple className values', () => {
      const multipleClasses = 'class1 class2 class3';
      render(<Wrap className={multipleClasses}>{defaultText}</Wrap>);
      const textElement = screen.getByTestId('ods-text');
      expect(textElement).toHaveClass('class1', 'class2', 'class3');
    });
  });

  describe('Accessibility', () => {
    it('should maintain accessibility attributes', () => {
      render(
        <Wrap aria-label="Test label" {...({ role: 'heading' } as any)}>
          {defaultText}
        </Wrap>,
      );
      const textElement = screen.getByTestId('ods-text');
      expect(textElement).toHaveAttribute('aria-label', 'Test label');
      expect(textElement).toHaveAttribute('role', 'heading');
    });
  });
});
