import {Injectable} from 'angular2/core';
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
