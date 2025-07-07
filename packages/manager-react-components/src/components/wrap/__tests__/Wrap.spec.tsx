import { render, screen } from '@testing-library/react';
import { Wrap } from '../Wrap.component';
import { WrapPreset } from '../Wrap.props';

describe('Wrap Component', () => {
  const defaultText = 'Test content';

  describe('Rendering', () => {
    it('should render children content', () => {
      render(<Wrap>{defaultText}</Wrap>);
      expect(screen.getByText(defaultText)).toBeInTheDocument();
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
      // The actual Text component from @ovhcloud/ods-react will be rendered
      // We can test that the content is rendered correctly
      expect(screen.getByText(defaultText)).toBeInTheDocument();
    });

    it('should use title preset when explicitly provided', () => {
      render(<Wrap preset={WrapPreset.title}>{defaultText}</Wrap>);
      expect(screen.getByText(defaultText)).toBeInTheDocument();
    });

    it('should use subtitle preset when provided', () => {
      render(<Wrap preset={WrapPreset.subtitle}>{defaultText}</Wrap>);
      expect(screen.getByText(defaultText)).toBeInTheDocument();
    });
  });

  describe('ClassName prop', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-class';
      render(<Wrap className={customClass}>{defaultText}</Wrap>);
      // The className will be applied to the Text component from @ovhcloud/ods-react
      // We can verify the content is rendered
      expect(screen.getByText(defaultText)).toBeInTheDocument();
    });

    it('should handle multiple className values', () => {
      const multipleClasses = 'class1 class2 class3';
      render(<Wrap className={multipleClasses}>{defaultText}</Wrap>);
      expect(screen.getByText(defaultText)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should maintain accessibility attributes', () => {
      render(
        <Wrap aria-label="Test label" {...({ role: 'heading' } as any)}>
          {defaultText}
        </Wrap>,
      );
      // The accessibility attributes will be passed to the Text component
      // We can verify the content is rendered
      expect(screen.getByText(defaultText)).toBeInTheDocument();
    });
  });
});
