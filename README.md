# Forest JS

Vault Library for NodeJS modified for Bareksa Environment Specific Usecase

# Installation

```bash
npm install https://github.com/Bareksa/forest-js.git
```

# Example Usage

```javascript
const { Forest } = require('forest')

// Using https here will automatically attempts to use secure connection
// By default uses 'kv' engine. This can be set in the third param, which is config object
// See api docs for more detail.
// init only need to be called once in the app entry point.
Forest.init('token', 'http://localhost:8200')

// Initiate Forest as global manager to enable getString methods globally
// Run this early as well if using global management
Forest.manageKeyValue('some-conf')
    .then(() => {
        const possibleStringKey = Forest.getString('somekey') // get value of key, but handled as if the value is string. No casting is done.
        const parseStringKey = Forest.parseString('somekey') // get value of key, but value is coerced to string. If value is object or array, it will be JSON stringified.
        const nestedKey = Forest.getString('some.nested.key') // if value is an object, you can get access to nested key this way.
        // There are more helpers. Check API Docs
    })
    .catch(console.error)
```

# [API Docs](https://bareksa.github.io/forest-js/index.html)
