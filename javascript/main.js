/*
The MIT License (MIT)
Copyright (c) 2016 gazf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function(){

    var configPath = "javascript/config.json";
    var jqueryPath = "https://code.jquery.com/jquery-2.0.0.js";

    var TTS;
    var initTTS = function(config){
        var api = function(text){
            var query = config.VoiceTextAPI.query.replace(/<([^>]*)>/g, function(match){
                return config.VoiceTextAPI[match.slice(1, -1)];
            });
            return config.VoiceTextAPI.proxy + "?text=" + text + "&" + query;
        };

        var status = function(response){
            if(response.status >= 200 && response.status < 300){
                return Promise.resolve(response);
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        };

        var get = function(response){
            return response.arrayBuffer();
        };

        TTS = {
            getArrayBuffer: function(text){
                return fetch(api(text)).then(status).then(get);
            }
        };
    };

    var AudioAPI;
    var initAudioAPI = function(config){
        var context = new (window.AudioContext || window.webkitAudioContext);

        var decode = function(buffer){
            return context.decodeAudioData(buffer);
        };

        var play = function(buffer){
            var src = context.createBufferSource();
            src.buffer = buffer;
            src.connect(context.destination);
            src.start(0);
        };

        AudioAPI = {
            play: function(buffer){
                return decode(buffer).then(play);
            }
        };
    };

    var recognition;
    var initRecognition = function(config){
        recognition = new webkitSpeechRecognition();
        recognition.lang = config.Recognition.lang;
        recognition.interimResults = config.Recognition.interimResults;
        recognition.continuous = config.Recognition.continuous;
        recognition.onsoundstart = function(){ $(config.Element.status).text("認識中"); };
        recognition.onsoundend = function(){ $(config.Element.status).text("入力待機中"); };
        recognition.error = function(e){ $(config.Element.status).text(e.error); };
        recognition.onresult = function(event){
            var results = event.results;
            for(var i = event.resultIndex; i < results.length; i++){
                var text = results[i][0].transcript.trim();
                if(results[i].isFinal){
                    $(config.Element.confirm).prepend($("<div>").text(text));
                    TTS.getArrayBuffer(text).then(AudioAPI.play);
                    return;
                } else {
                    $(config.Element.interim).text(text);
                }
            }
        };
    };

    var applyEvent = function(config){
        var button = $(config.Element.toggle);
        button.click(function(e){
            if(button.text() == "Start"){
                recognition.onend = function(){ recognition.start(); };
                recognition.start();
                $(config.Element.status).text("入力待機中");
                button.text("Stop");
            } else {
                recognition.onend = function(){};
                recognition.stop();
                $(config.Element.status).text("停止中");
                button.text("Start");
            }
        });
    };

    fetch(jqueryPath)
    .then(function(response){
        return response.text().then(eval);
    })
    .then(function(){
        return fetch(configPath);
    })
    .then(function(response){
            return response.json();
    })
    .then(function(config){
        initTTS(config);
        initAudioAPI(config);
        initRecognition(config);
        applyEvent(config);
    })
    .catch(function(e){
        console.log(e);
    });

})();
