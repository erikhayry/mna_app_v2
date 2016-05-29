import {Injectable} from 'angular2/core';

import {AudioInfo} from './audioInfo/audioInfo';
import {Sort} from './sort/sort';
import {Storage} from './storage/storage';

import {Album} from "../domain/album";
import {Track} from "../domain/track";
import {IteratorResultImpl as IteratorResult} from "../domain/iteratorResultImpl";
import {Iterator} from "../domain/iterator";

@Injectable()
export class AlbumService{
	albums:Iterator;
	audioInfo: AudioInfo;
	sort: Sort;
	storage:Storage;

	constructor(audioInfo: AudioInfo, sort: Sort, storage: Storage) {
		this.audioInfo = audioInfo;
		this.sort = sort;
		this.storage = storage;
	}

	private _getAlbum(album: IteratorResult): Promise<IteratorResult> {
		return !album.value || album.value.image ?
			new Promise<IteratorResult>(resolve => resolve(album)) :
			this.audioInfo.getAlbum(album.value.albumPersistentID)
				.then((albumData:Album) => {
					album.value = _.merge(albumData, {tracks: album.value.tracks});
					
					return new Promise<IteratorResult>(resolve => resolve(album));
				});
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
		return this.storage.addIgnoreListItem(album.albumPersistentID, album.albumTitle, album.artist)
			.then(() => this._getAlbum(this.albums.remove()))
	}
}
