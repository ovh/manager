import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import uniqBy from 'lodash/uniqBy';

export default class Messaging {
  resetMessages() {
    this.message = null;
    this.messageDetails = null;
  }

  write(message, alertType, failure = null) {
    this.message = message;
    this.alertType = `alert ${alertType}`;
    this.messageDetails = [];

    if (failure != null) {
      const value = [failure, failure.data];

      forEach(value, (currentValue) => {
        if (!isEmpty(currentValue)) {
          if (isString(currentValue)) {
            this.messageDetails.push({ id: null, message: currentValue });
          } else if (isString(currentValue.message)) {
            this.messageDetails.push({
              id: currentValue.id,
              message: currentValue.message,
            });
          } else if (currentValue.messages != null) {
            this.messageDetails = currentValue.messages.map(
              (currentMessage) => ({
                id: currentMessage.code,
                message: currentMessage.message,
              }),
            );
            this.messageDetails = uniqBy(
              this.messageDetails,
              (currentMessage) =>
                `${currentMessage.id}${currentMessage.message}`,
            );
          }
        }
      });
    }
  }

  writeInfo(message, details = null) {
    this.write(message, 'alert-info', details);
  }

  writeSuccess(message, details = null) {
    this.write(message, 'alert-success', details);
  }

  writeWarning(message, details = null) {
    this.write(message, 'alert-warning', details);
  }

  writeError(message, details = null) {
    this.write(message, 'alert-danger', details);
  }

  /**
   * If multiple messages set message structure as follow :
   * {
   *   OK: 'message to display when success',
   *   PARTIAL: 'message to display when partial success',
   *   ERROR: 'message to display when fail'
   * }
   * @param data : the data from SWS
   */
  setMessage(message, failure) {
    let messageToSend = message;
    let messageDetails = [];
    let alertType = 'alert alert-success';

    if (failure != null) {
      if (failure.message != null) {
        messageDetails.push({ id: failure.id, message: failure.message });
        alertType = 'alert alert-warning';

        if (isString(failure.type)) {
          switch (failure.type.toUpperCase()) {
            case 'ERROR':
              alertType += ' alert-danger';

              if (message.ERROR != null || message != null) {
                messageToSend = message.ERROR || message;
              }
              break;
            case 'PARTIAL':
              alertType += ' alert-danger';

              if (message.PARTIAL != null || message != null) {
                messageToSend = message.PARTIAL || message;
              }
              break;
            case 'INFO':
              alertType += ' alert-success';

              if (message.INFO != null || message != null) {
                messageToSend = message.INFO || message;
              }
              break;
            default:
              break;
          }
        }
      } else if (failure.messages != null) {
        if (!isEmpty(failure.messages)) {
          alertType = 'alert';

          switch (failure.state.toUpperCase()) {
            case 'ERROR':
              alertType += ' alert-danger';
              messageToSend = message.ERROR || message;
              break;
            case 'PARTIAL':
              alertType += ' alert-warning';
              messageToSend = message.PARTIAL || message;
              break;
            case 'OK':
              alertType += ' alert-success';
              messageToSend = message.OK || message;
              break;
            default:
              alertType += ' alert-warning';
              messageToSend = message;
              break;
          }

          messageDetails = failure.messages
            .filter(
              (currentMessage) =>
                isString(currentMessage.type) &&
                currentMessage.type.toUpperCase() !== 'INFO',
            )
            .map((currentMessage) => ({
              id: currentMessage.code,
              message: currentMessage.message,
            }));
        }
      } else if (failure.status != null) {
        alertType = 'alert alert-warning';

        switch (failure.status.toUpperCase()) {
          case 'BLOCKED':
          case 'CANCELLED':
          case 'PAUSED':
          case 'ERROR':
            alertType += ' alert-danger';
            break;
          case 'TODO':
          case 'DONE':
            alertType += ' alert-success';
            break;
          default:
        }
      } else if (failure === 'true') {
        alertType = 'alert alert-success';
        messageDetails = null;
      }
    }

    this.message = messageToSend;
    this.messageDetails = messageDetails;
    this.alertType = alertType;
  }
}
