### Lisk Plugin Backup 

![npm](https://img.shields.io/npm/v/lisk-plugin-backup)

## Installation

```bash
npm install lisk-plugin-backup
# or
yarn add lisk-plugin-backup
```

## Getting started

```js
// src/application/index.js

import { BackupPlugin } from 'lisk-plugin-backup';

app.registerPlugin(BackupPlugin);
```

## Usage

Once configured, the plugin will backup the data when appropriate.
Currently, only `forger-info` are supported, and they will be backup'ed every time you forge a block.


## Configuration

The plugin is designed to support a number of ways to backup the data.
So far only the `s3` adapter is available.

```js
// src/application/index.js

const appConfig = utils.objects.mergeDeep({}, configDevnet, {
  plugins:  {
      "backup": {
          "forgerInfo": {
              "enable": true,
              "adapter": "s3",
              "adapterParams": {
                  "accessKey": "YOUR_ACCESS_KEY",
                  "privateKey": "YOUR_PRIVATE_KEY",
                  "region": "YOUR_REGION",
                  "endpoint": "YOUR_BUCK_HOSTNAME_WITHOUT_SCHEME",
                  "objectPath": "DESTINATION_PATH"
              }
          }
      }
  },
});

const app = Application.defaultApplication(genesisBlockDevnet, appConfig); 
```
