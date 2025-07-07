import { OdsLink } from '@ovhcloud/ods-components/react';
import { useHref, useSearchParams } from 'react-router-dom';
import './style.scss';

const DestinationNameCell = ({ destination }) => {
  const { name, region, id } = destination;
  const [searchParams] = useSearchParams();

  const encodeName = (e: string) => btoa(encodeURIComponent(e));

  const editHref = useHref(
    `./${encodeName(id)}/edit?region=${searchParams.get('region')}`,
  );
  const nameHref = useHref(`../${name}?region=${region}`);

  if (id) {
    return (
      <div className="flex flex-col max-w-80">
        <OdsLink
          className="ellipsis-link"
          color="primary"
          href={editHref}
          label={id}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <OdsLink
        isDisabled={!region}
        color="primary"
        href={nameHref}
        label={name}
      />
    </div>
  );
};

export default DestinationNameCell;
