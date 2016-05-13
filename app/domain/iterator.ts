import {IteratorResultImpl} from "./iteratorResultImpl";
export class Iterator{
    private _arr:Array<any>;
    private _index:number;
    
    constructor(arr:Array<any>) {
        console.log('Iterator', arr);
        this._arr = arr;
        this._index = -1;
    }

    private _ret = (index: number): IteratorResultImpl => ({ 
        value: this._arr[index], 
        prev: index > 0, 
        next: index < this._arr.length 
    });

    private _next = ():IteratorResultImpl => {
        console.log('Iterator._next', this._index, this._arr);       
        return this._index < this._arr.length ? this._ret(++this._index) : this._ret(this._index);
    };

    private _prev = ():IteratorResultImpl => {
        console.log('Iterator._prev', this._index, this._arr);        
        return this._index >= 0 ? this._ret(--this._index) : this._ret(this._index);

    };

    remove = ():IteratorResultImpl => {
        this._arr.splice(this._index, 1);
        return this._ret(this._index);
    };

    next = ():IteratorResultImpl => this._next();
    prev = ():IteratorResultImpl => this._prev();
}
