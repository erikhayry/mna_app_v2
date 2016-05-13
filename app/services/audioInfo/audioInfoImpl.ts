import {TrackImpl as Track} from "../../domain/trackImpl";
import {Album} from "../../domain/album";

export interface AudioInfoImpl {
	getTrack(id: String):Promise<Track>
	getAlbum(id: String):Promise<Album>
	getTracks():Promise<Array<Track>>
}
