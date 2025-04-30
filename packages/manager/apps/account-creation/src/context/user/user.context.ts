import { createContext } from 'react';
import { User } from '@ovh-ux/manager-config';

export type UserContext = User | null;

const userContext = createContext<UserContext>(null);

export default userContext;
