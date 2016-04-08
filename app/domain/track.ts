import {TrackImpl} from "./trackImpl";
export class Track implements TrackImpl {
    title:String;
    albumTitle:String;
    artist:String;
    genre:String;
    persistentID:String;
    albumPersistentID:String;
    playCount:String;
    rating:String;
    image:String;
    totalRating:number;


    constructor(title:String, albumTitle:String, artist:String, genre:String, persistentID:String, albumPersistentID:String, rating:String) {
        this.title = title;
        this.albumTitle = albumTitle;
        this.artist = artist;
        this.genre = genre;
        this.persistentID = persistentID;
        this.albumPersistentID = albumPersistentID;
        this.rating = rating;
    }
}
