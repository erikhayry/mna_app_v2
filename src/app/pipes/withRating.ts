import {Pipe, PipeTransform} from '@angular/core';
import {Track} from '../domain/track';

@Pipe({name: 'withRating'})
export class WithRatingPipe implements PipeTransform {
    transform = (albums: Array<Track>, showCompleteAlbum: boolean) => {
        return showCompleteAlbum ? albums : albums.filter(album => album.rating > 0);
    }
}
