import {TrackImpl} from "./trackImpl";
import {ScoreImpl} from "./scoreImpl";
export class Track implements TrackImpl {
    title:string;
    albumTitle:string;
    artist:string;
    genre:string;
    persistentID:string;
    albumPersistentID:string;
    playCount:string;
    rating:string;
    image:string;
    totalRating:number;
    score: ScoreImpl;

    constructor(title:string, albumTitle:string, artist:string, genre:string, persistentID:string, albumPersistentID:string, rating:string) {
        this.title = title;
        this.albumTitle = albumTitle;
        this.artist = artist;
        this.genre = genre;
        this.persistentID = persistentID;
        this.albumPersistentID = albumPersistentID;
        this.rating = rating;
    }
}
