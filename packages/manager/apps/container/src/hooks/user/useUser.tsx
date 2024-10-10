import { Environment, User } from '@ovh-ux/manager-config';
import { useEffect, useState } from 'react';
import { useShell } from '@/context';


const useUser = (): User => {
    const shell = useShell();

    const pluginEnvironement = shell.getPlugin('environment');
    const environment: Environment = pluginEnvironement.getEnvironment();
    const [user, setUser] = useState<User>(environment.user);

    useEffect(() => {
        pluginEnvironement.onUserChange((updatedUser: User) => {
            setUser(updatedUser);
        });
    }, []);

    return user;
}

export default useUser;