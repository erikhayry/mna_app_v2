import {Pipe, PipeTransform} from '@angular/core';
import {ListAlbum} from "../domain/listAlbum";

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
    transform = (albums: Array<ListAlbum>, filter: string) => {
        if(!filter){
            return albums;
        }

        return albums.filter(album => {
            return album.albumTitle.indexOf(filter) > - 1 || album.artist.indexOf(filter) > -1
        });
    }
}
