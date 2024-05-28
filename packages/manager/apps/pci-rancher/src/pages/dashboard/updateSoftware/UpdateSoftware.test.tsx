import React from 'react';
import { fireEvent, render, waitFor } from '@/utils/test/test.provider';

import { versionsMocked } from '@/_mock_/version';
import { rancherMocked } from '@/_mock_/rancher';
import updateTranslation from '@/public/translations/pci-rancher/updateSoftware/Messages_fr_FR.json';

import UpdateSoftware, {
  UpdateSoftwareProps,
} from './UpdateSoftware.component';

const mockedUsedNavigate = jest.fn();

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const defaultProps: UpdateSoftwareProps = {
  rancher: rancherMocked,
  versions: versionsMocked,
  isUpdatePending: false,
  onClickUpdate: jest.fn(),
  currentVersionDetails: versionsMocked[0],
};

afterEach(() => {
  jest.clearAllMocks();
});

const setupSpecTest = async (props: UpdateSoftwareProps = defaultProps) =>
  waitFor(() => render(<UpdateSoftware {...props} />));

describe('UpdateSoftware', () => {
  it('should render the component', async () => {
    const { getByText } = await setupSpecTest();
    expect(
      getByText(updateTranslation.updateSoftwareRancherDurationInfo),
    ).toBeInTheDocument();
  });

  describe('Version display', () => {
    it('should see the next version in table with last one checked', async () => {
      const { getByText } = await setupSpecTest();

      const newVersion1 = getByText(`Version ${versionsMocked[1].name}`);
      const newVersion3 = getByText(`Version ${versionsMocked[3].name}`);

      const radio1 = newVersion1.closest('osds-radio-button');
      const radio3 = newVersion3.closest('osds-radio-button');

      expect(newVersion1).toBeInTheDocument();
      expect(newVersion3).toBeInTheDocument();

      expect(radio1).not.toHaveAttribute('checked');
      expect(radio3).toHaveAttribute('checked');
    });

    it('should see the unavailable version as disabled and not clickable', async () => {
      const { getByText } = await setupSpecTest();

      const notAvailableVersion = getByText(
        `Version ${versionsMocked[2].name}`,
      );

      const radio = notAvailableVersion.closest('osds-radio-button');
      expect(radio).toHaveAttribute('disabled');

      fireEvent.click(radio);

      expect(radio).not.toHaveAttribute('checked');
    });

    it('Given i click on other version i should change selected version', async () => {
      const { getByText } = await setupSpecTest();

      const newVersion1 = getByText(`Version ${versionsMocked[1].name}`);
      const newVersion3 = getByText(`Version ${versionsMocked[3].name}`);

      const radio1 = newVersion1.closest('osds-radio-button');
      const radio3 = newVersion3.closest('osds-radio-button');
      expect(radio3).toHaveAttribute('checked');

      fireEvent.click(radio1);

      expect(radio3).not.toHaveAttribute('checked');
      expect(radio1).toHaveAttribute('checked');
    });

    it('Given i click on current version it should not change selected version', async () => {
      const { getByText } = await setupSpecTest();

      const currentVersion = getByText(
        (content) =>
          content.includes('Version') &&
          content.includes(rancherMocked.targetSpec.version) &&
          content.includes('(Version courante)'),
      );

      const radio = currentVersion.closest('osds-radio-button');
      expect(radio).not.toHaveAttribute('checked');

      fireEvent.click(radio);

      expect(radio).not.toHaveAttribute('checked');
    });

    describe('Changelog url', () => {
      it('should open the changelog url', async () => {
        const { getAllByText } = await setupSpecTest();

        const newVersion1 = getAllByText(
          updateTranslation.updateSoftwareRancherChangelog,
        );

        const changeLogLink = newVersion1[0].closest('osds-link');
        expect(changeLogLink).toBeInTheDocument();
      });

      it('should not display changelog if there is no url', async () => {
        const { queryByText } = await setupSpecTest({
          ...defaultProps,
          versions: [
            ...versionsMocked.slice(0, 1),
            { ...versionsMocked[1], changelogUrl: undefined },
          ],
        });

        const newVersion1 = queryByText(
          updateTranslation.updateSoftwareRancherChangelog,
        );

        expect(newVersion1).not.toBeInTheDocument();
      });
    });
  });
});
