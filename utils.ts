import {join} from "path";
import * as os from "os";

const defaultDir = '.lisk';
const defaultFolder = 'lisk-core';

export const getDefaultPath = (): string => join(os.homedir(), defaultDir, defaultFolder);
