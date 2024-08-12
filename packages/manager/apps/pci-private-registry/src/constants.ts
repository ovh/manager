export const ACTIVE_STATUS = ['ok', 'READY'];
export const PENDING_STATUS = ['PENDING', 'CREATING', 'UPDATING', 'DELETING'];

export const HORIZON_LINK = {
  EU: 'https://horizon.cloud.ovh.net/auth/login?username={username}',
  CA: 'https://horizon.cloud.ovh.net/auth/login?username={username}',
  US: 'https://horizon.cloud.ovh.us/auth/login?username={username}',
};

export const HORIZON_LINK_TRUSTED = {
  EU:
    'https://horizon.trustedzone.cloud.ovh.net/auth/login?username={username}',
  CA:
    'https://horizon.trustedzone.cloud.ovh.net/auth/login?username={username}',
  US: '',
};

export const ALPHA_CHARACTERS_REGEX = /^[a-zA-Z-]+$/;
