# Web Voice Changer
Webブラウザ上で動作するボイスチェンジャーです。

## 動作サンプル
[Web Voice Changer - Heroku](https://web-voice-changer.herokuapp.com/)

## 使用しているAPI
+ Web Speech API
+ Web Audio API
+ [VoiceText Web API](https://cloud.voicetext.jp/webapi)

## 処理方法
1. Web Speech APIを利用してマイクからの音声を文字列に変換
2. VoiceText Web APIに文字列を送信してArrayBuffer型の音声を取得
3. Web Audio APIを利用して音声の再生

特に新しい技術を利用しているわけではなく、単純に各サービスのマッシュアップとなります。

## 注意点
VoiceText Web APIがクロスドメインに対応していないので、YahooPipesのようなプロクシが必要となります。
そのため、全てクライアントサイドで完結させるのは不可能です。
