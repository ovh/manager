import { CSS_BOOTSTRAP_CLASSES } from './exchange.messaging.constants';

const isEmptyObj = (passedObj) =>
  !(
    passedObj &&
    passedObj === Object(passedObj) &&
    Object.keys(passedObj).length !== 0
  );
/**
 * find uniq values by predicate (fn)
 * @param arr
 * @param fn
 * @param set
 * @returns {*}
 */
const uniqBy = (arr, fn, set = new Set()) =>
  arr.filter((el) => ((v) => !set.has(v) && set.add(v))(fn(el)));

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

      value.forEach((currentValue) => {
        if (!isEmptyObj(currentValue)) {
          if (typeof currentValue === 'string') {
            this.messageDetails.push({ id: null, message: currentValue });
          } else if (typeof currentValue.message === 'string') {
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
    this.write(message, CSS_BOOTSTRAP_CLASSES.INFO, details);
  }

  writeSuccess(message, details = null) {
    this.write(message, CSS_BOOTSTRAP_CLASSES.SUCCESS, details);
  }

  writeWarning(message, details = null) {
    this.write(message, CSS_BOOTSTRAP_CLASSES.WARNING, details);
  }

  writeError(message, details = null) {
    this.write(message, CSS_BOOTSTRAP_CLASSES.DANGER, details);
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
    let alertSubType = CSS_BOOTSTRAP_CLASSES.SUCCESS;

    if (failure != null) {
      if (failure.message != null) {
        messageDetails.push({ id: failure.id, message: failure.message });
        alertSubType = 'alert alert-warning';

        if (typeof failure.type === 'string') {
          switch (failure.type.toUpperCase()) {
            case 'ERROR':
              alertSubType = CSS_BOOTSTRAP_CLASSES.DANGER;

              if (message.ERROR != null || message != null) {
                messageToSend = message.ERROR || message;
              }
              break;
            case 'PARTIAL':
              alertSubType = CSS_BOOTSTRAP_CLASSES.DANGER;

              if (message.PARTIAL != null || message != null) {
                messageToSend = message.PARTIAL || message;
              }
              break;
            case 'INFO':
              alertSubType = CSS_BOOTSTRAP_CLASSES.SUCCESS;

              if (message.INFO != null || message != null) {
                messageToSend = message.INFO || message;
              }
              break;
            default:
              break;
          }
        }
      } else if (failure.messages != null) {
        if (!isEmptyObj(failure.messages)) {
          switch (failure.state.toUpperCase()) {
            case 'ERROR':
              alertSubType = CSS_BOOTSTRAP_CLASSES.DANGER;
              messageToSend = message.ERROR || message;
              break;
            case 'PARTIAL':
              alertSubType = CSS_BOOTSTRAP_CLASSES.WARNING;
              messageToSend = message.PARTIAL || message;
              break;
            case 'OK':
              alertSubType = CSS_BOOTSTRAP_CLASSES.SUCCESS;
              messageToSend = message.OK || message;
              break;
            default:
              alertSubType = CSS_BOOTSTRAP_CLASSES.WARNING;
              messageToSend = message;
              break;
          }

          messageDetails = failure.messages
            .filter(
              (currentMessage) =>
                typeof currentMessage.type === 'string' &&
                currentMessage.type.toUpperCase() !== 'INFO',
            )
            .map((currentMessage) => ({
              id: currentMessage.code,
              message: currentMessage.message,
            }));
        }
      } else if (failure.status != null) {
        alertSubType = CSS_BOOTSTRAP_CLASSES.WARNING;

        switch (failure.status.toUpperCase()) {
          case 'BLOCKED':
          case 'CANCELLED':
          case 'PAUSED':
          case 'ERROR':
            alertSubType = CSS_BOOTSTRAP_CLASSES.DANGER;
            break;
          case 'TODO':
          case 'DONE':
            alertSubType = CSS_BOOTSTRAP_CLASSES.SUCCESS;
            break;
          default:
        }
      } else if (failure === 'true') {
        alertSubType = CSS_BOOTSTRAP_CLASSES.SUCCESS;
        messageDetails = null;
      }
    }

    this.message = messageToSend;
    this.messageDetails = messageDetails;
    this.alertType = `alert ${alertSubType}`;
  }
}
