import { VPS_STATES } from '../../vps-dashboard.constants';

export default class VpsStateInfoController {
  $onInit() {
    const state = this.vpsState.state.toLowerCase();
    this.vpsStateInfo = {
      state,
      stateGroup: {
        error: VPS_STATES.ERROR.includes(state),
        warning: VPS_STATES.WARNING.includes(state),
        success: VPS_STATES.SUCCESS.includes(state),
      },
    };
  }
}
