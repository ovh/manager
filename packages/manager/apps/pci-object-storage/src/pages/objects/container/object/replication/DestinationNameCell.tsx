import { OdsLink } from '@ovhcloud/ods-components/react';
import { useHref, useSearchParams } from 'react-router-dom';
import './style.scss';

const DestinationNameCell = ({ destination }) => {
  const { name, region, id } = destination;
  const [searchParams] = useSearchParams();

  let href: string;
  if (id) {
    href = useHref(`./${id}/edit?region=${searchParams.get('region')}`);

    return (
      <div className="flex flex-col  max-w-80">
        <OdsLink
          className="ellipsis-link"
          color="primary"
          href={href}
          label={id}
        />
      </div>
    );
  }
  href = useHref(`../${name}?region=${region}`);

  return (
    <div className="flex flex-col">
      <OdsLink isDisabled={!region} color="primary" href={href} label={name} />
    </div>
  );
};

export default DestinationNameCell;
