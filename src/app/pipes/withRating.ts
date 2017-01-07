import { Pipe, PipeTransform } from '@angular/core';
import {Track} from '../domain/track';

@Pipe({ name: 'withRating' })
export class WithRatingPipe implements PipeTransform {
  transform = (albums:Array<Track>, args: Array<boolean>) => {
      console.log(albums, args);
  	//args.some(arg => arg) ? albums : albums.filter(album => album.rating > 0);

    return albums;
  }
}
