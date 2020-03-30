# robobot
Simple discord music bot

Was created for my own discord server

## Commands

```play``` - adds song to queue, can use youtube link or just search

```list``` - adds all songs in a youtube playlist to queue, only accepts links

```skip``` - skips song

```queue``` - shows queue

```shuffle``` - shuffles queue

```remove``` - removes songs from queue, only accepts numbers and youtube links

```clear``` - clear queue, only leaves the currently playing song

```stop``` - bot stops playing and leaves the server

## How to run the bot

### Local server

Create a config.json file with the same contents as config.example.json.

In the ```token``` field add your bot token

In the ```prefix``` field select the prefix you want to use, leave empty for usage without prefix

Run ```npm i && npm install ffmpeg-static``` in console.
Then run ```npm start``` in console
