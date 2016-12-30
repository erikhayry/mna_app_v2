import {Track} from "./track";

export class Album {
    //iOSAudioInfo data
    artist:string;
    genre:string;
    persistentID:string;
    albumPersistentID:string;
    playCount:number;
    rating:number;
    image:string;
    albumTitle:string;

    //MNA data
    totalRating:number;
    tracks:Array<Track>;

    constructor(albumPersistentID:string, tracks:Array<Track>) {
        this.albumPersistentID = albumPersistentID;
        this.tracks = tracks;
    }
}
