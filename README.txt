2D MALL GAME
=============

DESCRIPTION
-----------
A 2D pixel art mall game built with HTML5, JavaScript, and the Phaser 3 game engine. 
Players can walk around a mall environment and interact with different stores.

GAME FEATURES
-------------
• Top-down 2D mall environment with tiled floor
• Player character with smooth left/right movement
• Three unique stores representing different levels/areas
• Store interaction system (press SPACE to enter stores)
• Pixel art graphics with proper layering (player in front of stores)
• Responsive controls with multiple input options

VISUAL ELEMENTS
---------------
• Mall floor with grid pattern
• Player character (chibi-style girl with brown hair)
• Three distinct store buildings:
  - Store 1: Purple/pink building with outdoor seating
  - Store 2: Green building with "Family Cafe" sign
  - Store 3: Yellow building with blue windows
• Store labels and UI instructions
• Professional layering system (floor → stores → player → labels)

CONTROLS
---------
• A key or LEFT ARROW: Move player left
• D key or RIGHT ARROW: Move player right
• SPACE: Enter stores when near them
• Player movement is constrained to the mall boundaries

TECHNICAL DETAILS
-----------------
• Engine: Phaser 3.60.0
• Graphics: HTML5 Canvas with pixel art rendering
• Physics: Arcade physics system
• Assets: PNG and JPG image files
• File Structure:
  - images/characters/player.jpg (player character)
  - images/stores/Store1.png (first store)
  - images/stores/Store2.png (second store)
  - images/stores/Store3.png (third store)

HOW TO RUN THE GAME
-------------------

IMPORTANT: Due to browser security restrictions, you MUST run a local server to load the images properly.

OPTION 1: Use the provided server script (RECOMMENDED)
-----------------------------------------------------
1. Open Terminal/Command Prompt
2. Navigate to the game directory
3. Run: python3 start-server.py
4. The game will automatically open in your browser
5. If it doesn't open automatically, go to: http://localhost:8080/index.html

OPTION 2: Manual server setup
-----------------------------
1. Open Terminal/Command Prompt
2. Navigate to the game directory
3. Run: python3 -m http.server 8080
4. Open your browser and go to: http://localhost:8080/index.html

OPTION 3: Direct file access (IMAGES WON'T LOAD)
------------------------------------------------
• Opening index.html directly will show the game but images won't load
• This is due to CORS (Cross-Origin Resource Sharing) restrictions
• Only use this for testing basic functionality

TROUBLESHOOTING
---------------
• If you see green squares instead of images: Make sure you're using a server (not opening the file directly)
• If the server won't start: Try a different port (edit start-server.py and change PORT = 8080 to PORT = 8081)
• If images still don't load: Check that all image files exist in the correct folders
• If movement doesn't work: Check browser console for JavaScript errors

FILE STRUCTURE
--------------
Game2D/
├── index.html              (main game file)
├── js/
│   └── game.js            (game logic and mechanics)
├── images/
│   ├── characters/
│   │   └── player.jpg     (player character sprite)
│   └── stores/
│       ├── Store1.png     (first store building)
│       ├── Store2.png     (second store building)
│       └── Store3.png     (third store building)
├── start-server.py        (server script for easy setup)
├── simple-test.html       (image loading test)
├── test.html             (Phaser test file)
├── package.json          (project configuration)
├── README.md             (markdown documentation)
└── README.txt            (this file)

DEVELOPMENT NOTES
-----------------
• The game uses Phaser 3's scene system for proper organization
• Images are loaded asynchronously with error handling
• Fallback graphics are created if images fail to load
• Player movement uses physics-based velocity for smooth animation
• Store interaction uses distance-based collision detection
• All game elements have proper depth layering for visual hierarchy

FUTURE ENHANCEMENTS
-------------------
• Add up/down movement for full 2D exploration
• Implement different store interiors as separate levels
• Add sound effects and background music
• Include more interactive elements and NPCs
• Add inventory system and shopping mechanics
• Implement save/load functionality

CREDITS
-------
• Game Engine: Phaser 3 (https://phaser.io)
• Graphics: Custom pixel art assets
• Development: Created with AI assistance

VERSION: 1.0
LAST UPDATED: July 2025 