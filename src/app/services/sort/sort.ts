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

	private getScore(playCount: number, playCountMax: number, rating: number): number {
		let playCountFactor = playCountMax > 0 ? playCountMax / RATING_MAX : 1;

		return (rating * playCountFactor) + playCount;
 	}

	private _setScore(track:Track, considerPlayCount: boolean, considerRating: boolean, playCountMax: number): Track {
		let playCount: number = considerPlayCount && track.playCount ? track.playCount : 0,
			rating: number = considerRating && track.rating ? track.rating : 0;

		return _.merge(track, { score: this.getScore(playCount, playCountMax, rating) });
	}

	private shouldIncludeTrack(tracks: Array<Track>, albumList: Array<ListAlbum>, considerPlayCount: boolean, considerNumberOfItems: boolean): boolean{
		return !_.some(albumList, { 'id': tracks[0].albumPersistentID }) &&
			!(!considerNumberOfItems && !considerPlayCount && tracks[0].rating === 0)
	}

	private sortByAlbum(album:Album, considerPlayCount: boolean, considerRating: boolean): number {
		return considerRating || considerPlayCount ? 
			-album.tracks.reduce((prev: number, curr: Track) => prev + curr.score, 0) : - album.tracks.length
	}

	private _sort(tracks: Array<Track>, albumList:Array<ListAlbum>, considerNumberOfItems: boolean, considerPlayCount: boolean, considerRating: boolean): Array<Album> {
		  let playCountMax = Math.max(...tracks.map(track => track.playCount));

		  return _.chain(tracks)
			  .map((track:Track) => 
			  	this._setScore(track, considerPlayCount, considerRating, playCountMax)
			  )
			  .groupBy('albumPersistentID')
			  .filter((tracks: Array<Track>) => 
			  	this.shouldIncludeTrack(tracks, albumList, considerPlayCount, considerNumberOfItems)
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
		if(tracks.length == 0){
			return new Promise<Array<Album>>((resolve) => resolve([]))
		}

		return new Promise<Array<Album>>((resolve, reject) =>{
			Promise.all<Promise<Preferences> | Promise<Array<ListAlbum>>>([
				this.db.getPreferences(),
				this.db.getList(ListType.Wanted),
				this.db.getList(ListType.Owned),
				this.db.getList(ListType.Ignored)
			]).then((data: [any, any]) => {
				let _preferences: Preferences = data[0],
					albumList: Array<ListAlbum> = (<Array<ListAlbum>>_.union(data[1], data[2], data[3])),
					
					_considerNumberOfItems = _preferences.settings_numberOfItems.checked,
					_considerPlayCount = _preferences.settings_playCount.checked,
					_considerRating = _preferences.settings_rating.checked;

				resolve(this._sort(tracks, albumList, _considerNumberOfItems, _considerPlayCount, _considerRating));

			}, (error) => {
				reject(error);
			})
		})
	}
}
