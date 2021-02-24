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

Forest.getKeyValue('some-conf')
    // handle vault key value data
    .then((data) => {})
    // handle error
    .catch(console.error)
```

# [API Docs](https://bareksa.github.io/forest-js/index.html)
