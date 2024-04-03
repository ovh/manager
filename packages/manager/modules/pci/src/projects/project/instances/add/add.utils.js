/**
 * @param {{
 *   [queryStringParam: string]: {
 *     name: string
 *     type: function
 *     validate: (value: any) => boolean
 *     value: boolean | number | string | (value: any) => any
 *   }
 * }} props
 * @returns {{
 *   model: Record<string, any>
 *   query: string
 * }}
 */
export const useURLModel = (props) => {
  const params = new URLSearchParams(window.top.location.hash.split('?').pop());
  const model = Object.entries(props).reduce(
    (result, [key, { name, type: Type, validate, value }]) => ({
      ...result,
      [name]: (() => {
        const typed = [Boolean, Number, String].includes(Type)
          ? Type(params.get(key))
          : new Type(params.get(key));
        const valued = typeof value === 'function' ? value(typed) : value;
        if (!params.has(key) || (validate && !validate(typed))) {
          return valued;
        }
        return typed;
      })(),
    }),
    {},
  );
  const query = Object.keys(props).join('&');
  return {
    model,
    query,
  };
};
