/** User creation definition */
export interface UserWithRolesCreation {
  /** Name of the user */
  name: string;
  /** Roles the user belongs to */
  roles: string[];
}
