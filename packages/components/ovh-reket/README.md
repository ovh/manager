# ovh-reket
> Provides a centralized predefined Reket configuration.

## Methods
### useReket(enableSsoAuth = true, requestTypes = 'default')
```js
import { useReket } from '@ovh-ux/ovh-reket';

const reketInstance = useReket();
// use your Reket instance
reketInstance.get('/my/url').then((response) => {
  console.log(response);
});
```
#### Parameters

##### enableSsoAuth

Type: `boolean` - default: `true`

Configure response error hook to handle ssoAuth. This handle logout and redirection to login page in case of non authenticated user.

##### requestTypes

Type: `array|string` - default: `'default'`

Configure the instance with predefined request types. Can be an array of objects (see Reket configuration) or a string with value `'default'` which set the requests types used within the manager.

#### ssoAuthHookFn

It's also possible to get the function used to handle ssoAuth redirections. Useful if you need to wrap your response with `$q` in angularJS for example. This method is used internaly by `useReket` methods when `enableSsoAuth` param is `true`.

```js
import angular from 'angular';
import { useReket, ssoAuthHookFn } from '@ovh-ux/ovh-reket';

angular.service('MyService', ($q) => {
  const reketInstance = useReket();
  const responseErrorHook = (error) => {
    return ssoAuthHookFn(error).catch((hookFnError) => $q.reject(hookFnError));
  };

  reketInstance.config.hooks.response.set(null, responseErrorHook);

  // use your Reket instance
  reketInstance
    .get('/my/url')
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('called after then or catch');
    });
});
```
