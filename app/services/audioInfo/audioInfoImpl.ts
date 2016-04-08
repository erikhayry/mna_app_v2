import {TrackImpl as Track} from "../../domain/trackImpl";

export interface AudioInfoImpl {
	getTrack(id: String):Promise<Track>
	getTracks(shouldRefreshData:boolean):Promise<Array<Track>>
}
