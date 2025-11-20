import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import LabelsForm from './LabelsForm.component';
import { mockedTag } from '@/__tests__/helpers/mocks/tag/tag';

describe('Labels Form component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const onAdd = vi.fn();
  const onOpenChange = vi.fn();

  it('should display the Labels Form', async () => {
    render(
      <LabelsForm
        open={true}
        configuredLabels={[mockedTag]}
        onOpenChange={onOpenChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('tags-form-container')).toBeTruthy();
      expect(screen.getByTestId('key-field-label')).toBeTruthy();
      expect(screen.getByTestId('key-input-field')).toBeTruthy();
      expect(screen.getByTestId('value-field-label')).toBeTruthy();
      expect(screen.getByTestId('value-input-field')).toBeTruthy();
      expect(screen.getByTestId('tags-submit-button')).toBeTruthy();
    });
  });

  it('should display error when trying to add a existing key label', async () => {
    render(
      <LabelsForm
        configuredLabels={[mockedTag]}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('tags-submit-button')).toBeTruthy();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('key-input-field'), {
        target: {
          value: mockedTag.key,
        },
      });
      fireEvent.change(screen.getByTestId('value-input-field'), {
        target: {
          value: 'newValue',
        },
      });
      fireEvent.click(screen.getByTestId('tags-submit-button'));
    });
    await waitFor(() => {
      expect(screen.getByText('existingKeyError')).toBeTruthy();
    });
  });

  it('should trigger on add when adding tag', async () => {
    render(
      <LabelsForm
        configuredLabels={[mockedTag]}
        onAdd={onAdd}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('tags-submit-button')).toBeTruthy();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('key-input-field'), {
        target: {
          value: 'newRandomKey',
        },
      });
      fireEvent.change(screen.getByTestId('value-input-field'), {
        target: {
          value: 'newRandomValue',
        },
      });
      fireEvent.click(screen.getByTestId('tags-submit-button'));
    });
    await waitFor(() => {
      expect(onAdd).toHaveBeenCalled();
    });
  });
});
