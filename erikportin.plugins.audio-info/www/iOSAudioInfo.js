var exec = require('cordova/exec');

exports.getTracks = function(success, error) {
    console.log("getTracks called");
    exec(success, error, "iOSAudioInfo", "getTracks");
};

exports.getTrack = function(success, error, trackId) {
    console.log("getTrack called", trackId);
    exec(success, error, "iOSAudioInfo", "getTrack", [trackId]);
};
