import {Album} from "./album";
import {IteratorResultImpl} from "./iteratorResultImpl";
export class AlbumIterator{
    private _arr:Array<Album>;
    private _index:number;
    
    constructor(arr:Array<Album>) {
        console.log('AlbumIterator', arr);
        this._arr = arr;
        this._index = -1;
    }

    private _ret = ():IteratorResultImpl => ({value: this._arr[this._index], prev: this._index > 0, next: this._index < this._arr.length});
    private _next = ():IteratorResultImpl => {
        console.log('AlbumIterator._next', this._index, this._arr);
        return this._index == this._arr.length || (this._index < this._arr.length && !this._arr[++this._index].ignored) ?
            this._ret() : this._next();

    };

    private _prev = ():IteratorResultImpl => {
        console.log('AlbumIterator._prev', this._index, this._arr);
        return this._index <= 0 || (this._index > 0 && !this._arr[--this._index].ignored) ?
            this._ret() : this._prev();

    };

    next = ():IteratorResultImpl => this._next();
    prev = ():IteratorResultImpl => this._prev();
}