import {Platform} from 'ionic-angular';
import {Injectable} from '@angular/core';

import {Database, DbError, TX, Rows} from './domain/databaseImpl';

import {Preference} from '../../domain/preference';
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Preferences} from "../../domain/preferences";

import { Storage } from '@ionic/storage';

@Injectable()
export class DB{
    private settingsDb:Storage;
    private ignoreDb:Storage;

    constructor() {
        this.settingsDb = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__settingsDb' });
        this.ignoreDb = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__ignoreDb' });

        this.insertOrIgnore(this.settingsDb, 'relevance.rating', 0);
        this.insertOrIgnore(this.settingsDb, 'relevance.play-count', 1);
        this.insertOrIgnore(this.settingsDb, 'relevance.number-of-items', 0);
    }

    private insertOrIgnore(db, key, newVal):void{
        db.get(key).then((val) => {
            if(!val){
                db.set(key, newVal);
            }
        });
    }

    getIgnoreList(): Promise<Array<IgnoredAlbum>>{
        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            let _ignoredAlbums:Array<IgnoredAlbum> = [];
            this.ignoreDb.forEach((value, key, iterationNumber) => {
                _ignoredAlbums.push(value)

            }).then(() => (resolve(_ignoredAlbums)));
        });
    }

    addIgnoreListItem(id: string, albumTitle: string, artist: string): Promise<Array<IgnoredAlbum>> {
        return this.ignoreDb.set(id, {
            albumTitle: albumTitle,
            artist: artist
        }).then(() => this.getIgnoreList())
    }

    deleteIgnoreListItem(id:string):Promise<Array<IgnoredAlbum>> {
        return this.ignoreDb.remove(id).then(() => this.getIgnoreList())
    }

    getPreferences():Promise<Preferences> {
        return new Promise<Preferences>((resolve, reject) => {
            let _preferences:Preferences = (<Preferences>{});
            this.settingsDb.forEach((value, key, iterationNumber) => {
                _preferences[key] = {
                    checked : value ? true : false,
                    label: key
                };

            }).then(() => (resolve(_preferences)));
        });
    }

    setPreferences(key:string, value:boolean):Promise<Preferences>{
        return this.settingsDb.set(key, value).then(() => this.getPreferences())
    }
}
