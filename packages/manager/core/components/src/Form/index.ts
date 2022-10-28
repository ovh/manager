// temporary fix for enumNames type
// see https://github.com/rjsf-team/react-jsonschema-form/issues/2663#issuecomment-1106698186
import Form from './Form';

declare module 'json-schema' {
  export interface JSONSchema7 {
    enumNames?: Array<string>;
  }
}

export default Form;
