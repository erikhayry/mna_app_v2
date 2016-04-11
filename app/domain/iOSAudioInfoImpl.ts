import {Album} from "./album";
import {Track} from "./track";
export interface iOSAudioInfoImpl{
    getTrack(success:Function, error:Function, trackId:String):Track
    getAlbum(success:Function, error:Function, trackId:String):Album
    getTracks(success:Function, error:Function):Array<Track>
}
