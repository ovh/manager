import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { VersionState } from '@secret-manager/components/VersionState/VersionState.component';
import { useFormatDate } from '@/common/hooks/useFormatDate';

export const VersionCellID = (version: SecretVersion) => (
  <DataGridTextCell>{version.id}</DataGridTextCell>
);

export const VersionCellState = (version: SecretVersion) => (
  <VersionState state={version.state} />
);

export const VersionCellCreatedAt = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  return <DataGridTextCell>{formatDate(version.createdAt)}</DataGridTextCell>;
};

export const VersionCellDeactivatedAt = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  const date = version.deactivatedAt ? formatDate(version.deactivatedAt) : '-';

  return <DataGridTextCell>{date}</DataGridTextCell>;
};
