import { BasePlugin, utils } from 'lisk-sdk';
import {S3Adapter, S3AdapterParams} from "./adapters/s3.adapter";
import {join} from "path";
import {getDefaultPath} from "./utils";
import * as tar from 'tar';
import {AvailableAdapters, BackupPluginOptions, Adapter} from './types';
import {ReadStream} from 'fs';

export class BackupPlugin extends BasePlugin {
    static get alias() {
        return 'backup';
    };

    static get info(){
        return {
            author: 'Jonathan MASSUCHETTI',
            version: '1.0.0',
            name: 'lisk-plugin-backup',
        };
    };

    options: BackupPluginOptions<any>;

    get defaults() {
        return {
            type: 'object',
            properties: {
                forgerInfo: {
                    type: 'object',
                    properties: {
                        enable: {
                            type: 'boolean',
                        },
                        adapter: {
                            enum: AvailableAdapters,
                        },
                        adapterParams: {
                            type: 'object',
                        },
                    }
                },
            },
            default: {
                forgerInfo: {
                    enable: false,
                }
            }
        }
    };

    get events() {
        return [];
    }

    get actions() {
        return {};
    }

    async load(channel) {
        const options = utils.objects.mergeDeep({}, this.defaults.default, this.options) as BackupPluginOptions<any>;

        let forgerInfoAdapter: Adapter;

        switch (options.forgerInfo.adapter) {
            case 's3': forgerInfoAdapter = new S3Adapter(options.forgerInfo.adapterParams as S3AdapterParams);
        }

        channel.subscribe('forger:block:created', async () => {
            const rs: ReadStream = tar.create({
                  gzip: true,
                  cwd: join(getDefaultPath(), 'data'),
              }, ['forger.db']);

            await forgerInfoAdapter.backup(rs);
            console.info("forger-info backup");
        });
    };

    unload(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
