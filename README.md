# 2D Mall Game

## Overview


##backgtound

## Tech

* HTML
* Javascript Game Engine Phaser
* Each player and character should be in its own png files 

## GameMap
The Game map should be in a top view perspective and in one floor. In that floor there should be 3 stores which represent different levels

* Store1.png in stores directory
* Store2.png in stores directory
* Store3.png in stores directory


## Player

Use WASD or arrow keys to move player left and right.
The space bar should be used to enter different stores.

* Player should be in characters directory /images/characters/player.jpg

## How to Run

**IMPORTANT**: Due to browser security restrictions, you need to run a local server to load the images properly.

### Option 1: Use the provided server script (Recommended)
```bash
python3 start-server.py
```
This will automatically open the game in your browser.

### Option 2: Manual server
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000/index.html` in your browser

### Option 3: Direct file (Images won't load)
If you open `index.html` directly, the images won't load due to CORS restrictions.

## Controls
- **WASD** or **Arrow Keys**: Move the player around the mall
- **SPACE**: Enter stores when near them 

