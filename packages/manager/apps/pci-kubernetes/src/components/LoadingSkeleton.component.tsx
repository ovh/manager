import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

export type TLoadableProps = {
  when: boolean;
  spinner?: {
    centered?: boolean;
    size?: ODS_SPINNER_SIZE;
    inline?: boolean;
  };
  children?: JSX.Element | JSX.Element[];
};
export default function LoadingSkeletonComponent(
  props: Readonly<TLoadableProps>,
): JSX.Element {
  return (
    <>
      {!props.when ? (
        <div
          className={props.spinner?.centered ? 'text-center' : ''}
          data-testid="wrapper"
        >
          <OsdsSpinner
            data-testid="spinner"
            inline={
              props.spinner?.inline !== undefined ? props.spinner.inline : true
            }
            size={props.spinner?.size || ODS_SPINNER_SIZE.md}
          />
        </div>
      ) : (
        props.children
      )}
    </>
  );
}
