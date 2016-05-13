import {PluginsImpl} from "./pluginsImpl";

export interface CordovaWindowImpl extends Window {
    plugins:PluginsImpl
}
