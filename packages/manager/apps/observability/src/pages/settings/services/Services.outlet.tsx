import ServiceCreateButton from '@/components/services/create-button/ServiceCreateButton.component';
import ServicesNavigation from '@/components/services/navigation/ServicesNavigation.component';
import { urls } from '@/routes/Routes.constants';

const ServicesOutlet = () => (
  <ServicesNavigation button={<ServiceCreateButton />} rootUrl={urls.services} />
);

export default ServicesOutlet;
