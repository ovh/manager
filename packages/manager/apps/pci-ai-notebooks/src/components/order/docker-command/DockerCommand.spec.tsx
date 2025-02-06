import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import DockerCommand from './DockerCommand.component';

describe('Docker Command component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display the docker command form', async () => {
    render(
      <DockerCommand
        commands={['command', 'docker']}
        onChange={onChange}
        disabled={false}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('docker-command-form-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('command-input-field')).toBeInTheDocument();
      expect(screen.getByTestId('docker-command-button')).toBeInTheDocument();
      expect(screen.getByTestId('docker-command-list')).toBeInTheDocument();
    });
  });

  it('should add a docker command', async () => {
    render(
      <DockerCommand commands={[]} onChange={onChange} disabled={false} />,
    );
    const newCommand = 'this is a new docker command';
    act(() => {
      fireEvent.change(screen.getByTestId('command-input-field'), {
        target: {
          value: newCommand,
        },
      });
      fireEvent.click(screen.getByTestId('docker-command-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(newCommand.split(' '));
    });
  });
});
