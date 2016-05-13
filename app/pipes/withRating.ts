import {Pipe, PipeTransform} from 'angular2/core';
import {Track} from '../domain/track';

@Pipe({ name: 'withRating' })
export class WithRatingPipe implements PipeTransform {
  transform(albums:Array<Track>, args: Array<boolean>) {
  	console.log('WithRatingPipe', albums, args);
  	return args.some(arg => arg) ? albums : albums.filter(album => album.rating > 0);
  }
}