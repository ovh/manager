import { FieldError, FieldErrors } from 'react-hook-form';

const ErrorList = ({ error }: { error: FieldErrors }) => {
  const renderErrorMessages = (errors: FieldErrors): React.ReactNode[] => {
    return Object.entries(errors).flatMap(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if ('message' in value) {
          // Direct error message
          return <li key={key}>{(value as FieldError).message}</li>;
        }
        // Nested errors or array errors
        const nestedErrors = renderErrorMessages(value as FieldErrors);
        return nestedErrors.length > 0 ? nestedErrors : [];
      }
      return []; // For TypeScript compliance, return empty array for non-error cases
    });
  };

  return (
    <ul className="list-inside list-disc">{renderErrorMessages(error)}</ul>
  );
};

export default ErrorList;
