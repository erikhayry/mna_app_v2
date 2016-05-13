import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';

import {StorageImpl} from './storageImpl';
import {Database, DbError, TX, Rows} from './domain/databaseImpl';

import {Preference} from '../../domain/preference';
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Preferences} from "../../domain/preferences";

@Injectable()
export class Storage implements StorageImpl {
    private db:Database;

    constructor(platform:Platform) {
        console.log('Storage.constructor');
        platform.ready().then(() => {
            this.onDeviceReady()
        })
    }

    private openDB = ():Database => {
        console.log('Storage.openDB');
        return (<any>window).sqlitePlugin.openDatabase({name: 'mna.db', iosDatabaseLocation: 'default'});
    };

    private onDeviceReady():void {
        console.log('Storage.constructor');
        this.db = this.openDB();
        this.db.transaction(this.populateDB, this.errorCB, this.successCB);
    }

    private errorCB(error:DbError):void {
        console.error('Storage.errorCB', error.code);
    }

    private successCB():void {
        console.log('Storage.successCB');
        this.db = this.openDB();
        this.db.transaction(this._queryDB, this.errorCB);
    }

    private populateDB(tx:TX):void {
        console.log('Storage.populateDB', tx);
        //tx.executeSql('DROP TABLE Settings')
        (<TX>tx).executeSql('CREATE TABLE IF NOT EXISTS Settings (text PRIMARY KEY, checked BOOLEAN NOT NULL)', this.errorCB, (tx, res) => {
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.rating', 0]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.play-count', 0]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.number-of-items', 1]);
        });

        //tx.executeSql('DROP TABLE Ignore')
        tx.executeSql('CREATE TABLE IF NOT EXISTS Ignore (id TEXT PRIMARY KEY, title TEXT, artist TEXT)')
    }

    private _queryDB(tx:TX):void {
        console.log('Storage._queryDB', tx);
        tx.executeSql('SELECT * FROM Settings', [], this._querySuccess, this.errorCB);
    }

    private _querySuccess(tx:TX, results)     {
        console.log('Storage._querySuccess', tx, results);
        return results;
    }

    private _getItems(rows:Rows):Array<any>{
        let _len = rows.length,
            _ret = [];
        for (let i = 0; i < _len; i++) {
            _ret.push(rows.item(i))
        }

        return _ret;
    }

    getIgnoreList() {
        console.log('Storage.getIgnoreList');
        let that = this;
        this.db = this.openDB();

        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Ignore', [], (tx, res) => {
                    resolve(this._getItems(res.rows));
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    addIgnoreListItem(id:String, title:String, artist:String):Promise<Array<IgnoredAlbum>> {
        console.log('Storage.addIgnoreListItem', id, title, artist);
        let that = this;
        this.db = this.openDB();

        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('INSERT OR IGNORE INTO Ignore (id, title, artist) VALUES(?, ?, ?)', [id, title, artist], (tx, res) => {
                    resolve(that.getIgnoreList());
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    deleteIgnoreListItem(id:String):Promise<Array<IgnoredAlbum>> {
        console.log('Storage.deleteIgnoreListItem', id);
        let that = this;
        this.db = this.openDB();
        
        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('DELETE FROM Ignore WHERE id = ?', [id], (tx, res) => {
                    resolve(that.getIgnoreList());
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    getPreferences():Promise<Preferences> {
        console.log('Storage.getPreferences');
        let that = this;
        this.db = this.openDB();

        return new Promise<Preferences>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Settings', [], (tx, res) => {
                    let _preferences:Preferences = (<Preferences>{});
                    (this._getItems(res.rows).forEach(preference => {
                        (<Preference>preference).checked = preference.checked ? true : false;
                        _preferences[preference.text] = preference;
                    }));
                    resolve(_preferences)
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    setPreferences(key:String, value:Boolean):Promise<Preferences>{
        console.log('Storage.setPreferences', key, value);
        let that = this;
        this.db = this.openDB();

        return new Promise<Preferences>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('UPDATE Settings SET checked = ? WHERE text = ?', [value ? 1 : 0, key], (tx, res) => {
                    resolve(that.getPreferences());
                }, that.errorCB);
            }, this.errorCB);
        })
    }
}
