# Forest JS

Vault Library for NodeJS modified for Bareksa Environment Specific Usecase

# Installation

```sh
npm install https://github.com/Bareksa/forest-js.git
```

# Example Usage

```javascript
const { Forest } = require('forest')

Forest.init('token', 'localhost:8200')

Forest.getKeyValue('foo')
    // handle vault key value data
    .then((data) => {})
    // handle error
    .catch(console.error)
```

# [API Docs](https://bareksa.github.io/forest-js/index.html)
