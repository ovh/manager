import { OdsLink } from '@ovhcloud/ods-components/react';
import { useHref } from 'react-router-dom';

const DestinationNameCell = ({ destination }) => {
  const { name, region } = destination;
  const href = useHref(`../${name}?region=${region}`);

  return (
    <div className="flex flex-col">
      <OdsLink color="primary" href={href} label={name} />
    </div>
  );
};

export default DestinationNameCell;
