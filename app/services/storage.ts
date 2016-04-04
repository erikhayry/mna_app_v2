import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {StorageImpl} from './storageImpl';
import {Database, DbError, TX} from '../domain/databaseImpl';
import {Preference} from '../domain/preference';
import {IgnoredAlbum} from "../domain/ignoredAlbum";

@Injectable()
export class Storage implements StorageImpl {
    private db:Database;

    constructor(platform:Platform){
        console.log('Storage.constructor')
        platform.ready().then(() => {
            this.onDeviceReady()
        })
    }

    private openDB = (): Database => (<any>window).sqlitePlugin.openDatabase({name: 'mna.db', iosDatabaseLocation: 'default'});

    private onDeviceReady():void {
        this.db = this.openDB();
        this.db.transaction(this.populateDB, this.errorCB, this.successCB);
    }

    private errorCB(err:DbError):void {
        console.error('Error processing SQL: ' + err.code);
    }

    private successCB():void {
        this.db = this.openDB();
        this.db.transaction(this.queryDB, this.errorCB);
    }

    private populateDB(tx) {
        //tx.executeSql('DROP TABLE Settings')
        (<TX>tx).executeSql('CREATE TABLE IF NOT EXISTS Settings (text PRIMARY KEY, checked BOOLEAN NOT NULL)', this.errorCB, function(tx, res){
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['Use Ratings', 1]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ['Another Setting', 0]);
        });

        //tx.executeSql('DROP TABLE Ignore')
        tx.executeSql('CREATE TABLE IF NOT EXISTS Ignore (id TEXT PRIMARY KEY, name TEXT)')
    }

    private queryDB(tx:TX) {
        tx.executeSql('SELECT * FROM Settings', [], this.querySuccess, this.errorCB);
    }

    private querySuccess(tx:TX, results) {
        return results;
    }
    
    
    
    getIgnoreList(){
        let that = this;
        this.db = this.openDB();

        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM Ignore', [],  (tx, res)  => {
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

    addIgnoreListItem(id:any, name:any) {
        let that = this;
        console.log(id, name)
        this.db = this.openDB();
        return new Promise<Array<IgnoredAlbum>>((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql('INSERT OR IGNORE INTO Ignore (id, name) VALUES(?, ?)', [id, name], (tx, res) => {
                    resolve(that.getIgnoreList());
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    deleteIgnoreListItem(id:any) {
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


    getPreferences(){
        console.log('storage: getPreferences')
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
    
    setPreferences(key:String, value:String) {
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
