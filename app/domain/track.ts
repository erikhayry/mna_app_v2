export class Track{
    title:string;
    albumTitle:string;
    artist:string;
    genre:string;
    persistentID:string;
    albumPersistentID:string;
    playCount:number;
    rating:number;
    image:string;
    totalRating:number;
    score: number;

    constructor(title:string, albumTitle:string, artist:string, genre:string, persistentID:string, albumPersistentID:string, rating:number) {
        this.title = title;
        this.albumTitle = albumTitle;
        this.artist = artist;
        this.genre = genre;
        this.persistentID = persistentID;
        this.albumPersistentID = albumPersistentID;
        this.rating = rating;
    }
}
