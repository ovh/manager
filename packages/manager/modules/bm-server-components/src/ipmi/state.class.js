export const STATE_ENUM = Object.freeze({
  NONE: 0,
  LOADING: 1,
  ERROR: 2,
  DONE: 3,
});

export class State {
  constructor() {
    this.state = STATE_ENUM.NONE;
  }

  isLoading() {
    return this.state === STATE_ENUM.LOADING;
  }

  isDone() {
    return this.state === STATE_ENUM.DONE;
  }

  isError() {
    return this.state === STATE_ENUM.ERROR;
  }

  isNone() {
    return this.state === STATE_ENUM.NONE;
  }

  setState(state) {
    this.state = state;
  }
}

export default {
  State,
  STATE_ENUM,
};
