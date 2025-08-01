import { Drawer } from '@ovh-ux/manager-react-components';
import {
  OdsCode,
  OdsSelect,
  OdsSkeleton,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSecretVersionWithData } from '@secret-manager/data/hooks/useSecretVersion';
import { getSecretVersionWithDataQueryKeys } from '@secret-manager/data/api/secretVersions';
import { useSecretVersionStateLabel } from '@secret-manager/hooks/useSecretVersionStateLabel';
import { VersionState } from '@secret-manager/components/VersionState/VersionState.component';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useSecretVersions } from '@secret-manager/data/hooks/useSecretVersions';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SecretDashboardPageParams } from '../dashboard/dashboard.type';

type SecretValueParams = {
  domainId: string;
  path: string;
  version: SecretVersion;
};

const SecretValue = ({ domainId, path, version }: SecretValueParams) => {
  const queryClient = useQueryClient();
  const { data: secretVersion, isPending, error } = useSecretVersionWithData(
    domainId,
    path,
    version.id,
  );

  // clear query on unmount
  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: getSecretVersionWithDataQueryKeys(domainId, path, version.id),
      });
    };
  }, [queryClient]);

  if (isPending)
    return (
      <div className="flex justify-center">
        <OdsSpinner />
      </div>
    );

  if (error) return <div>{error.message}</div>;

  return (
    <OdsCode className="block break-all">
      {JSON.stringify(secretVersion.data, null, 2)}
    </OdsCode>
    // <div className="block">{JSON.stringify(secretVersion.data, null, 2)}</div>
  );
};

// const handleDismiss = () => {
//   const queryClient = useQueryClient();

//       queryClient.removeQueries({
//         queryKey: getSecretVersionQueryKeys(domainId, path, version),
//       });
// }

type VersionSelectorParams = {
  domainId: string;
  path: string;
  currentVersion: SecretVersion;
  setCurrentVersion: React.Dispatch<React.SetStateAction<SecretVersion>>;
};

const VersionSelector = ({
  domainId,
  path,
  currentVersion,
  setCurrentVersion,
}: VersionSelectorParams) => {
  const { data: versions, isPending, error, refetch } = useSecretVersions(
    domainId,
    path,
  );

  if (isPending)
    return (
      <div className="flex justify-center">
        <OdsSpinner />
      </div>
    );

  if (error) return <div>{error.message}</div>;

  // standard select
  // return (
  //   <select onChange={(v) => setCurrentVersion(Number(v.target.value))}>
  //     {versions.map((version) => (
  //       <option value={version.id} key={version.id}>
  //         {version.id}
  //       </option>
  //     ))}
  //   </select>
  // );
  const defaultSelectedVersion = versions.find(
    (version) => version.state === 'ACTIVE',
  );

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex gap-2 items-center">
        <OdsText preset="span" className="w-1/3">
          version
        </OdsText>
        <OdsSelect
          className="flex-grow"
          name="version-selector"
          onOdsChange={(value) =>
            setCurrentVersion(
              versions.find((v) => v.id === Number(value.detail.value)),
            )
          }
          // defaultValue={defaultSelectedVersion.id.toString()}
        >
          {versions.map((version) => (
            <option value={version.id} key={version.id}>
              {version.id}
            </option>
          ))}
        </OdsSelect>
      </div>
      {currentVersion && (
        <div className="flex gap-2 items-center">
          <OdsText preset="span" className="w-1/3">
            state
          </OdsText>
          <VersionState state={currentVersion.state} />
        </div>
      )}
    </div>
  );
};

const ValueDrawerPage = () => {
  const navigate = useNavigate();

  const { domainId, secretPath } = useParams<SecretDashboardPageParams>();
  const secretPathDecoded = decodeSecretPath(secretPath);

  const [currentVersion, setCurrentVersion] = useState<
    SecretVersion | undefined
  >(undefined);

  return (
    <Drawer
      heading={'Valeurs'}
      onDismiss={() => {
        navigate('..');
      }}
    >
      <div className="flex flex-col gap-4">
        <VersionSelector
          domainId={domainId}
          path={secretPathDecoded}
          currentVersion={currentVersion}
          setCurrentVersion={setCurrentVersion}
        />
        {currentVersion && currentVersion.state === 'ACTIVE' && (
          <SecretValue
            domainId={domainId}
            path={secretPathDecoded}
            version={currentVersion}
          />
        )}
      </div>
    </Drawer>
  );
};

export default ValueDrawerPage;
