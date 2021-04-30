import {ReadStream} from "fs";
import {S3AdapterParams} from "./adapters/s3.adapter";

export const AvailableAdapters = ['s3', 'ftp'] as const;

export type BackupPluginAdapter = typeof AvailableAdapters[number];

export type BackupPluginAdapterParams<T> =
  T extends 's3' ? S3AdapterParams :
    never
  ;

export interface BackupPluginOptions<T extends BackupPluginAdapter> {
  forgerInfo: {
    enable: boolean;
    adapter: T;
    adapterParams: BackupPluginAdapterParams<T>;
  };
}

export abstract class Adapter {
  abstract async backup(rs: ReadStream);
}
