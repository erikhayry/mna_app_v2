import {IgnoredAlbum} from "../domain/ignoredAlbum";
import {Preference} from "../domain/preference";
export interface StorageImpl {
    getIgnoreList():Promise<Array<IgnoredAlbum>>
    addIgnoreListItem(id:any, name:any):Promise<Array<IgnoredAlbum>>
    deleteIgnoreListItem(id:any):Promise<Array<IgnoredAlbum>>
    getPreferences():Promise<Array<Preference>>
    setPreferences(key:any, value:any):Promise<Array<Preference>>
}
