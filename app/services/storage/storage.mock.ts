import {Injectable} from 'angular2/core';
import {StorageImpl} from "./storageImpl";

@Injectable()
export class Storage {
    ignore: Array<any>;
    preferences: Array<any>;

    constructor(){
        this.ignore = [
            {name: 'test 1'}
        ];

        this.preferences = [
            {name: 'test 1'}
        ];
    }

    getIgnoreList() {
        return [
            {name: 'test 1'}
        ]
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
