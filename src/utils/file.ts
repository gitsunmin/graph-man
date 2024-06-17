import * as fs from 'fs';
import { O, Option } from './options';

export const readJSONSync = <T>(path: string): Option<T> => {
    try {
        return fs.existsSync(path) ?
            O.Some(JSON.parse(fs.readFileSync(path, 'utf-8')) as T) :
            O.None();
    } catch (error) {
        return O.None();
    }
}