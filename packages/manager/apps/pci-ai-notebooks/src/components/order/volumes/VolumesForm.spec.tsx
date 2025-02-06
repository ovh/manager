import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import VolumeForm from './VolumesForm.component';
import { Locale } from '@/hooks/useLocale';
import {
  mockedDatastoreWithContainerGit,
  mockedDatastoreWithContainerS3,
  mockedOrderPublicGit,
  mockedOrderVolumesGit,
  mockedOrderVolumesS3,
} from '@/__tests__/helpers/mocks/datastore';
import { handleSelectText } from '@/__tests__/helpers/unitTestHelper';

describe('Volume Form component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
    const mod = await importOriginal<
      typeof import('@ovh-ux/manager-react-shell-client')
    >();
    return {
      ...mod,
      useShell: vi.fn(() => ({
        i18n: {
          getLocale: vi.fn(() => Locale.fr_FR),
          onLocaleChange: vi.fn(),
          setLocale: vi.fn(),
        },
      })),
      useNavigation: () => ({
        getURL: vi.fn(
          (app: string, path: string) => `#mockedurl-${app}${path}`,
        ),
      }),
    };
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
      expect(
        screen.queryByTestId('no-datastore-info-container'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('dashboard-datastore-link'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('object-storage-link'),
      ).not.toBeInTheDocument();

      // should be in the DOM
      expect(
        screen.getByTestId('datastore-form-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('datastore-add-button')).toBeInTheDocument();
      expect(screen.getByTestId('datastore-list')).toBeInTheDocument();
      expect(
        screen.getByTestId('public-git-form-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('public-git-add-button')).toBeInTheDocument();
      expect(screen.getByTestId('public-git-list')).toBeInTheDocument();
      expect(
        screen.getByTestId('volumes-configured-labels'),
      ).toBeInTheDocument();
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
    await handleSelectText(
      'select-container-trigger',
      mockedDatastoreWithContainerS3.id,
    );

    // Chech that Branch input is not displayed
    expect(
      screen.queryByTestId('gitBranch-field-label'),
    ).not.toBeInTheDocument();

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

    // Select GIT Datastore
    await handleSelectText(
      'select-container-trigger',
      mockedDatastoreWithContainerGit.id,
    );

    // Chech that Branch input is displayed
    expect(screen.getByTestId('git-branch-input-field')).toBeInTheDocument();

    // add a value in MountPath and in Branch
    act(() => {
      fireEvent.change(screen.getByTestId('git-branch-input-field'), {
        target: {
          value: '/develop',
        },
      });
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
      expect(screen.getByText('mountPathError')).toBeInTheDocument();
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
