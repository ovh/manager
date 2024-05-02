import { describe, vi, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import { StepComponent } from './Step.component';

type TProps = {
  id: string;
  title?: string;
  subtitle?: string | JSX.Element;
  isOpen?: boolean;
  isChecked?: boolean;
  isLocked?: boolean;
  order?: number;
  next?: { action: (id: string) => void; label: string };
  edit?: { action: (id: string) => void; label: string };
  children?: JSX.Element | JSX.Element[];
};
const id = 'id';
const child = (
  <div>
    <button data-testid="click-me">click me</button>
  </div>
);

const renderStep = (props: TProps, children?: JSX.Element | JSX.Element[]) =>
  render(<StepComponent {...props}>{children}</StepComponent>);

describe('StepComponent', () => {
  describe('open', () => {
    describe('open', () => {
      it('should render child if open', () => {
        const { queryByTestId } = renderStep({ id, isOpen: true }, child);

        expect(queryByTestId('content')).toBeInTheDocument();
      });
      describe('next is defined', () => {
        const next = {
          action: vi.fn(),
          label: '',
        };

        it('should show next button if not done', () => {
          const { queryByTestId } = renderStep(
            { id, isOpen: true, next },
            child,
          );
          expect(queryByTestId('next')).toBeInTheDocument();
        });

        it('should call next function with id on next cta click', () => {
          const { getByTestId } = renderStep({ id, isOpen: true, next }, child);

          act(() => {
            getByTestId('next-cta').click();
          });

          expect(next.action).toHaveBeenLastCalledWith(id);
        });

        it('should not show next button if done', async () => {
          const { queryByTestId, findByTestId } = renderStep(
            { id, isOpen: true, next },
            child,
          );

          findByTestId('click-me').then((btn) => {
            btn.click();
            expect(queryByTestId('next')).not.toBeInTheDocument();
          });
        });
      });

      it('should not show next button if next is not provided', () => {
        const { queryByTestId } = renderStep({ id, isOpen: true }, child);
        expect(queryByTestId('next')).not.toBeInTheDocument();
      });
    });
    describe('not open', () => {
      it('should not render child if not open', () => {
        const { queryByTestId } = renderStep({ id }, child);

        expect(queryByTestId('content')).not.toBeInTheDocument();
      });
    });
    describe('edit', () => {
      describe('edit is provided', () => {
        const edit = { action: vi.fn(), label: '' };
        const next = {
          action: vi.fn(),
          label: '',
        };
        it('should not show edit button if not done yet', () => {
          const { queryByTestId } = renderStep({ id, edit }, child);

          expect(queryByTestId('edit')).not.toBeInTheDocument();
        });

        it('should show edit button if done', async () => {
          const { queryByTestId, getByTestId } = renderStep(
            { id, isOpen: true, edit, next },
            child,
          );
          const btn = getByTestId('next-cta');
          act(() => {
            btn.click();
          });

          expect(queryByTestId('edit')).toBeInTheDocument();
        });

        it('should call edit function with id on edit cta click', () => {
          const { getByTestId } = renderStep(
            { id, isOpen: true, next, edit },
            child,
          );

          act(() => {
            getByTestId('next-cta').click();
          });

          act(() => {
            getByTestId('edit-cta').click();
          });

          expect(edit.action).toHaveBeenLastCalledWith(id);
        });
      });
    });
  });
});
