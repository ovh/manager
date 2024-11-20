import { PageLayout } from '@ovh-ux/manager-react-components';
import { FC } from 'react';
import { GoBack } from '@/components/navigation/GoBack.component';
import InstanceWrapper from './InstanceWrapper.page';

const Instance: FC = () => (
  <InstanceWrapper>
    <PageLayout>
      <GoBack />
    </PageLayout>
  </InstanceWrapper>
);
export default Instance;
