// 2D Mall Game - Main Game File
class MallScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MallScene' });
        this.player = null;
        this.cursors = null;
        this.stores = [];
        this.currentLevel = 'mall';
        this.spaceKeyPressed = false;
        this.currentRoom = null;
        this.currentStore = null;
        this.roomBackground = null;
        this.mallElements = [];
    }

    preload() {
        console.log('Preload started');
        
        // Load player image
        console.log('Loading player image: images/characters/player.png');
        this.load.image('player', 'images/characters/player.png');
        
        // Load store images with error handling
        console.log('Loading store images...');
        this.load.image('store1', 'images/stores/Store1.png');
        this.load.image('store2', 'images/stores/Store2.png');
        this.load.image('store3', 'images/stores/Store3.png');
        
        // Load room backgrounds
        console.log('Loading room images...');
        this.load.image('room1', 'images/rooms/Room1.jpg');
        this.load.image('room2', 'images/rooms/Room2.jpg');
        this.load.image('room3', 'images/rooms/Room3.jpg');
        
        // Add load event listeners
        this.load.on('complete', () => {
            console.log('All images loaded successfully');
            console.log('Available textures:', Object.keys(this.textures.list));
        });
        
        this.load.on('loaderror', (file) => {
            console.error('Failed to load:', file.src);
            console.error('File key:', file.key);
            // Create fallback texture when image fails to load
            this.createFallbackTexture(file.key);
        });
        
        console.log('Preload completed');
    }

    createFallbackTexture(key) {
        console.log('Creating fallback texture for:', key);
        const graphics = this.add.graphics();
        
        if (key === 'player') {
            graphics.fillStyle(0x00ff00);
            graphics.fillRect(0, 0, 32, 32);
            graphics.lineStyle(2, 0x00cc00);
            graphics.strokeRect(0, 0, 32, 32);
            graphics.generateTexture(key, 32, 32);
        } else if (key === 'store1' || key === 'store2' || key === 'store3') {
            graphics.fillStyle(0xff6600);
            graphics.fillRect(0, 0, 64, 48);
            graphics.lineStyle(2, 0x000000);
            graphics.strokeRect(0, 0, 64, 48);
            graphics.generateTexture(key, 64, 48);
        }
        
        graphics.destroy();
        console.log('Fallback texture created for:', key);
    }

    create() {
        console.log('Create started');
        
        // Create floor texture first
        this.createFloorTexture();
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.createMallLevel();
        this.createPlayer();
        this.createStores();
        this.setupCollisions();
        
        // Add some decorative elements
        this.addDecorations();
        
        // Store mall elements for hiding/showing
        this.mallElements = [this.player, ...this.stores];
        
        console.log('Create completed');
    }

    createFloorTexture() {
        // Create mall floor with pattern
        const floorGraphics = this.add.graphics();
        floorGraphics.fillStyle(0xe0e0e0);
        floorGraphics.fillRect(0, 0, 32, 32);
        floorGraphics.lineStyle(1, 0xcccccc);
        floorGraphics.strokeRect(0, 0, 32, 32);
        floorGraphics.generateTexture('floor', 32, 32);
        floorGraphics.destroy();
    }

    createMallLevel() {
        console.log('Creating mall level');
        
        // Create mall floor
        for (let x = 0; x < 800; x += 32) {
            for (let y = 0; y < 600; y += 32) {
                const floorTile = this.add.image(x, y, 'floor');
                floorTile.setOrigin(0);
                console.log(`Floor tile at ${x}, ${y}`);
            }
        }
        
        console.log('Mall level created');
    }

    createPlayer() {
        console.log('Creating player');
        
        // Check if player texture exists
        if (this.textures.exists('player')) {
            console.log('Player texture found, using actual image');
            this.player = this.physics.add.sprite(400, 400, 'player'); // Moved down for more space
            this.player.setScale(0.4); // Smaller scale for transparent PNG
            this.player.setDepth(10); // Put player in front
            
            console.log('Player transparent PNG loaded successfully');
        } else {
            console.log('Player texture NOT found, creating fallback');
            // Create fallback player
            const graphics = this.add.graphics();
            graphics.fillStyle(0x00ff00);
            graphics.fillRect(0, 0, 32, 32);
            graphics.lineStyle(2, 0x00cc00);
            graphics.strokeRect(0, 0, 32, 32);
            graphics.generateTexture('player-fallback', 32, 32);
            graphics.destroy();
            
            this.player = this.physics.add.sprite(400, 400, 'player-fallback'); // Moved down for more space
            this.player.setScale(2);
            this.player.setDepth(10); // Put player in front
            console.log('Using fallback green square for player');
        }
        
        this.player.setCollideWorldBounds(true);
        console.log('Player created at', this.player.x, this.player.y);
    }

    createStores() {
        console.log('Creating stores');
        
        // All stores aligned horizontally at y=200 with more spacing
        // Store 1 (Left)
        const store1 = this.physics.add.sprite(120, 200, 'store1');
        store1.name = 'Store 1';
        store1.setScale(0.5); // Smaller scale for more space
        store1.setDepth(5);
        console.log('Store 1 created at:', store1.x, store1.y);
        this.stores.push(store1);

        // Store 2 (Center)
        const store2 = this.physics.add.sprite(400, 200, 'store2');
        store2.name = 'Store 2';
        store2.setScale(0.5); // Smaller scale for more space
        store2.setDepth(5);
        console.log('Store 2 created at:', store2.x, store2.y);
        this.stores.push(store2);

        // Store 3 (Right)
        const store3 = this.physics.add.sprite(680, 200, 'store3');
        store3.name = 'Store 3';
        store3.setScale(0.5); // Smaller scale for more space
        store3.setDepth(5);
        console.log('Store 3 created at:', store3.x, store3.y);
        this.stores.push(store3);

        // Add store labels
        this.stores.forEach((store, index) => {
            const text = this.add.text(store.x, store.y + 80, store.name, {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 8, y: 4 }
            });
            text.setOrigin(0.5);
            text.setDepth(15);
            store.label = text; // Store the label reference
            console.log(`Label created for ${store.name} at:`, text.x, text.y);
        });
        
        console.log('All stores created:', this.stores.length);
    }

    addDecorations() {
        // Add mall title
        this.add.text(400, 50, 'MALL', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#2c3e50',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);
        
        // Add instructions
        this.instructionText = this.add.text(400, 550, 'Use WASD or Arrow Keys to move • Press SPACE near stores to teleport', {
            fontSize: '14px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });
        this.instructionText.setOrigin(0.5);
        this.instructionText.setDepth(20);
    }

    setupCollisions() {
        // Make stores solid so player can't walk through them
        this.stores.forEach(store => {
            store.body.setImmovable(true);
            // Make collision box smaller than visual size
            store.body.setSize(store.width * 0.6, store.height * 0.6);
        });
        
        // Add collision between player and stores
        this.physics.add.collider(this.player, this.stores, this.onStoreCollision, null, this);
        
        console.log('Collisions and solid bodies set up');
    }

    onStoreCollision(player, store) {
        // Highlight store when player collides with it
        store.setTint(0xffff00);
        
        // Add interaction hint
        if (!this.interactionHint) {
            this.interactionHint = this.add.text(400, 550, 'Press SPACE to enter store', {
                fontSize: '16px',
                fill: '#ffff00',
                backgroundColor: '#000000',
                padding: { x: 8, y: 4 }
            });
            this.interactionHint.setOrigin(0.5);
        }
        
        console.log('Player collided with:', store.name);
    }

    update() {
        if (!this.player) return;

        // Reset store tints and hide interaction hint
        this.stores.forEach(store => store.clearTint());
        if (this.interactionHint) {
            this.interactionHint.destroy();
            this.interactionHint = null;
        }

        // Check if player is near any store and highlight
        let nearAnyStore = false;
        console.log(`Player position: ${this.player.x}, ${this.player.y}`);
        
        this.stores.forEach(store => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                store.x, store.y
            );
            
            console.log(`${store.name} position: ${store.x}, ${store.y} - Distance: ${distance}`);
            
            if (distance < 200) { // Much larger distance for easier detection
                store.setTint(0x00ff00); // Green tint when near
                nearAnyStore = true;
                console.log(`Near ${store.name}!`);
            }
        });

        // Show interaction hint if near store
        if (nearAnyStore && !this.currentRoom) {
            if (!this.interactionHint) {
                this.interactionHint = this.add.text(400, 500, 'Press SPACE to teleport to room', {
                    fontSize: '16px',
                    fill: '#00ff00',
                    backgroundColor: '#000000',
                    padding: { x: 8, y: 4 }
                });
                this.interactionHint.setOrigin(0.5);
                this.interactionHint.setDepth(20);
            }
        } else if (this.interactionHint) {
            this.interactionHint.destroy();
            this.interactionHint = null;
        }

        // Player movement - FULL movement (WASD or Arrow Keys)
        const speed = 200;
        this.player.setVelocity(0);

        // Left movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-speed);
            console.log('Moving LEFT');
        }
        // Right movement
        else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(speed);
            console.log('Moving RIGHT');
        }
        
        // Up movement
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.setVelocityY(-speed);
            console.log('Moving UP');
        }
        // Down movement
        else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.setVelocityY(speed);
            console.log('Moving DOWN');
        }

        // Check for room teleport with SPACE key
        if (this.spaceKey.isDown && !this.spaceKeyPressed) {
            console.log('SPACE key pressed!');
            this.spaceKeyPressed = true;
            if (this.currentRoom) {
                console.log('Currently in room, teleporting back to mall...');
                this.exitRoom();
            } else {
                console.log('Currently in mall, checking if near store...');
                this.checkRoomEntry();
            }
        }
        
        // Reset SPACE key state when released
        if (!this.spaceKey.isDown) {
            this.spaceKeyPressed = false;
        }
        
        // Check for store entry with SPACE
        if (this.spaceKey.isDown) {
            this.checkStoreEntry();
        }
    }

    checkStoreEntry() {
        this.stores.forEach(store => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                store.x, store.y
            );
            
            if (distance < 80) {
                this.enterStore(store.name);
            }
        });
    }

    checkRoomEntry() {
        console.log('Checking room entry...');
        let nearStore = false;
        
        this.stores.forEach(store => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                store.x, store.y
            );
            
            console.log(`Distance to ${store.name}: ${distance}`);
            
            if (distance < 200) { // Much larger distance for easier entry
                console.log(`Near ${store.name}, teleporting to room...`);
                
                // Draw border around the store that was hit
                this.drawStoreBorder(store);
                
                // Determine which room to enter based on store
                let roomKey = 'room1'; // Default
                if (store.name === 'Store 1') {
                    roomKey = 'room1';
                } else if (store.name === 'Store 2') {
                    roomKey = 'room2';
                } else if (store.name === 'Store 3') {
                    roomKey = 'room3';
                }
                
                this.enterRoom(roomKey, store.name);
                nearStore = true;
                return;
            }
        });
        
        if (!nearStore) {
            console.log('Not near any store - cannot teleport');
        }
    }

    drawStoreBorder(store) {
        // Remove any existing border
        if (this.storeBorder) {
            this.storeBorder.destroy();
        }
        
        // Create a graphics object for the border
        this.storeBorder = this.add.graphics();
        this.storeBorder.setDepth(25); // Above everything
        
        // Set border style
        this.storeBorder.lineStyle(4, 0xff0000, 1); // Red border, 4px thick
        
        // Calculate border rectangle around the store
        const borderWidth = store.width * store.scaleX + 20; // Add some padding
        const borderHeight = store.height * store.scaleY + 20;
        const borderX = store.x - borderWidth / 2;
        const borderY = store.y - borderHeight / 2;
        
        // Draw the border rectangle
        this.storeBorder.strokeRect(borderX, borderY, borderWidth, borderHeight);
        
        console.log(`Drew red border around ${store.name}`);
        
        // Remove border after 2 seconds
        this.time.delayedCall(2000, () => {
            if (this.storeBorder) {
                this.storeBorder.destroy();
                this.storeBorder = null;
                console.log('Removed store border');
            }
        });
    }

    enterRoom(roomKey, storeName) {
        console.log(`Teleporting to ${roomKey} from ${storeName}!`);
        
        // Hide mall elements
        this.mallElements.forEach(element => {
            element.setVisible(false);
        });
        
        // Create room background
        this.roomBackground = this.add.image(400, 300, roomKey);
        this.roomBackground.setScale(2.5); // Much larger scale to stretch and fill screen
        this.roomBackground.setDepth(1);
        
        // Show player in room
        this.player.setVisible(true);
        this.player.setPosition(400, 350);
        
        this.currentRoom = roomKey;
        this.currentStore = storeName;
        
        // Hide all instruction text when in room
        if (this.instructionText) {
            this.instructionText.setVisible(false);
        }
        if (this.interactionHint) {
            this.interactionHint.setVisible(false);
        }
        
        // Hide store labels when in room
        this.stores.forEach(store => {
            if (store.label) {
                store.label.setVisible(false);
            }
        });
    }

    exitRoom() {
        console.log(`Teleporting back to mall from ${this.currentStore}!`);
        
        // Remove room background
        if (this.roomBackground) {
            this.roomBackground.destroy();
            this.roomBackground = null;
        }
        
        // Show all mall elements
        this.mallElements.forEach(element => {
            element.setVisible(true);
        });
        
        // Reset player position to mall
        this.player.setPosition(400, 400);
        
        this.currentRoom = null;
        this.currentStore = null;
        
        // Show instruction text again when back in mall
        if (this.instructionText) {
            this.instructionText.setVisible(true);
        }
        
        // Show store labels again when back in mall
        this.stores.forEach(store => {
            if (store.label) {
                store.label.setVisible(true);
            }
        });
    }

    updateInstructions(text) {
        // Remove old instructions
        if (this.instructionText) {
            this.instructionText.destroy();
        }
        
        // Create new instructions
        this.instructionText = this.add.text(400, 550, text, {
            fontSize: '14px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });
        this.instructionText.setOrigin(0.5);
        this.instructionText.setDepth(20);
    }

    enterStore(storeName) {
        console.log(`Entering ${storeName}!`);
        // This method is now replaced by enterRoom
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    console.log('Page loaded, initializing game...');
    try {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            backgroundColor: '#2c3e50',
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: MallScene
        };
        
        const game = new Phaser.Game(config);
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}); 