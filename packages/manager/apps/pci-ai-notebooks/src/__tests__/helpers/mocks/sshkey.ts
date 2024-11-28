import * as sshkey from '@/types/cloud/sshkey';

export const mockedSshKey: sshkey.SshKey = {
  id: 'idSSHKEY',
  name: 'nameSSHKEY',
  publicKey: 'publicKey',
  regions: ['GRA'],
};

export const mockedSshKeyDetail: sshkey.SshKeyDetail = {
  fingerPrint: 'fingerPrint',
  id: 'id',
  name: 'name',
  publicKey: 'publicKey',
  regions: ['GRA', 'BHS'],
};
