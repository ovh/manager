import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import LabelsForm from './LabelsForm.component';
import { mockedLabel } from '@/__tests__/helpers/mocks/shared/label';

describe('Labels Form component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const onAdd = vi.fn();
  const onDelete = vi.fn();
  const onChange = vi.fn();
  it('should display the Labels Form', async () => {
    render(<LabelsForm configuredLabels={[mockedLabel]} />);
    await waitFor(() => {
      expect(screen.getByTestId('labels-form-container')).toBeTruthy();
      expect(screen.getByTestId('key-input-field')).toBeTruthy();
      expect(screen.getByTestId('value-input-field')).toBeTruthy();
      expect(screen.getByTestId('label-add-button')).toBeTruthy();
      expect(screen.getByTestId('configured-labels')).toBeTruthy();
      expect(screen.getByTestId(`button_${mockedLabel.name}`)).toBeTruthy();
    });
  });

  it('should display error when trying to add a existing key label', async () => {
    render(<LabelsForm configuredLabels={[mockedLabel]} />);
    await waitFor(() => {
      expect(screen.getByTestId('label-add-button')).toBeTruthy();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('key-input-field'), {
        target: {
          value: mockedLabel.name,
        },
      });
      fireEvent.change(screen.getByTestId('value-input-field'), {
        target: {
          value: 'newValue',
        },
      });
      fireEvent.click(screen.getByTestId('label-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByText('existingKeyError')).toBeTruthy();
    });
  });

  it('should trigger on add when adding label', async () => {
    render(<LabelsForm configuredLabels={[mockedLabel]} onAdd={onAdd} />);
    await waitFor(() => {
      expect(screen.getByTestId('label-add-button')).toBeTruthy();
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
      fireEvent.click(screen.getByTestId('label-add-button'));
    });
    await waitFor(() => {
      expect(onAdd).toHaveBeenCalled();
    });
  });

  it('should trigger on change when adding label', async () => {
    render(<LabelsForm configuredLabels={[mockedLabel]} onChange={onChange} />);
    await waitFor(() => {
      expect(screen.getByTestId('label-add-button')).toBeTruthy();
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
      fireEvent.click(screen.getByTestId('label-add-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('should trigger on delete when deleting a label', async () => {
    render(
      <LabelsForm
        configuredLabels={[mockedLabel]}
        onDelete={onDelete}
        onChange={onChange}
      />,
    );
    expect(screen.getByTestId(`button_${mockedLabel.name}`)).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId(`button_${mockedLabel.name}`));
    });
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
