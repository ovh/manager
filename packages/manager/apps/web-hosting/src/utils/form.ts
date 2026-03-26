export const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*_\-+=|\\(){}[\]:;'<>,.?\d])/;

export const ADVANCED_INSTALL_PASSWORD_REGEX =
  /^(?=(?:.*\d){2,})(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,31}$/;
