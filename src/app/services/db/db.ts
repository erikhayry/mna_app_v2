import {Injectable} from '@angular/core';

import {ListAlbum} from "../../domain/listAlbum";
import {Preferences} from "../../domain/preferences";
import {ListType} from "../../domain/listType";

import {Storage} from '@ionic/storage';
import {PreferenceType} from "../../domain/preferenceType";

@Injectable()
export class DB {
    private settingsDb: Storage;
    private wantedDb: Storage;
    private ownedDb: Storage;
    private ignoredDb: Storage;

    constructor() {
        this.settingsDb = new Storage(['sqlite', 'websql', 'indexeddb'], {name: '__settingsDb'});
        this.wantedDb = new Storage(['sqlite', 'websql', 'indexeddb'], {name: '__wantedDb'});
        this.ownedDb = new Storage(['sqlite', 'websql', 'indexeddb'], {name: '__ownedDb'});
        this.ignoredDb = new Storage(['sqlite', 'websql', 'indexeddb'], {name: '__ignoredDb'});

        this.insertOrIgnore(this.settingsDb, 'settings_rating', false);
        this.insertOrIgnore(this.settingsDb, 'settings_playCount', true);
        this.insertOrIgnore(this.settingsDb, 'settings_numberOfItems', false);
    }

    private insertOrIgnore(db: Storage, key: PreferenceType, newVal: boolean): void {
        db.get(key).then((val) => {
            if (val !== false && val !== true) {
                db.set(key, newVal);
            }
        });
    }

    private getDb(type: ListType): Storage {
        let db: Storage;

        switch (type) {
            case ListType.Owned:
                db = this.ownedDb;
                break;
            case ListType.Wanted:
                db = this.wantedDb;
                break;
            case ListType.Ignored:
                db = this.ignoredDb;
                break;
        }

        return db;
    }

    getList(type: ListType): Promise<Array<ListAlbum>> {
        return new Promise<Array<ListAlbum>>((resolve, reject) => {
            let albums: Array<ListAlbum> = [];
            this.getDb(type).forEach((value, key, iterationNumber) => {
                albums.push(value)
            }).then(() => (resolve(albums)));
        });
    }

    addListItem(type: ListType, id: string, albumTitle: string, artist: string): Promise<Array<ListAlbum>> {
        return this.getDb(type).set(id, new ListAlbum(
            id,
            albumTitle,
            artist,
            new Date()
        )).then(() => this.getList(type))
    }

    deleteListItem(type: ListType, id: string): Promise<Array<ListAlbum>> {
        return this.getDb(type).remove(id).then(() => this.getList(type))
    }

    getPreferences(): Promise<Preferences> {
        return new Promise<Preferences>((resolve, reject) => {
            let _preferences: Preferences = (<Preferences>{});
            this.settingsDb.forEach((value, key, iterationNumber) => {
                _preferences[key] = {
                    checked: value,
                    label: key
                };
            }).then(() => (resolve(_preferences)));
        });
    }

    setPreferences(key: PreferenceType, value: boolean): Promise<Preferences> {
        return this.settingsDb.set(key, value).then(() => this.getPreferences())
    }
}
