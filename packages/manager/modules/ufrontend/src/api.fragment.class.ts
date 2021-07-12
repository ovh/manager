import { OvhMicroFrontendBaseAPI, TimeoutObject } from './api.base.class';
import OvhFragment from './fragment.class';
import OvhMicroFrontend from './framework.class';

export default class OvhMicroFrontendFragmentAPI extends OvhMicroFrontendBaseAPI {
  private fragment: OvhFragment;

  constructor(ufrontend: OvhMicroFrontend, fragment: OvhFragment) {
    super(ufrontend);
    this.fragment = fragment;
  }

  emit(data: Record<string, unknown>, opts: TimeoutObject) {
    this.ufrontend.emitMessage(
      {
        ...data,
        origin: this.fragment.id,
      },
      opts,
    );
  }
}
