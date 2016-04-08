/********* iOSAudioInfo.h Cordova Plugin header *******/

#import <Cordova/CDVPlugin.h>
#import <Cordova/CDV.h>
#import <MediaPlayer/MediaPlayer.h>

@interface iOSAudioInfo : CDVPlugin <MPMediaPickerControllerDelegate> {
    NSString *callbackID;
    CDVPluginResult *pluginResult;
    NSMutableArray *songsList;
}

- (void) getTracks:(CDVInvokedUrlCommand*)command;
- (void) getTrack:(CDVInvokedUrlCommand*)command;
- (void) getAlbum:(CDVInvokedUrlCommand*)command;

@end
