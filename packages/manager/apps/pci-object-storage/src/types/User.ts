import * as user from '@datatr-ux/ovhcloud-types/cloud/user/index';

export default user;

export interface UserWithS3Credentials extends user.User {
  access_key: string;
}
