export interface Database{
    transaction(action:Function, error:ErrorCb, success?:SuccessCb):void
    transaction(query:Function, error:SuccessCb):void
}

export interface TX{
    executeSql(query:String, errorCb:ErrorCb, successCb:SuccessCb)
    executeSql(query:String, values?:Array<any>)
    executeSql(query:String, values:Array<any>, successCb:SuccessCb, errorCb:ErrorCb)
}

export interface DbItem {
    item:Function
}

export interface DbResult {
    rows:Array<DbItem>
}

export interface DbError {
    code:String
}

export interface Rows {
    length: Number;
    item(index: number): any;
}

interface ErrorCb {
    (error: DbError): void;
}

interface SuccessCb {
    (tx: TX, res:DbResult): void;
}
