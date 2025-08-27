import map from 'lodash/map';

export default function() {
  const self = this;

  self.getTucToastInfos = function getTucToastInfos(
    bulkResult,
    messages,
    noDetails,
  ) {
    const infos = [];

    // manage full success
    if (!bulkResult.error.length) {
      return [
        {
          type: 'success',
          message: messages.fullSuccess,
        },
      ];
    }

    // manage partial success
    if (bulkResult.success.length) {
      infos.push({
        type: 'success',
        message: messages.partialSuccess,
      });
    }

    // manage errors
    if (bulkResult.error.length) {
      let errorList = '<ul>';
      bulkResult.error.forEach((error) => {
        errorList += `<li>${
          noDetails
            ? `${error.serviceName}</li>`
            : `${[
                error.serviceName,
                map(error.errors, 'statusCode').join(', '),
              ].join(' - ')}</li>`
        }`;
      });
      errorList += '</ul>';

      infos.push({
        type: 'error',
        message: messages.error + errorList,
      });
    }

    return infos;
  };
}
