import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {StorageImpl} from './storageImpl';
import {Database, DbError, TX} from '../../domain/databaseImpl';
import {Preference} from '../../domain/preference';
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Sort} from "../sort/sort";


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
        this.db.transaction(this.queryDB, this.errorCB);
    }

    private populateDB(tx:TX):void {
        console.log('Storage.populateDB', tx);
        //tx.executeSql('DROP TABLE Settings')
        (<TX>tx).executeSql('CREATE TABLE IF NOT EXISTS Settings (text PRIMARY KEY, checked BOOLEAN NOT NULL)', this.errorCB, function (tx, res) {
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['Use Ratings', 1]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['Another Setting', 0]);
        });

        //tx.executeSql('DROP TABLE Ignore')
        tx.executeSql('CREATE TABLE IF NOT EXISTS Ignore (id TEXT PRIMARY KEY, name TEXT)')
    }

    private queryDB(tx:TX):void {
        console.log('Storage.queryDB', tx);
        tx.executeSql('SELECT * FROM Settings', [], this.querySuccess, this.errorCB);
    }

    private querySuccess(tx:TX, results)     {
        console.log('Storage.querySuccess', tx, results);
        return results;
    }

    getIgnoreList() {
        console.log('Storage.getIgnoreList');

        let that = this;
        this.db = this.openDB();

        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM Ignore', [], (tx, res) => {
                    let _len = res.rows.length,
                        _ret = [];
                    for (let i = 0; i < _len; i++) {
                        _ret.push(res.rows.item(i))
                    }
                    resolve(_ret);
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    addIgnoreListItem(id:String, name:String):Promise<Array<IgnoredAlbum>> {
        console.log('Storage.addIgnoreListItem', id, name);
        let that = this;
        this.db = this.openDB();
        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('INSERT OR IGNORE INTO Ignore (id, name) VALUES(?, ?)', [id, name], (tx, res) => {
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


    getPreferences():Promise<Array<Preference>> {
        console.log('Storage.getPreferences');
        let that = this;
        this.db = this.openDB();

        return new Promise<Array<Preference>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Settings', [], (tx, res) => {
                    var _len = res.rows.length,
                        _ret = [];
                    for (var i = 0; i < _len; i++) {
                        _ret.push(res.rows.item(i))
                    }

                    resolve(_ret.map(preference => {
                        (<Preference>preference).checked = preference.checked ? true : false;
                        return preference
                    }));
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    setPreferences(key:String, value:String):Promise<Array<Preference>>{
        console.log('Storage.setPreferences', key, value)
        let that = this;
        let val = value ? 1 : 0;
        this.db = this.openDB();

        return new Promise<Array<Preference>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('UPDATE Settings SET checked = ? WHERE text = ?', [val, key], (tx, res) => {
                    resolve(that.getPreferences());
                }, that.errorCB);
            }, this.errorCB);
        })
    }
}
