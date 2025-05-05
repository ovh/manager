import { createContext } from 'react';
import { User } from '@ovh-ux/manager-config';

export type UserContext = User | undefined;

const userContext = createContext<UserContext>(undefined);

export default userContext;
