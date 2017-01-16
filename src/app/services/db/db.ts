import {Injectable} from '@angular/core';

import {ListAlbum} from "../../domain/listAlbum";
import {Preferences} from "../../domain/preferences";
import {ListType} from "../../domain/listType";

import { Storage } from '@ionic/storage';

@Injectable()
export class DB{
    private settingsDb:Storage;
    private wantedDb:Storage;
    private ownedDb:Storage;
    private ignoredDb:Storage;

    constructor() {
        this.settingsDb = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__settingsDb' });
        this.wantedDb = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__wantedDb' });
        this.ownedDb = new Storage(['sqlite', 'websql', 'indexeddb'], { name: 'ownedDb' });
        this.ignoredDb = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__ignoredDb' });

        //TODO as enum to match preference
        this.insertOrIgnore(this.settingsDb, 'settings_rating', 0);
        this.insertOrIgnore(this.settingsDb, 'settings_playCount', 1);
        this.insertOrIgnore(this.settingsDb, 'settings_numberOfItems', 0);
    }

    private insertOrIgnore(db, key, newVal):void{
        db.get(key).then((val) => {
            if(!val){
                db.set(key, newVal);
            }
        });
    }

    private getDb(type:ListType):Storage{
        let db:Storage;

        switch(type){
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

    getList(type:ListType): Promise<Array<ListAlbum>>{
        return new Promise<Array<ListAlbum>>((resolve, reject) => {
            let albums:Array<ListAlbum> = [];
            this.getDb(type).forEach((value, key, iterationNumber) => {
                albums.push(value)

            }).then(() => (resolve(albums)));
        });
    }

    addListItem(type:ListType, id: string, albumTitle: string, artist: string): Promise<Array<ListAlbum>> {
        return this.getDb(type).set(id, {
            albumTitle: albumTitle,
            artist: artist,
            id: id
        }).then(() => this.getList(type))
    }

    deleteListItem(type:ListType, id:string):Promise<Array<ListAlbum>> {
        return this.getDb(type).remove(id).then(() => this.getList(type))
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
