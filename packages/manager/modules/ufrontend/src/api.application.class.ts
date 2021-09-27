import { OvhMicroFrontendBaseAPI, TimeoutObject } from './api.base.class';

export default class OvhMicroFrontendApplicationAPI extends OvhMicroFrontendBaseAPI {
  emit(data: Record<string, unknown>, opts: TimeoutObject) {
    this.ufrontend.emitMessage(
      {
        ...data,
        origin: 'application',
      },
      opts,
    );
  }
}
