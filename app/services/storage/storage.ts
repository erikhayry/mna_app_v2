import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {StorageImpl} from './storageImpl';
import {Database, DbError, TX} from '../../domain/databaseImpl';
import {Preference} from '../../domain/preference';
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Sort} from "../sort/sort";
import {Rows} from "./domain/rows";


@Injectable()
export class Storage implements StorageImpl {
    private db:Database;

    constructor(platform:Platform) {
        console.log('Storage.constructor');
        platform.ready().then(() => {
            this._onDeviceReady()
        })
    }

    private _openDB = ():Database => {
        console.log('Storage._openDB');
        return (<any>window).sqlitePlugin.openDatabase({name: 'mna.db', iosDatabaseLocation: 'default'});
    };

    private _onDeviceReady():void {
        console.log('Storage.constructor');
        this.db = this._openDB();
        this.db.transaction(this._populateDB, this._errorCB, this._successCB);
    }

    private _errorCB(error:DbError):void {
        console.error('Storage._errorCB', error.code);
    }

    private _successCB():void {
        console.log('Storage._successCB');
        this.db = this._openDB();
        this.db.transaction(this._queryDB, this._errorCB);
    }

    private _populateDB(tx:TX):void {
        console.log('Storage._populateDB', tx);
        //tx.executeSql('DROP TABLE Settings')
        (<TX>tx).executeSql('CREATE TABLE IF NOT EXISTS Settings (text PRIMARY KEY, checked BOOLEAN NOT NULL)', this._errorCB, (tx, res) => {
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.rating', 0]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.play-count', 0]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['relevance.number-of-items', 1]);
        });

        //tx.executeSql('DROP TABLE Ignore')
        tx.executeSql('CREATE TABLE IF NOT EXISTS Ignore (id TEXT PRIMARY KEY, title TEXT, artist TEXT)')
    }

    private _queryDB(tx:TX):void {
        console.log('Storage._queryDB', tx);
        tx.executeSql('SELECT * FROM Settings', [], this._querySuccess, this._errorCB);
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
        this.db = this._openDB();

        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Ignore', [], (tx, res) => {
                    resolve(this._getItems(res.rows));
                }, that._errorCB);
            }, this._errorCB);
        })
    }

    addIgnoreListItem(id:String, title:String, artist:String):Promise<Array<IgnoredAlbum>> {
        console.log('Storage.addIgnoreListItem', id, title, artist);
        let that = this;
        this.db = this._openDB();
        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('INSERT OR IGNORE INTO Ignore (id, title, artist) VALUES(?, ?, ?)', [id, title, artist], (tx, res) => {
                    resolve(that.getIgnoreList());
                }, that._errorCB);
            }, this._errorCB);
        })
    }

    deleteIgnoreListItem(id:String):Promise<Array<IgnoredAlbum>> {
        console.log('Storage.deleteIgnoreListItem', id);
        let that = this;
        this.db = this._openDB();
        
        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('DELETE FROM Ignore WHERE id = ?', [id], (tx, res) => {
                    resolve(that.getIgnoreList());
                }, that._errorCB);
            }, this._errorCB);
        })
    }

    getPreferences():Promise<Array<Preference>> {
        console.log('Storage.getPreferences');
        let that = this;
        this.db = this._openDB();

        return new Promise<Array<Preference>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Settings', [], (tx, res) => {
                    resolve(this._getItems(res.rows).map(preference => {
                        (<Preference>preference).checked = preference.checked ? true : false;
                        return preference
                    }));
                }, that._errorCB);
            }, this._errorCB);
        })
    }

    setPreferences(key:String, value:Boolean):Promise<Array<Preference>>{
        console.log('Storage.setPreferences', key, value);
        let that = this;
        this.db = this._openDB();

        return new Promise<Array<Preference>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('UPDATE Settings SET checked = ? WHERE text = ?', [value ? 1 : 0, key], (tx, res) => {
                    resolve(that.getPreferences());
                }, that._errorCB);
            }, this._errorCB);
        })
    }
}
