import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useSwiftData } from '../Swift.context';
import SwiftObjectsList from './_components/SwiftObjectListTable.component';

const Objects = () => {
  const { swift } = useSwiftData();
  const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  return (
    <>
      <h2>{t('objectTitle')}</h2>
      <SwiftObjectsList objects={swift.objects || []} />
      <Outlet />
    </>
  );
};

export default Objects;
