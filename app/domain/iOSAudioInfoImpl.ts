import {Album} from "./album";
export interface iOSAudioInfoImpl{
    getTrack(success:Function, error:Function, trackId:String):Album
    getTracks(success:Function, error:Function):Array<Album>
}
