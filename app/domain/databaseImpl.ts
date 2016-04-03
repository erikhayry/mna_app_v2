export interface Database{
    transaction(action:Function, error:Function, success:Function):void
    transaction(query:Function, error:Function):void
}