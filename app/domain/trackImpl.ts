import {ScoreImpl} from "./scoreImpl";
export interface TrackImpl {
    title?:string;
    albumTitle?:string;
    artist?:string;
    genre?:string;
    persistentID?:string;
    albumPersistentID?:string;
    playCount?:number;
    rating?:number;
    image?:string;
    totalRating?:number;
    score:number;
}
