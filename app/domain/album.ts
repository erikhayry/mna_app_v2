import {Track} from "./track";

export class Album {
    //iOSAudioInfo data
    title:String;
    artist:String;
    genre:String;
    persistentID:String;
    playCount:String;
    rating:String;
    image:String;

    //MNA data
    totalRating:number;
    tracks:Array<Track>;
}
