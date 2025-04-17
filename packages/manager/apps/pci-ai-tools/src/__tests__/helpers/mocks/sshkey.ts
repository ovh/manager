import * as sshkey from '@datatr-ux/ovhcloud-types/cloud/sshkey/index';
import { OrderSshKey } from '@/types/orderFunnel';

export const mockedSshKey: sshkey.SshKey = {
  id: 'idSSHKEY',
  name: 'nameSSHKEY',
  publicKey: 'publicKey',
  regions: ['GRA'],
};

export const mockedSshKeyBis: sshkey.SshKey = {
  id: 'idSSHKEYBIs',
  name: 'nameSSHKEYBis',
  publicKey: 'publicKeyBis',
  regions: ['GRA'],
};

export const mockedSshKeyDetail: sshkey.SshKeyDetail = {
  fingerPrint: 'fingerPrint',
  id: 'id',
  name: 'name',
  publicKey: 'publicKey',
  regions: ['GRA', 'BHS'],
};

export const mockedOrderSshKey: OrderSshKey = {
  name: 'sshkeyName',
  sshKey: 'sskKEYDetails',
};
