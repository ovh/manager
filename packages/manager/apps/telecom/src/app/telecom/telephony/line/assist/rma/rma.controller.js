import remove from 'lodash/remove';
import { SUPPORT_URLS } from '../../../../../app.constants';

import { TEXT_FOR_MODAL, ACTION_TYPE, RMA_NEW_TYPE } from './rma.constants';

export default class TelecomTelephonyLineAssistRmaCtrl {
  /* @ngInject */
  constructor($translate, lineAssistRmaService, TucToast, TucToastError) {
    this.$translate = $translate;
    this.lineAssistRmaService = lineAssistRmaService;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.SUPPORT_URL = SUPPORT_URLS.viewTickets;
  }

  $onInit() {
    this.rmaList = null;
    this.actionDoing = false;

    this.resetModalInfo();

    return this.lineAssistRmaService
      .fetchRma(this.billingAccount, this.serviceName)
      .then((result) => {
        this.rmaList = result;
      })
      .catch((err) => new this.TucToastError(err));
  }

  resetModalInfo() {
    this.isOpenModal = false;
    this.modal = {
      rma: null,
      title: null,
      content: null,
      primaryAction: null,
    };
  }

  trackDownloadPdf() {
    this.rmaTrackClick('rma-download-receipt');
  }

  generateCancelRmaModal(rma) {
    this.rmaTrackClick('rma-cancel');
    this.modal = {
      rma,
      title: TEXT_FOR_MODAL.cancelRma,
      content: `${TEXT_FOR_MODAL.cancelRma}_modal_content`,
      primaryAction: ACTION_TYPE.cancelRma,
    };
    this.isOpenModal = true;
  }

  generateEquipmentOutOfOrderModal(rma) {
    this.rmaTrackClick('rma-report-equipment');
    this.modal = {
      rma,
      title: TEXT_FOR_MODAL.equipmentOutOfOrder,
      content: `${TEXT_FOR_MODAL.equipmentOutOfOrder}_modal_content`,
      primaryAction: ACTION_TYPE.equipmentOutOfOrder,
    };
    this.isOpenModal = true;
  }

  generateKeepingLineModal(rma) {
    this.rmaTrackClick('rma-keep-line');
    this.modal = {
      rma,
      title: TEXT_FOR_MODAL.keepingLine,
      content: `${TEXT_FOR_MODAL.keepingLine}_modal_content`,
      primaryAction: ACTION_TYPE.keepingLine,
    };
    this.isOpenModal = true;
  }

  generateTerminateLineModal(rma) {
    this.rmaTrackClick('rma-resiliate-line');
    this.modal = {
      rma,
      title: TEXT_FOR_MODAL.terminateLine,
      content: `${TEXT_FOR_MODAL.terminateLine}_modal_content`,
      primaryAction: ACTION_TYPE.terminateLine,
    };
    this.isOpenModal = true;
  }

  executeAction(rma) {
    switch (this.modal.primaryAction) {
      case ACTION_TYPE.cancelRma:
        return this.cancelRma(rma);
      case ACTION_TYPE.equipmentOutOfOrder:
        return this.equipmentOutOfOrder();
      case ACTION_TYPE.keepingLine:
        return this.keepingLine(rma);
      case ACTION_TYPE.terminateLine:
        return this.terminateLine(rma);
      default:
        return null;
    }
  }

  cancelRma(rma) {
    this.actionDoing = true;
    return this.lineAssistRmaService
      .cancelRma(this.billingAccount, this.serviceName, rma)
      .then(() => {
        remove(this.rmaList, { id: rma.id });
        return this.TucToast.success(
          this.$translate.instant('telephony_line_assist_rma_cancel_success'),
        );
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isOpenModal = false;
        this.actionDoing = false;
      });
  }

  equipmentOutOfOrder() {
    window.open(this.SUPPORT_URL, '_blank', 'noopener');
    this.resetModalInfo();
  }

  keepingLine(rma) {
    this.actionDoing = true;
    return this.lineAssistRmaService
      .changeType(
        this.billingAccount,
        this.serviceName,
        rma,
        RMA_NEW_TYPE.toSip,
      )
      .then(() => {
        return this.reloadPage(
          this.$translate.instant(
            'telephony_line_assist_rma_keeping_line_success',
          ),
        );
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isOpenModal = false;
        this.actionDoing = false;
      });
  }

  terminateLine(rma) {
    this.actionDoing = true;
    return this.lineAssistRmaService
      .changeType(
        this.billingAccount,
        this.serviceName,
        rma,
        RMA_NEW_TYPE.resiliate,
      )
      .then(() => {
        return this.reloadPage(
          this.$translate.instant(
            'telephony_line_assist_rma_terminate_line_success',
          ),
        );
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isOpenModal = false;
        this.actionDoing = false;
      });
  }
}
