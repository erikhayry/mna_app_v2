import {Album} from "./album";
export interface IteratorResultImpl{
    value:Album;
    next:Boolean;
    prev:Boolean;
}