import { SPINNER_COLOR, SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';

import { LoaderProps } from './Loader.props';

export const Loader: React.FC<Readonly<LoaderProps>> = ({
  message,
  details,
  size = SPINNER_SIZE.md,
  color = SPINNER_COLOR.primary,
}): JSX.Element => {
  const hasMessage = message !== undefined && message.trim() !== '';
  const hasDetails = details !== undefined && details.trim() !== '';

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Spinner size={size} color={color} />
      {hasMessage && <span className="heading-6">{message}</span>}

      {hasDetails && (
        <div className="mt-4 text-sm text-[var(--ods-color-gray-600)]">
          <span className="heading-6">{details}</span>
        </div>
      )}
    </div>
  );
};

export default Loader;
