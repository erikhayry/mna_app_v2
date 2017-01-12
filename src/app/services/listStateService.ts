export class ListStateService {
    isModified: boolean;

    constructor() {
        this.isModified = false;
    }

    setState(isModified:boolean) {
        this.isModified = isModified;
    }

    getState() {
        return this.isModified;
    }
}
