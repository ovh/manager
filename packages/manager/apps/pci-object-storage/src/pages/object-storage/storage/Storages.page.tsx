import { Outlet } from 'react-router-dom';
import StoragesList from './_components/StorageListTable.component';
import { useObjectStorageData } from '../ObjectStorage.context';
import { FormattedStorage } from '@/types/Storages';
import { createRegionWithAllInfo } from '@/lib/storagesHelper';

const Storages = () => {
  const { storages, regions } = useObjectStorageData();
  const formatedStorage: FormattedStorage[] = createRegionWithAllInfo(
    storages,
    regions,
  );

  return (
    <>
      <StoragesList storages={formatedStorage || []} />
      <Outlet />
    </>
  );
};

export default Storages;
