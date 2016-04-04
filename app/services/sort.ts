/// <reference path="../../typings/lodash/lodash.d.ts" />
import {Injectable} from 'angular2/core';
import * as _ from 'lodash';
import {TrackImpl} from "../domain/trackImpl";

@Injectable()
export class Sort{

	sortToAlbums(tracks:Array<TrackImpl>) {
		console.log('Sort.sortToAlbums', tracks);
		return _.chain(tracks).groupBy('albumPersistentID').sortBy(function(a) {
			return -a.length;
		}).value()
	}

	sortByRating(tracks: Array<TrackImpl>) {
		console.log('Sort.sortByRating', tracks);
		return _.chain(tracks).groupBy('albumPersistentID').map(function(a) {
			return _.extend({}, a[0], {
				totalRating: _.reduce(a, function(b, c: TrackImpl) {
					return b + parseInt(c.rating);
				}, 0)
			})
		}).sortBy(function(a:TrackImpl) {
			return -a.totalRating;
		}).value()
	}
}
