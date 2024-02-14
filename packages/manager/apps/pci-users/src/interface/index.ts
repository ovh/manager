export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
};

export type Service = {
  name: string;
  permissions: Permission[];
};

export type Permission = {
  label: string;
  roles: string[];
};

export type User = {
  id?: string;
  username: string;
  creationDate: string;
  description: string;
  openstackId: string;
  status: string;
  roles: Role[];
};
