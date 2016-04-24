import {Score} from "./score";
export interface TrackImpl {
    title?:string;
    albumTitle?:string;
    artist?:string;
    genre?:string;
    persistentID?:string;
    albumPersistentID?:string;
    playCount?:string;
    rating?:string;
    image?:string;
    totalRating?:number;
    score:Score;
}
