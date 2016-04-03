import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {StorageImpl} from "./storageImpl";

@Injectable()
export class Storage implements StorageImpl {
    db;
    platform:Platform;

    constructor(platform:Platform){
        console.log('Storage init')
        this.platform = platform;
        this.platform.ready().then(() => {
            this.onDeviceReady()
        })
    }


    private onDeviceReady() {
        this.db = window.sqlitePlugin.openDatabase({name: "mna.db", iosDatabaseLocation: 'default'});
        this.db.transaction(this.populateDB, this.errorCB, this.successCB);
    }

    private errorCB(err) {
        console.error("Error processing SQL: " + err.code);
    }

    private successCB() {
        this.db = window.sqlitePlugin.openDatabase({name: "mna.db", iosDatabaseLocation: 'default'});
        this.db.transaction(this.queryDB, this.errorCB);
    }

    private populateDB(tx) {
        //tx.executeSql("DROP TABLE Settings")
        tx.executeSql("CREATE TABLE IF NOT EXISTS Settings (text PRIMARY KEY, checked BOOLEAN NOT NULL)", this.errorCB, function(tx, res){
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ["Use Ratings", 1]);
            tx.executeSql('INSERT OR IGNORE INTO Settings (text, checked) VALUES(?, ?)', ["Another Setting", 0]);
        });

        //tx.executeSql("DROP TABLE Ignore")
        tx.executeSql("CREATE TABLE IF NOT EXISTS Ignore (id TEXT PRIMARY KEY, name TEXT)")
    }

    private queryDB(tx) {
        tx.executeSql('SELECT * FROM Settings', [], this.querySuccess, this.errorCB);
    }

    private querySuccess(tx, results) {
        return results;
    }

    getPreferences(){
        let that = this;
        console.log('storage: getPreferences')
        this.db = window.sqlitePlugin.openDatabase({name: "mna.db", iosDatabaseLocation: 'default'});

        return new Promise((resolve, reject) => {
            this.db.transaction(function(tx){
                tx.executeSql('SELECT * FROM Settings', [], function(tx, res){
                    var _len = res.rows.length,
                        _ret = [];
                    for (var i = 0; i < _len; i++) {
                        _ret.push(res.rows.item(i))
                    }
                    resolve(_ret);
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    getIgnoreList(){
        let that = this;
        this.db = window.sqlitePlugin.openDatabase({name: "mna.db", iosDatabaseLocation: 'default'});

        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM Ignore', [], function (tx, res) {
                    var _len = res.rows.length,
                        _ret = [];
                    for (var i = 0; i < _len; i++) {
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
        this.db = window.sqlitePlugin.openDatabase({name: "mna.db", iosDatabaseLocation: 'default'});
        return new Promise((resolve, reject) => {
            this.db.transaction(function(tx){
                tx.executeSql('INSERT OR IGNORE INTO Ignore (id, name) VALUES(?, ?)', [id, name], function(tx, res){
                    resolve(that.getIgnoreList());
                }, that.errorCB);
            }, this.errorCB);
        })
    }

    deleteIgnoreListItem(id:any) {
        let that = this;
        this.db = window.sqlitePlugin.openDatabase({name: "mna.db", iosDatabaseLocation: 'default'});
        return new Promise((resolve, reject) => {
            this.db.transaction(function(tx){
                tx.executeSql('DELETE FROM Ignore WHERE id = ?', [id], function(tx, res){
                    resolve(that.getIgnoreList());
                }, that.errorCB);
            }, this.errorCB);
        })
    }


    setPreferences(key:any, value:any) {
        let that = this;
        console.log('storage: setPreferences')
        console.log(key, value)

        this.db = window.sqlitePlugin.openDatabase({name: "mna.db", iosDatabaseLocation: 'default'});
        return new Promise((resolve, reject) => {
            this.db.transaction(function(tx){
                tx.executeSql('UPDATE Settings SET checked = ? WHERE text = ?', [value, key], function(tx, res){
                    console.log('storage: setPreferences - done')
                    console.log(that)
                    resolve(that.getPreferences());
                }, that.errorCB);
            }, this.errorCB);
        })
    }
}
