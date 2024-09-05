import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DataGridClipboardCell,
  DataGridTextCell,
  Links,
} from '@ovhcloud/manager-components';
import { OkmsCredential } from '@/types/okmsCredential.type';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { CredentialStatus } from '../credentialStatus/CredentialStatus.component';

export const DatagridCredentialCellName = (credential: OkmsCredential) => {
  const navigate = useNavigate();
  return (
    <Links
      onClickReturn={() => {
        navigate(`${credential.id}`);
      }}
      label={credential.name}
    />
  );
};

export const DatagridCredentialCellId = (credential: OkmsCredential) => {
  return <DataGridClipboardCell text={credential.id} />;
};

export const DatagridCredentialCellIdentities = (
  credential: OkmsCredential,
) => {
  const identities = credential.identityURNs.length;
  return <DataGridTextCell>{identities}</DataGridTextCell>;
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  hour12: false,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

export const DatagridCredentialCellCreationDate = (
  credential: OkmsCredential,
) => {
  const date = new Date(Date.parse(credential.createdAt));

  const formattedDate = useFormattedDate({
    date,
    options: dateFormatOptions,
  });

  return <DataGridTextCell>{formattedDate}</DataGridTextCell>;
};

export const DatagridCredentialCellExpirationDate = (
  credential: OkmsCredential,
) => {
  const date = new Date(Date.parse(credential.expiredAt));

  const formattedDate = useFormattedDate({
    date,
    options: dateFormatOptions,
  });

  return <DataGridTextCell>{formattedDate}</DataGridTextCell>;
};

export const DatagridCredentialCellStatus = (credential: OkmsCredential) => {
  return <CredentialStatus state={credential.status} inline />;
};
