/// <reference path="../../../typings/lodash/lodash.d.ts" />
import {Injectable} from 'angular2/core';

import * as _ from 'lodash';

import {Track} from "../../domain/track";
import {Album} from "../../domain/album";
import {IgnoredAlbum} from "../../domain/ignoredAlbum";
import {Preferences} from "../../domain/preferences";
import {ScoreImpl as Score} from "../../domain/scoreImpl";

import {Storage} from "../../services/storage/storage";

const RATING_MAX = 5;

@Injectable()
export class Sort{
	storage: Storage;

	constructor(storage:Storage) {
		console.log('Sort.constructor');
		this.storage = storage;
	}

	private getScore(playCount: number, playCountMax: number, rating: number): number {
		let playCountFactor = playCountMax > 0 ? playCountMax / RATING_MAX : 1;

		return (rating * playCountFactor) + playCount;
 	}

	private setScore(track:Track, considerPlayCount: boolean, considerRating: boolean, playCountMax: number): Track {
		let playCount: number = considerPlayCount && track.playCount ? track.playCount : 0,
			rating: number = considerRating && track.rating ? track.rating : 0;

		return _.merge(track, { score: this.getScore(playCount, playCountMax, rating) });
	}

	private shouldIncludeTrack(tracks: Array<Track>, ignoredAlbumList: Array<IgnoredAlbum>, considerPlayCount: boolean, considerNumberOfItems: boolean): boolean{
		return !_.some(ignoredAlbumList, { 'id': tracks[0].albumPersistentID }) &&
			!(!considerNumberOfItems && !considerPlayCount && tracks[0].rating === 0)
	}

	private sortByAlbum(album:Album, considerPlayCount: boolean, considerRating: boolean): number {
		return considerRating || considerPlayCount ? 
			-album.tracks.reduce((prev: number, curr: Track) => prev + curr.score, 0) : - album.tracks.length
	}

	private sort(tracks: Array<Track>, ignoredAlbumList:Array<IgnoredAlbum>, considerNumberOfItems: boolean, considerPlayCount: boolean, considerRating: boolean): Array<Album> {
		  let playCountMax = Math.max(...tracks.map(track => track.playCount));

		  return _.chain(tracks)
			  .map((track:Track) => 
			  	this.setScore(track, considerPlayCount, considerRating, playCountMax)
			  )
			  .groupBy('albumPersistentID')
			  .filter((tracks: Array<Track>) => 
			  	this.shouldIncludeTrack(tracks, ignoredAlbumList, considerPlayCount, considerNumberOfItems)
			  )
			  .map((tracks: Array<Track>) => 
			  	new Album(tracks[0].albumPersistentID, tracks)
			  )
			  .sortBy((album: Album) => 
			  	this.sortByAlbum(album, considerPlayCount, considerRating)
			  )
			  .value();
 	}

	sortToAlbums(tracks:Array<Track>):Promise<Array<Album>> {
		console.log('Sort.sortToAlbums', tracks);

		if(tracks.length == 0){
			return new Promise<Array<Album>>((resolve) => resolve([]))
		}

		return new Promise<Array<Album>>((resolve, reject) =>{
			Promise.all<Promise<Preferences> | Promise<Array<IgnoredAlbum>>>([
				this.storage.getPreferences(),
				this.storage.getIgnoreList()
			]).then((data: [any, any]) => {
				let _preferences: Preferences = data[0],
					ignoredAlbumList: Array<IgnoredAlbum> = data[1],
					
					_considerNumberOfItems = _preferences['relevance.number-of-items'].checked,
					_considerPlayCount = _preferences['relevance.play-count'].checked,
					_considerRating = _preferences['relevance.rating'].checked;

				resolve(this.sort(tracks, ignoredAlbumList, _considerNumberOfItems, _considerPlayCount, _considerRating));

			}, (error) => {
				reject(error);
			})
		})
	}
}
