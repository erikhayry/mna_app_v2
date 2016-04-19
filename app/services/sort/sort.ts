/// <reference path="../../../typings/lodash/lodash.d.ts" />
import {Injectable} from 'angular2/core';
import * as _ from 'lodash';
import {TrackImpl} from "../../domain/trackImpl";
import {Album} from "../../domain/album";
import {Storage} from "../../services/storage/storage";
import {Track} from "../../domain/track";

@Injectable()
export class Sort{
	storage: Storage;

	constructor(storage:Storage) {
		console.log('Sort.constructor');
		this.storage = storage;
	}

	sortToAlbums(tracks:Array<TrackImpl>):Promise<Array<Album>> {
		console.log('Sort.sortToAlbums', tracks);

		if(tracks.length == 0){
			return new Promise<Array<Album>>((resolve) => resolve([]))
		}

		return new Promise<Array<Album>>((resolve, reject) =>{
			this.storage.getIgnoreList().then(ignoredAlbumList => {
				resolve(
					_.chain(tracks)
						//.filter(track => )
						.groupBy('albumPersistentID')
						.sortBy(a => -a.length)
						.map(tracks => new Album(tracks[0].albumPersistentID, tracks, _.some(ignoredAlbumList, {'id': tracks[0].albumPersistentID})))
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
