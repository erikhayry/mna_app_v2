/// <reference path="../../typings/lodash/lodash.d.ts" />
import {Injectable} from 'angular2/core';
import * as _ from 'lodash';

interface Track {
	totalRating: string;
	rating: string;
}

@Injectable()
export class Sort{
	sortToAlbums(tracks:Array<Track>) {
		console.log('_sortToAlbums')
		return _.chain(tracks).groupBy('albumPersistentID').sortBy(function(a) {
			return -a.length;
		}).value()
	}
	sortByRating(tracks: Array<Track>) {
		console.log('_sortByRating')
		return _.chain(tracks).groupBy('albumPersistentID').map(function(a) {
			return _.extend({}, a[0], {
				totalRating: _.reduce(a, function(b, c: Track) {
					return b + parseInt(c.rating);
				}, 0)
			})
		}).sortBy(function(a:Track) {
			return -a.totalRating;
		}).value()
	}
}
