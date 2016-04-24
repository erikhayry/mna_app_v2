import {Injectable} from 'angular2/core';
import {AudioInfo} from './audioInfo/audioInfo';
import {Sort} from './sort/sort';
import {Album} from "../domain/album";
import {TrackImpl as Track} from "../domain/trackImpl";
import {IteratorResultImpl} from "../domain/iteratorResultImpl";
import {AlbumIterator} from "../domain/iterator";
import {Storage} from './storage/storage';

@Injectable()
export class AlbumService{
	albums:AlbumIterator;
	audioInfo: AudioInfo;
	sort: Sort;
	storage:Storage;

	constructor(audioInfo: AudioInfo, sort: Sort, storage: Storage) {
		console.log('AlbumService.constructor');
		this.audioInfo = audioInfo;
		this.sort = sort;
		this.storage = storage;
	}

	private _getAlbum(album:IteratorResultImpl):Promise<IteratorResultImpl> {
		console.log('AlbumService._getAlbum', album);

		//TODO better way to decide if album is already fetched
		return album.value.image ?
			new Promise<IteratorResultImpl>((resolve) => resolve(album)) :
			this.audioInfo.getAlbum(album.value.albumPersistentID)
				.then(albumData => {
					//TODO lodash merge
					albumData.tracks = album.value.tracks;
					album.value = albumData;
					return new Promise<IteratorResultImpl>((resolve) => resolve(album));
				});
	}

	private _sortToAlbums(trackData:Array<Track>):Promise<Array<Album>> {
		console.log('AlbumService._sortToAlbums', trackData);
		return this.sort.sortToAlbums(trackData)
	}

	private _init():Promise<IteratorResultImpl>{
		console.log('AlbumService._init');
		let that = this;

		return this.audioInfo.getTracks()
			.then((tracks) => that._sortToAlbums((<Array<Track>>tracks)))
			.then((albums) => {
				that.albums = new AlbumIterator(<Array<Album>>albums);
				return that._getAlbum(that.albums.next())
			}, error => {
				console.log(error)
			});
	}

	getAlbums = ():Promise<IteratorResultImpl> => {
		console.log('AlbumService.getAlbums', this.albums);
		return this._init();
	};

	getNext = ():Promise<IteratorResultImpl> => {
		console.log('AlbumService.getNext', this.albums);
		return !this.albums ? this._init() : this._getAlbum(this.albums.next());
	};

	getPrev = ():Promise<IteratorResultImpl> => {
		console.log('AlbumService.getPrev', this.albums);
		return !this.albums ? this._init() : this._getAlbum(this.albums.prev());
	};

	ignore = (albums:IteratorResultImpl):Promise<IteratorResultImpl> => {
		console.log('AlbumService.ignore', albums);
		let album = albums.value;
		return this.storage.addIgnoreListItem(album.albumPersistentID, album.albumTitle, album.artist)
			.then(() => this._getAlbum(this.albums.remove()))
	}
}
