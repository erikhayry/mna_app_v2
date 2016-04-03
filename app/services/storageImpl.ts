export interface StorageImpl {
    getIgnoreList():Promise<{}>
    addIgnoreListItem(id:any, name:any):Promise<{}>
    deleteIgnoreListItem(id:any):Promise<{}>
    getPreferences():Promise<{}>
    setPreferences(key:any, value:any):Promise<{}>
}
