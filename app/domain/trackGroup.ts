import {Track} from "./track";
export class TrackGroup{
    id:String;
    rating:Number;
    tracks: Array<Track>;
    next: String;
    previous:String;
}
