mage-module-admin
=================

Server counterpart to [mage-admin](https://github.com/mage/mage-admin)

Installation
-------------

```shell
npm install --save mage-module-admin
```

Usage
-----

### Module creation

> lib/modules/admin/index.ts

```typescript
import {
  AbstractAdminModule
} from 'mage-module-admin'

class AdminModule extends AbstractAdminModule {
}

export default new AdminModule()
```

This will automatically create `login`, `logout` and `registration` user commands; simply overload
those methods on the module if you wish to customize the behaviour.

License
-------

MIT
