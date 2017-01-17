export class ListAlbum{
    id: string;
    albumTitle: string;
    artist: string;
    date: Date


    constructor(id: string, albumTitle: string, artist: string, date: Date) {
        this.id = id;
        this.albumTitle = albumTitle;
        this.artist = artist;
        this.date = date;
    }
}
