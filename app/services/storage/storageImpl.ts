import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Preference} from "../../domain/preference";
export interface StorageImpl {
    getIgnoreList():Promise<Array<IgnoredAlbum>>
    addIgnoreListItem(id:String, title:String, artist:String):Promise<Array<IgnoredAlbum>>
    deleteIgnoreListItem(id:String):Promise<Array<IgnoredAlbum>>
    getPreferences():Promise<Array<Preference>>
    setPreferences(key:String, value:Boolean):Promise<Array<Preference>>
}
