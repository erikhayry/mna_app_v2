/// <reference path="../../../typings/lodash/lodash.d.ts" />
import {Injectable} from 'angular2/core';
import * as _ from 'lodash';
import {TrackImpl} from "../../domain/trackImpl";

@Injectable()
export class Sort{

	sortToAlbums(tracks:Array<TrackImpl>):Array<TrackImpl> {
		console.log('Sort.sortToAlbums', tracks);
		return _.chain(tracks)
			.groupBy('albumPersistentID')
			.sortBy(a => -a.length)
			.value()
	}

	sortByRating(tracks:Array<TrackImpl>):Array<TrackImpl> {
		console.log('Sort.sortByRating', tracks);
		return _.chain(tracks).groupBy('albumPersistentID').map((a) => {
			return _.extend((<TrackImpl>{}), a[0], {
				totalRating: _.reduce(a, (b:number, c: TrackImpl):number  => {
					return b + Number(c.rating);
				}, 0)
			})
		}).sortBy((a:TrackImpl) => -a.totalRating).value()
	}
}
