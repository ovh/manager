import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';
import set from 'lodash/set';
import some from 'lodash/some';

export default class UniqueMessageComposite {
  constructor(messageList, onDismiss) {
    this.messageList = messageList;
    this.text = messageList[0].text;
    this.textHtml = messageList[0].textHtml;
    this.messageOrder = messageList[0].messageOrder;
    this.type = messageList[0].type;
    this.link = messageList[0].link;
    this.dismissable = messageList[0].dismissable;
    this.dismissed = !some(this.messageList, (message) => !message.dismissed);

    this.onDismiss = onDismiss;
  }

  dismiss() {
    this.dismissed = true;
    forEach(this.messageList, (message) => {
      set(message, 'dismissed', true);
      if (isFunction(message.dismiss)) {
        message.dismiss();
      }
    });
    if (this.onDismiss) this.onDismiss(this);
  }
}
