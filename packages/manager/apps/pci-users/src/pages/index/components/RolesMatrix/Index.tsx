import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { Role, Service } from '@/interface';
import { BreakPoints } from '@/layout';
import Toggle from './Toggle';
import RolesChooser from './RolesChooser';
import RolesMatrixGrid from './RolesMatrixGrid';

interface IProps {
  roles: Role[];
  services: Service[];
}

export default function RolesMatrix({ roles, services }: IProps) {
  const isScreenMdPlus = useMedia(`(min-width: ${BreakPoints.MD}px)`);

  const [toggled, setToggled] = useState<boolean>(false);

  const [mdRoles, setMdRoles] = useState<Role[]>(roles);
  const [smRole, setSmRole] = useState<Role>(null);

  const setRolesFromInput = (param: Role[] | Role) => {
    if (Array.isArray(param)) setMdRoles(param);
    else setSmRole(param);
  };

  useEffect(() => {
    setMdRoles(roles);
  }, [roles]);

  useEffect(() => {
    setSmRole(null);
  }, [isScreenMdPlus]);

  let uiRoles = mdRoles;
  if (!isScreenMdPlus) uiRoles = smRole ? [smRole] : [];

  return (
    <>
      <Toggle toggled={toggled} onToggle={setToggled} />

      {toggled && (
        <>
          <RolesChooser
            allRoles={roles}
            preselectedRoles={mdRoles}
            isFullSize={isScreenMdPlus}
            onInput={setRolesFromInput}
          />
          {(isScreenMdPlus || (!isScreenMdPlus && smRole !== null)) && (
            <RolesMatrixGrid roles={uiRoles} services={services} />
          )}
        </>
      )}
    </>
  );
}
