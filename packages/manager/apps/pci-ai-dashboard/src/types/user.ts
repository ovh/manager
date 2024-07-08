/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-namespace */
export namespace user {
  export interface User {
    createdDate: Date;
    description: string;
    id: string;
    openstackId: string;
    roles: user.Role[];
    password?: string;
    status: UserStatusEnum;
    username: string;
  }

  export interface UserCreation {
    description?: string;
    role: UserCreationEnum;
  }

  export interface Role {
    description: string;
    id: string;
    name: string;
    permissions: string[];
  }

  export enum UserStatusEnum {
    'CREATING' = 'CREATING',
    'DELETED' = 'DELETED',
    'DELETING' = 'DELETING',
    'OK' = 'OK',
  }

  export enum UserCreationEnum {
    'ai_training_operator' = 'ai_training_operator',
    'ai_training_read' = 'ai_training_read',
  }
}
