import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FileInputContext } from './FileInputContainer';

type Props = {
  className?: string;
};

export const FileInputErrorMessage: FunctionComponent<Props> = ({
  className,
}) => {
  const context = useContext(FileInputContext);
  if (!context) {
    throw Error(
      'The component <FileInputErrorMessage /> must be a child of FileInputContainer',
    );
  }
  const { value: files, accept, maxSize } = context;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation('account-disable-2fa');

  const parseContentTypes = (inputString: string) => {
    const typesArray = inputString.split(',').map((type) => type.trim());
    const extensions = typesArray.map((type) => type.split('/')[1]);
    const lastType = extensions.pop();
    return { types: extensions.join(', '), lastType };
  };

  useEffect(() => {
    let error;

    const { types, lastType } = parseContentTypes(accept);

    files.forEach((file) => {
      if (!accept.includes(file.type)) {
        error = t('account-disable-2fa-file-input-type-file-error', {
          types,
          lastType,
        });
      }

      if (file.size > maxSize) {
        error = t('account-disable-2fa-file-input-size-file-error');
      }
    });

    setErrorMessage(error);
  }, [files]);

  if (errorMessage) {
    return (
      <div className={className}>
        <p className="border border-red-600 rounded py-2 px-4 mt-2 bg-red-100 text-red-800 text-sm truncate">
          {errorMessage}
        </p>
      </div>
    );
  }
  return <></>;
};
