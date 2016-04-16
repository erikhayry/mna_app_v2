/// <reference path="../../../typings/lodash/lodash.d.ts" />
import {Injectable} from 'angular2/core';
import * as _ from 'lodash';
import {TrackImpl} from "../../domain/trackImpl";
import {Album} from "../../domain/album";
import {Storage} from "../../services/storage/storage";

@Injectable()
export class Sort{
	storage: Storage;

	constructor(storage:Storage) {
		console.log('Sort.constructor');
		this.storage = storage;
	}

	sortToAlbums(tracks:Array<TrackImpl>):Promise<Array<Album>> {
		console.log('Sort.sortToAlbums', tracks);

		return new Promise<Array<Album>>((resolve, reject) =>{
			this.storage.getIgnoreList().then(ignoredAlbumList => {
				resolve(
					_.chain(tracks)
						.filter(track => !_.some(ignoredAlbumList, {'id': track.albumPersistentID}))
						.groupBy('albumPersistentID')
						.sortBy(a => -a.length)
						.value()
				);
			}, (error) => {
				reject(error);
			})
		})
	}

/*	sortByRating(tracks:Array<TrackImpl>):Array<TrackImpl> {
		console.log('Sort.sortByRating', tracks);
		return _.chain(tracks).groupBy('albumPersistentID').map((a) => {
			return _.extend((<TrackImpl>{}), a[0], {
				totalRating: _.reduce(a, (b:number, c: TrackImpl):number  => {
					return b + Number(c.rating);
				}, 0)
			})
		}).sortBy((a:TrackImpl) => -a.totalRating).value()
	}*/
}
