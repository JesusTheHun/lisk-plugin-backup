import {Adapter} from "../types";
import aws4 from 'aws4';
import * as https from 'https';
import pump from 'pump';
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

  async getObjectWriteStream() {
    const config = {
      accessKeyId: this.params.accessKey,
      secretAccessKey: this.params.privateKey,
      region: this.params.region,
      endpoint: this.params.endpoint,
    }

    const hash = aws4.sign({
      service: 's3',
      region: config.region,
      method: 'PUT',
      path: this.params.objectPath,
      host: config.endpoint,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }, config)

    return https.request({
      hostname: config.endpoint,
      port: 443,
      method: 'PUT',
      path: this.params.objectPath,
      headers: hash.headers
    })
  }
}
