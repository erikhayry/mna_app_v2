import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';

import {Database, DbError, TX, Rows} from './domain/databaseImpl';

import {Preference} from '../../domain/preference';
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Preferences} from "../../domain/preferences";

@Injectable()
export class Storage{
    private db:Database;

    constructor(platform:Platform) {
        platform.ready().then(() => {
            this._onDeviceReady()
        })
    }

    private _openDB = ():Database => (<any>window).sqlitePlugin.openDatabase({name: 'mna.db', iosDatabaseLocation: 'default'});    

    private _onDeviceReady():void {
        this.db = this._openDB();
        this.db.transaction(this._populateDB, this._onError, this._onSuccess);
    }

    private _onError(error:DbError):void {
        console.error(error);
    }

    private _onSuccess():void {
        this.db = this._openDB();
        this.db.transaction(this._queryDB, this._onError);
    }

    private _populateDB(tx:TX):void {
        (<TX>tx).executeSql('CREATE TABLE IF NOT EXISTS Settings (text PRIMARY KEY, checked BOOLEAN NOT NULL)', this._onError, (tx, res) => {
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.rating', 0]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.play-count', 1]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.number-of-items', 0]);
        });

        tx.executeSql('CREATE TABLE IF NOT EXISTS Ignore (id TEXT PRIMARY KEY, albumTitle TEXT, artist TEXT)')
    }

    private _queryDB(tx:TX):void {
        tx.executeSql('SELECT * FROM Settings', [], this._querySuccess, this._onError);
    }

    private _querySuccess = (tx:TX, results):TX => results
  
    private _getItems(rows:Rows):Array<any>{
        let len = rows.length,
            ret = [];

        for (let i = 0; i < len; i++) {
            ret.push(rows.item(i))
        }

        return ret;
    }

    getIgnoreList(): Promise<Array<IgnoredAlbum>>{
        this.db = this._openDB();

        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Ignore', [], (tx, res) => {
                    resolve(this._getItems(res.rows));
                }, this._onError);
            }, this._onError);
        })
    }

    addIgnoreListItem(id: String, albumTitle: String, artist: String): Promise<Array<IgnoredAlbum>> {
        this.db = this._openDB();

        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('INSERT OR IGNORE INTO Ignore (id, albumTitle, artist) VALUES(?, ?, ?)', [id, albumTitle, artist], (tx, res) => {
                    resolve(this.getIgnoreList());
                }, this._onError);
            }, this._onError);
        })
    }

    deleteIgnoreListItem(id:String):Promise<Array<IgnoredAlbum>> {
        this.db = this._openDB();
        
        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('DELETE FROM Ignore WHERE id = ?', [id], (tx, res) => {
                    resolve(this.getIgnoreList());
                }, this._onError);
            }, this._onError);
        })
    }

    getPreferences():Promise<Preferences> {
        this.db = this._openDB();

        return new Promise<Preferences>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Settings', [], (tx, res) => {
                    let _preferences:Preferences = (<Preferences>{});
                    (this._getItems(res.rows).forEach(preference => {
                        (<Preference>preference).checked = preference.checked ? true : false;
                        _preferences[preference.text] = preference;
                    }));
                    resolve(_preferences)
                }, this._onError);
            }, this._onError);
        })
    }

    setPreferences(key:String, value:Boolean):Promise<Preferences>{
        this.db = this._openDB();

        return new Promise<Preferences>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('UPDATE Settings SET checked = ? WHERE text = ?', [value ? 1 : 0, key], (tx, res) => {
                    resolve(this.getPreferences());
                }, this._onError);
            }, this._onError);
        })
    }
}
