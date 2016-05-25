import {IteratorResultImpl} from "./iteratorResultImpl";
export class Iterator{
    private _arr:Array<any>;
    private _index:number;
    
    constructor(arr:Array<any>) {
        this._arr = arr;
        this._index = -1;
    }

    private _ret = (index: number): IteratorResultImpl => ({ 
        value: this._arr[index], 
        prev: index > 0, 
        next: index < this._arr.length - 1
    });

    private _next = ():IteratorResultImpl => this._index < this._arr.length - 1 ? this._ret(++this._index) : this._ret(this._index);

    private _prev = ():IteratorResultImpl => this._index >= 0 ? this._ret(--this._index) : this._ret(this._index);

    remove = ():IteratorResultImpl => {
        this._arr.splice(this._index, 1);

        if(this._index >= this._arr.length){
            this._index = this._arr.length - 1
        }

        if(this._index < 0){
            this._index = 0
        }

        return this._ret(this._index);
    };

    next = ():IteratorResultImpl => this._next();
    prev = ():IteratorResultImpl => this._prev();
}
