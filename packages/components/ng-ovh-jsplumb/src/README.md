# jsPlumbService
Defines some jsPlumb functionnalities in a ngService.

## Methods
### jsplumbInit
Initialize jsplumb by calling its helper method `jsPlumb.ready`. See [jsplumb doc](http://www.jsplumb.org/doc/home.html#initializing) for more informations.

#### Returns

| Type | Description |
| :--: | :--: |
| Promise | When this method is called and the Promise resolved, you can do whatever you want with jsplumb. |

### importDefaults
Imports default options of jsplumb. See [jsplumb doc](http://www.jsplumb.org/doc/defaults.html) for available options.

#### Parameters

| Param | Type | Details |
| :--: | :--: | :--: |
| defaults | Object | Default options of jsplumb objects |
