import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { IdentityObject } from '@/types/identity.type';

export const IdentityIdCell = (identity: IdentityObject) => {
  return <DataGridTextCell>{identity.id}</DataGridTextCell>;
};

export const IdentityUrnCell = (identity: IdentityObject) => {
  return <DataGridTextCell>{identity.urn}</DataGridTextCell>;
};

export const IdentityAccountCell = (identity: IdentityObject) => {
  return <DataGridTextCell>{identity.account}</DataGridTextCell>;
};
