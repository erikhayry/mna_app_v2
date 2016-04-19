import {Track} from "./track";

export class Album {
    //iOSAudioInfo data
    artist:String;
    genre:String;
    persistentID:String;
    albumPersistentID:String;
    playCount:String;
    rating:String;
    image:String;
    albumTitle:String;

    //MNA data
    totalRating:number;
    tracks:Array<Track>;
    ignored:Boolean;


    constructor(albumPersistentID:String, tracks:Array<Track>, ignored:Boolean) {
        this.albumPersistentID = albumPersistentID;
        this.tracks = tracks;
        this.ignored = ignored;
    }
}
