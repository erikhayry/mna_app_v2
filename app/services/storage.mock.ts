import {Injectable} from 'angular2/core';
import {AudioInfoService} from './audioInfoService';
import {StorageService} from "./storageService";

@Injectable()
export class Storage implements StorageService {
    getIgnoreList() {
    }

    addIgnoreListItem(id:any, name:any) {
    }

    deleteIgnoreListItem(id:any) {
    }

    getPreferences() {
    }

    setPreferences(key:any, value:any) {
    }
}
