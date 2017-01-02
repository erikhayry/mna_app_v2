import {Injectable} from '@angular/core';
import _ from "lodash";
import {AudioInfo} from './audioInfo/audioInfo';
import {Sort} from './sort/sort';
import {DB} from './db/db';

import {Album} from "../domain/album";
import {Track} from "../domain/track";
import {IteratorResultImpl as IteratorResult} from "../domain/iteratorResultImpl";
import {Iterator} from "../domain/iterator";

@Injectable()
export class AlbumService{
	albums:Iterator;
	audioInfo: AudioInfo;
	sort: Sort;
	db:DB;

	constructor(audioInfo: AudioInfo, sort: Sort, db: DB) {
		this.audioInfo = audioInfo;
		this.sort = sort;
		this.db = db;
	}

	private _getAlbum(album: IteratorResult): Promise<IteratorResult> {
		if(!album.value || album.value.image){
			return new Promise<IteratorResult>(resolve => resolve(album));
		}
		else if(this.audioInfo){
			this.audioInfo.getAlbum(album.value.albumPersistentID)
				.then((albumData:Album) => {
					album.value = _.merge(albumData, {tracks: album.value.tracks});

					return new Promise<IteratorResult>(resolve => resolve(album));
				});
		}

		return null


	}

	private _sortToAlbums = (trackData:Array<Track>):Promise<Array<Album>> => this.sort.sortToAlbums(trackData)

	private _init = (): Promise<IteratorResult> => this.audioInfo.getTracks()
			.then(tracks => 
				this._sortToAlbums(tracks)
			)
			.then(albums => {
				this.albums = new Iterator(albums);
				return this._getAlbum(this.albums.next())
			});
	


	getAlbums = (): Promise<IteratorResult> => this._init();

	getNext = (): Promise<IteratorResult> => !this.albums ? this._init() : this._getAlbum(this.albums.next());

	getPrev = ():Promise<IteratorResult> => !this.albums ? this._init() : this._getAlbum(this.albums.prev());

	ignore = (albums: IteratorResult): Promise<IteratorResult> => {
		let album = (<Album>albums.value);
		return this.db.addIgnoreListItem(album.albumPersistentID, album.albumTitle, album.artist)
			.then(() => this._getAlbum(this.albums.remove()))
	}
}
