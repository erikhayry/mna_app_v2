import { Pipe, PipeTransform } from 'angular2/core';
import {Track} from '../domain/track';

@Pipe({ name: 'withRating' })
export class WithRatingPipe implements PipeTransform {
  transform(albums:Array<Track>, args: any[]) {
  	console.log('WithRatingPipe', albums, args);
  	let _showCompleteAlbum = args[0];
    return _showCompleteAlbum ? albums : albums.filter(album => parseInt(album.rating) > 0);
  }
}