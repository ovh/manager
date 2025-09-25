import { render } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

import LoadingSkeleton from '@/components/LoadingSkeleton.component';

describe('Loadable', () => {
  it("should render children if 'when' is true", () => {
    const children = <div>children</div>;
    const { container } = render(<LoadingSkeleton when>{children}</LoadingSkeleton>);
    expect(container).toHaveTextContent('children');
  });

  describe("should render spinner if 'when' is false", () => {
    it("should render spinner if 'when' is false", () => {
      const { queryByTestId } = render(<LoadingSkeleton when={false} />);
      expect(queryByTestId('spinner')).toBeInTheDocument();
    });

    describe('centered', () => {
      it('should render spinner centered when spinner.centered is "true"', () => {
        const { getByTestId } = render(
          <LoadingSkeleton when={false} spinner={{ centered: true }} />,
        );
        const wrapper = getByTestId('wrapper');

        expect(wrapper).toHaveClass('text-center');
      });

      it('should not render spinner centered when spinner.centered is "false"', () => {
        const { getByTestId } = render(
          <LoadingSkeleton when={false} spinner={{ centered: false }} />,
        );
        const wrapper = getByTestId('wrapper');

        expect(wrapper).not.toHaveClass('text-center');
      });

      it('should not render spinner centered when spinner.centered is not defined', () => {
        const { getByTestId } = render(
          <LoadingSkeleton when={false} spinner={{ centered: false }} />,
        );
        const wrapper = getByTestId('wrapper');

        expect(wrapper).not.toHaveClass('text-center');
      });
    });

    describe('inline', () => {
      it('should render spinner inline when spinner.inline is "true"', () => {
        const { getByTestId } = render(<LoadingSkeleton when={false} spinner={{ inline: true }} />);
        const spinner = getByTestId('spinner');

        expect(spinner).toHaveAttribute('inline', 'true');
      });

      it('should render spinner inline when spinner.inline is undefined', () => {
        const { getByTestId } = render(<LoadingSkeleton when={false} />);
        const spinner = getByTestId('spinner');

        expect(spinner).toHaveAttribute('inline', 'true');
      });

      it('should render spinner not inline when spinner.inline is false', () => {
        const { getByTestId } = render(
          <LoadingSkeleton when={false} spinner={{ inline: false }} />,
        );
        const spinner = getByTestId('spinner');

        expect(spinner).toHaveAttribute('inline', 'false');
      });
    });

    describe('size', () => {
      it('should render spinner with the right size if provided', () => {
        const { getByTestId } = render(
          <LoadingSkeleton when={false} spinner={{ size: ODS_SPINNER_SIZE.lg }} />,
        );
        const spinner = getByTestId('spinner');

        expect(spinner).toHaveAttribute('size', ODS_SPINNER_SIZE.lg);
      });

      it('should render spinner with size md if size is not if provided', () => {
        const { getByTestId } = render(<LoadingSkeleton when={false} />);
        const spinner = getByTestId('spinner');

        expect(spinner).toHaveAttribute('size', ODS_SPINNER_SIZE.md);
      });
    });
  });
});
