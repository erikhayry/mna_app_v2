var exec = require('cordova/exec');

exports.getTracks = function(success, error) {
    console.log("iOSAudioInfo.getTracks", success, error);
    exec(success, error, "iOSAudioInfo", "getTracks");
};

exports.getTrack = function(success, error, trackId) {
    console.log("iOSAudioInfo.getTracks", success, error, trackId);
    exec(success, error, "iOSAudioInfo", "getTrack", [trackId]);
};
