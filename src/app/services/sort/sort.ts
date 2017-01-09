import {Injectable} from '@angular/core';

import _ from "lodash";

import {Track} from "../../domain/track";
import {Album} from "../../domain/album";
import {ListAlbum} from "../../domain/listAlbum";
import {Preferences} from "../../domain/preferences";
import {ListType} from "../../domain/listType";

import {DB} from "../db/db";

const RATING_MAX = 5;

@Injectable()
export class Sort{
	db: DB;

	constructor(db:DB) {
		this.db = db;
	}

	private _getScore(playCount: number, playCountMax: number, rating: number): number {
		let playCountFactor = playCountMax > 0 ? playCountMax / RATING_MAX : 1;

		return (rating * playCountFactor) + playCount;
 	}

	private _setScore(track:Track, considerPlayCount: boolean, considerRating: boolean, playCountMax: number): Track {
		let playCount: number = considerPlayCount && track.playCount ? track.playCount : 0,
			rating: number = considerRating && track.rating ? track.rating : 0;

		return _.merge(track, { score: this._getScore(playCount, playCountMax, rating) });
	}

	private _shouldIncludeTrack(tracks: Array<Track>, ignoredAlbumList: Array<ListAlbum>, considerPlayCount: boolean, considerNumberOfItems: boolean): boolean{
		return !_.some(ignoredAlbumList, { 'id': tracks[0].albumPersistentID }) &&
			!(!considerNumberOfItems && !considerPlayCount && tracks[0].rating === 0)
	}

	private _sortByAlbum(album:Album, considerPlayCount: boolean, considerRating: boolean): number {
		return considerRating || considerPlayCount ? 
			-album.tracks.reduce((prev: number, curr: Track) => prev + curr.score, 0) : - album.tracks.length
	}

	private _sort(tracks: Array<Track>, ignoredAlbumList:Array<ListAlbum>, considerNumberOfItems: boolean, considerPlayCount: boolean, considerRating: boolean): Array<Album> {
		  let playCountMax = Math.max(...tracks.map(track => track.playCount));

		  return _.chain(tracks)
			  .map((track:Track) => 
			  	this._setScore(track, considerPlayCount, considerRating, playCountMax)
			  )
			  .groupBy('albumPersistentID')
			  .filter((tracks: Array<Track>) => 
			  	this._shouldIncludeTrack(tracks, ignoredAlbumList, considerPlayCount, considerNumberOfItems)
			  )
			  .map((tracks: Array<Track>) => 
			  	new Album(tracks[0].albumPersistentID, tracks)
			  )
			  .sortBy((album: Album) => 
			  	this._sortByAlbum(album, considerPlayCount, considerRating)
			  )
			  .value();
 	}

	sortToAlbums(tracks:Array<Track>):Promise<Array<Album>> {
		console.log('sortToAlbums', tracks)
		if(tracks.length == 0){
			return new Promise<Array<Album>>((resolve) => resolve([]))
		}

		return new Promise<Array<Album>>((resolve, reject) =>{
			Promise.all<Promise<Preferences> | Promise<Array<ListAlbum>>>([
				this.db.getPreferences(),
				this.db.getList(ListType.Ignore)
			]).then((data: [any, any]) => {
				let _preferences: Preferences = data[0],
					ignoredAlbumList: Array<ListAlbum> = data[1],
					
					_considerNumberOfItems = _preferences['relevance.number-of-items'].checked,
					_considerPlayCount = _preferences['relevance.play-count'].checked,
					_considerRating = _preferences['relevance.rating'].checked;

				resolve(this._sort(tracks, ignoredAlbumList, _considerNumberOfItems, _considerPlayCount, _considerRating));

			}, (error) => {
				reject(error);
			})
		})
	}
}
