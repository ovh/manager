import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import VolumeForm from './VolumesForm.component';
import {
  mockedDatastoreWithContainerGit,
  mockedDatastoreWithContainerS3,
  mockedOrderPublicGit,
  mockedOrderVolumesGit,
  mockedOrderVolumesS3,
} from '@/__tests__/helpers/mocks/volume/datastore';
import { handleSelectComboboxText } from '@/__tests__/helpers/unitTestHelper';

describe('Volume Form component', () => {
  beforeEach(() => {
    mockManagerReactShellClient();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  const onChange = vi.fn();
  it('renders volume form should display datastore form and public git form', async () => {
    render(
      <VolumeForm
        configuredVolumesList={[
          mockedDatastoreWithContainerS3,
          mockedDatastoreWithContainerGit,
        ]}
        selectedVolumesList={[]}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      // should not be in the DOM as not Datastore configured
      expect(screen.queryByTestId('no-datastore-info-container')).toBeNull();
      expect(screen.queryByTestId('dashboard-datastore-link')).toBeNull();
      expect(screen.queryByTestId('object-storage-link')).toBeNull();

      // should be in the DOM
      expect(screen.getByTestId('datastore-form-container')).toBeTruthy();
      expect(screen.getByTestId('datastore-add-button')).toBeTruthy();
      expect(screen.getByTestId('datastore-list')).toBeTruthy();
      expect(screen.getByTestId('public-git-form-container')).toBeTruthy();
      expect(screen.getByTestId('public-git-add-button')).toBeTruthy();
      expect(screen.getByTestId('public-git-list')).toBeTruthy();
      expect(screen.getByTestId('volumes-configured-labels')).toBeTruthy();
    });
  });

  it('should trigger callback on add s3 Datastore', async () => {
    render(
      <VolumeForm
        configuredVolumesList={[
          mockedDatastoreWithContainerS3,
          mockedDatastoreWithContainerGit,
        ]}
        selectedVolumesList={[]}
        onChange={onChange}
      />,
    );

    // Select S3 Datastore
    await handleSelectComboboxText(
      'select-datastore-container-button',
      mockedDatastoreWithContainerS3.id,
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-container-combobox')).toBeTruthy();
    });

    // Select Container
    await handleSelectComboboxText(
      'select-container-combobox',
      mockedDatastoreWithContainerS3.container[0],
    );

    // add a value in MountPath
    act(() => {
      fireEvent.change(screen.getByTestId('mount-directory-input-field'), {
        target: {
          value: '/demo',
        },
      });
    });

    // click add button
    act(() => {
      fireEvent.click(screen.getByTestId('datastore-add-button'));
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('should trigger callback on add Git Datastore', async () => {
    render(
      <VolumeForm
        configuredVolumesList={[
          mockedDatastoreWithContainerS3,
          mockedDatastoreWithContainerGit,
        ]}
        selectedVolumesList={[]}
        onChange={onChange}
      />,
    );

    await handleSelectComboboxText(
      'select-datastore-container-button',
      mockedDatastoreWithContainerGit.id,
    );

    // Chech that Branch input is displayed
    await waitFor(() => {
      expect(screen.getByTestId('git-container-input-field')).toBeTruthy();

      act(() => {
        fireEvent.change(screen.getByTestId('git-container-input-field'), {
          target: {
            value: 'develop',
          },
        });
      });
    });

    // add a value in MountPath and in Branch
    fireEvent.change(screen.getByTestId('mount-directory-input-field'), {
      target: {
        value: '/demo',
      },
    });

    // click add button
    act(() => {
      fireEvent.click(screen.getByTestId('datastore-add-button'));
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('should trigger callback on add Public Git', async () => {
    render(
      <VolumeForm
        configuredVolumesList={[]}
        selectedVolumesList={[]}
        onChange={onChange}
      />,
    );
    // add a value in MountPath and in Branch
    act(() => {
      fireEvent.change(screen.getByTestId('public-git-url-input-field'), {
        target: {
          value: 'https://url.git',
        },
      });
      fireEvent.change(
        screen.getByTestId('public-git-mount-path-input-field'),
        {
          target: {
            value: '/demo',
          },
        },
      );
    });

    // click add button
    act(() => {
      fireEvent.click(screen.getByTestId('public-git-add-button'));
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('should trigger an error when trying to add /workspace in mountDirectory', async () => {
    render(
      <VolumeForm
        configuredVolumesList={[
          mockedDatastoreWithContainerS3,
          mockedDatastoreWithContainerGit,
        ]}
        selectedVolumesList={[]}
        onChange={onChange}
      />,
    );

    // add a value in MountPath
    act(() => {
      fireEvent.change(screen.getByTestId('mount-directory-input-field'), {
        target: {
          value: '/workspace',
        },
      });
    });

    // click add button
    act(() => {
      fireEvent.click(screen.getByTestId('datastore-add-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('mountPathError')).toBeTruthy();
    });
  });

  it('should trigger callback when removing datastore S3', async () => {
    render(
      <VolumeForm
        configuredVolumesList={[
          mockedDatastoreWithContainerS3,
          mockedDatastoreWithContainerGit,
        ]}
        selectedVolumesList={[mockedOrderVolumesS3, mockedOrderVolumesGit]}
        onChange={onChange}
      />,
    );

    // click remove button
    act(() => {
      fireEvent.click(
        screen.getByTestId(
          `datatore-remove-button-${mockedOrderVolumesS3.mountPath}`,
        ),
      );
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('should trigger callback when removing public Git', async () => {
    render(
      <VolumeForm
        configuredVolumesList={[]}
        selectedVolumesList={[mockedOrderPublicGit]}
        onChange={onChange}
      />,
    );

    // click remove button
    act(() => {
      fireEvent.click(
        screen.getByTestId(
          `public-git-remove-button-${mockedOrderPublicGit.mountPath}`,
        ),
      );
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
