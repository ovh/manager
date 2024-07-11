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
    role: AIUserRoleEnum;
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

  export enum AIUserRoleEnum {
    'ai_training_operator' = 'ai_training_operator',
    'ai_training_read' = 'ai_training_read',
  }

  export enum AIUserRoleEnumWithLabel {
    'ai_training_operator' = 'AI Platform - Operator',
    'ai_training_read' = 'AI Platform - Read only',
  }
}
