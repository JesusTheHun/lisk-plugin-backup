import {Adapter} from "../types";
import {RequestSigner} from 'aws4';
import * as https from 'https';
import * as pump from 'pump';
import {ReadStream} from "fs";

export interface S3AdapterParams {
  accessKey: string;
  privateKey: string;
  region: string;
  endpoint: string;
  objectPath: string;
}

export class S3Adapter implements Adapter {
  private params: S3AdapterParams;

  constructor(params: S3AdapterParams) {
    this.params = params;
  }

  async backup(rs: ReadStream) {
    const ws = await this.getObjectWriteStream()
    pump(rs, ws, (err?: Error) => {
      if (err) throw err;
    })
  }

  protected async getObjectWriteStream() {
    const config = {
      accessKeyId: this.params.accessKey,
      secretAccessKey: this.params.privateKey,
      region: this.params.region,
      endpoint: this.params.endpoint,
    }

    const hash = new RequestSigner({
      service: 's3',
      region: config.region,
      method: 'PUT',
      path: this.params.objectPath,
      host: config.endpoint,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }, config).sign();

    return https.request({
      hostname: config.endpoint,
      port: 443,
      method: 'PUT',
      path: this.params.objectPath,
      headers: hash.headers
    })
  }
}
