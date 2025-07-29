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
        this.collectibles = [];
        this.collectedItems = {
            collectable1: false,
            collectable2: false,
            collectable3: false
        };
        this.collectionText = null;
        console.log('Constructor: Collection status initialized at 0/3');
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
        
        // Load collectibles
        console.log('Loading collectibles...');
        this.load.image('collectable1', 'images/collectables/Collectable1.png');
        this.load.image('collectable2', 'images/collectables/Collectable2.png');
        this.load.image('collectable3', 'images/collectables/Collectable3.png');
        
        // Add specific error handling for collectibles
        this.load.on('loaderror', (file) => {
            if (file.key.includes('collectable')) {
                console.error(`❌ Failed to load collectible: ${file.key}`);
                console.error(`File path: ${file.src}`);
            }
        });
        
        this.load.on('complete', () => {
            console.log('✅ All collectibles loaded successfully');
            console.log('Available collectible textures:', 
                Object.keys(this.textures.list).filter(key => key.includes('collectable'))
            );
        });
        
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
        } else if (key === 'collectable1' || key === 'collectable2' || key === 'collectable3') {
            graphics.fillStyle(0xffff00); // Yellow for collectibles
            graphics.fillRect(0, 0, 32, 32);
            graphics.lineStyle(2, 0xffaa00);
            graphics.strokeRect(0, 0, 32, 32);
            graphics.generateTexture(key, 32, 32);
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
        this.createCollectibles();
        this.setupCollisions();
        
        // Add some decorative elements
        this.addDecorations();
        
        // Store mall elements for hiding/showing
        this.mallElements = [this.player, ...this.stores];
        
        // Force reset collection status before creating tracker
        this.collectedItems = {
            collectable1: false,
            collectable2: false,
            collectable3: false
        };
        console.log('Forced reset collection status in create():', this.collectedItems);
        
        // Create collection tracker text
        this.createCollectionTracker();
        
        // Start monitoring for unexpected collection status changes
        this.monitorCollectionStatus();
        
        // Force reset collection status to ensure nothing is collected
        this.collectedItems = {
            collectable1: false,
            collectable2: false,
            collectable3: false
        };
        this.updateCollectionTracker();
        
        // Force reset all collectibles to uncollected state
        this.collectibles.forEach(collectible => {
            if (collectible && !collectible.destroyed) {
                collectible.setVisible(false);
                if (collectible.body) {
                    collectible.body.setEnable(false);
                }
            }
        });
        
        // Debug: Check collectible visibility
        console.log('Checking collectible visibility after creation:');
        this.collectibles.forEach(collectible => {
            console.log(`${collectible.name}: visible=${collectible.visible}, room=${collectible.room}, destroyed=${collectible.destroyed}`);
        });
        
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
        
        // All stores aligned horizontally at y=200 with clear spacing
        // Store 1 (Left)
        const store1 = this.physics.add.sprite(80, 200, 'store1');
        store1.name = 'Store 1';
        store1.setScale(0.4); // Even smaller scale for more space
        store1.setDepth(5);
        console.log('Store 1 created at:', store1.x, store1.y);
        this.stores.push(store1);

        // Store 2 (Center)
        const store2 = this.physics.add.sprite(400, 200, 'store2');
        store2.name = 'Store 2';
        store2.setScale(0.4); // Even smaller scale for more space
        store2.setDepth(5);
        console.log('Store 2 created at:', store2.x, store2.y);
        this.stores.push(store2);

        // Store 3 (Right)
        const store3 = this.physics.add.sprite(720, 200, 'store3');
        store3.name = 'Store 3';
        store3.setScale(0.4); // Even smaller scale for more space
        store3.setDepth(5);
        console.log('Store 3 created at:', store3.x, store3.y);
        this.stores.push(store3);
        
        // Debug store positions
        console.log('=== STORE POSITIONS ===');
        this.stores.forEach((store, index) => {
            console.log(`Store ${index + 1}: "${store.name}" at (${store.x}, ${store.y})`);
        });

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

    createCollectibles() {
        console.log('Creating collectibles');
        
        // Create collectibles for each room with proper texture checking
        const collectible1 = this.physics.add.sprite(100, 100, 'collectable1');
        collectible1.setScale(0.3); // Smaller scale for better fit
        collectible1.setDepth(100); // Very high depth to be above everything including backgrounds
        collectible1.name = 'collectable1';
        collectible1.room = 'room1';
        collectible1.setVisible(false); // Hidden initially
        collectible1.setInteractive(); // Make it interactive
        // Safely disable physics body if it exists
        if (collectible1 && collectible1.body) {
            collectible1.body.setEnable(false);
        }
        
        const collectible2 = this.physics.add.sprite(700, 150, 'collectable2');
        collectible2.setScale(0.3); // Smaller scale for better fit
        collectible2.setDepth(100); // Very high depth to be above everything including backgrounds
        collectible2.name = 'collectable2';
        collectible2.room = 'room2';
        collectible2.setVisible(false); // Hidden initially
        collectible2.setInteractive(); // Make it interactive
        // Safely disable physics body if it exists
        if (collectible2 && collectible2.body) {
            collectible2.body.setEnable(false);
        }
        
        const collectible3 = this.physics.add.sprite(200, 550, 'collectable3');
        collectible3.setScale(0.3); // Smaller scale for better fit
        collectible3.setDepth(100); // Very high depth to be above everything including backgrounds
        collectible3.name = 'collectable3';
        collectible3.room = 'room3';
        collectible3.setVisible(false); // Hidden initially
        collectible3.setInteractive(); // Make it interactive
        // Safely disable physics body if it exists
        if (collectible3 && collectible3.body) {
            collectible3.body.setEnable(false);
        }
        
        this.collectibles = [collectible1, collectible2, collectible3];
        
        // Ensure all collectibles are hidden initially
        this.collectibles.forEach(collectible => {
            collectible.setVisible(false);
            if (collectible && collectible.body) {
                collectible.body.setEnable(false);
            }
        });
        
        // Don't add collision detection here - we'll add it only when entering rooms
        console.log('Collectibles created with disabled physics bodies');
        
        console.log('Collectibles created:', this.collectibles.length);
        console.log('Collection status at creation:', this.collectedItems);
        
        // Debug: Check if textures loaded
        this.collectibles.forEach(collectible => {
            if (this.textures.exists(collectible.texture.key)) {
                console.log(`✅ ${collectible.name} texture loaded successfully`);
                console.log(`📁 Texture key: ${collectible.texture.key}`);
                console.log(`🖼️ Texture source: ${collectible.texture.source[0].src || 'unknown'}`);
                console.log(`📏 Texture size: ${collectible.texture.source[0].width}x${collectible.texture.source[0].height}`);
                console.log(`🎨 Is fallback texture: ${collectible.texture.key.includes('fallback')}`);
            } else {
                console.log(`❌ ${collectible.name} texture NOT found`);
                console.log(`🔍 Looking for texture key: ${collectible.texture.key}`);
                // Create fallback texture for missing collectible
                this.createFallbackTexture(collectible.texture.key);
            }
        });
        
        // Verify all collectible textures are available
        const availableTextures = Object.keys(this.textures.list);
        const collectibleTextures = availableTextures.filter(key => key.includes('collectable'));
        console.log(`📊 Available collectible textures: ${collectibleTextures.length}/3`);
        console.log(`📋 Collectible texture list:`, collectibleTextures);
    }

    onCollectiblePickup(player, collectible) {
        console.log(`🎯 COLLECTION ATTEMPT: ${collectible.name}`);
        console.log(`📊 Current collection status:`, this.collectedItems);
        console.log(`📍 Collectible position: ${collectible.x}, ${collectible.y}`);
        console.log(`👤 Player position: ${player.x}, ${player.y}`);
        
        if (!this.collectedItems[collectible.name]) {
            // Mark as collected
            this.collectedItems[collectible.name] = true;
            console.log(`✅ ${collectible.name} marked as collected`);
            
            // Remove the collectible from the scene
            collectible.destroy();
            console.log(`🗑️ ${collectible.name} destroyed from scene`);
            
            // Show collection message
            const message = this.add.text(400, 250, `Collected ${collectible.name}!`, {
                fontSize: '24px',
                fill: '#ffff00',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            });
            message.setOrigin(0.5);
            message.setDepth(25);
            
            // Remove message after 2 seconds
            this.time.delayedCall(2000, () => {
                message.destroy();
            });
            
            // Update collection tracker
            this.updateCollectionTracker();
            
            console.log(`🎉 Successfully collected ${collectible.name}!`);
        } else {
            console.log(`❌ ${collectible.name} already collected`);
        }
    }

    createCollectionTracker() {
        this.collectionText = this.add.text(20, 20, 'Collectibles: 0/3', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });
        this.collectionText.setDepth(30);
        
        // Ensure collection status starts at 0
        this.collectedItems = {
            collectable1: false,
            collectable2: false,
            collectable3: false
        };
        
        // Force update to show 0/3
        this.updateCollectionTracker();
        console.log('Collection tracker initialized at 0/3');
        console.log('Initial collection status:', this.collectedItems);
    }

    updateCollectionTracker() {
        const collected = Object.values(this.collectedItems).filter(Boolean).length;
        this.collectionText.setText(`Collectibles: ${collected}/3`);
        console.log(`Collection tracker updated: ${collected}/3`);
        console.log(`Current collection status:`, this.collectedItems);
        console.log(`True values:`, Object.values(this.collectedItems).filter(Boolean));
    }
    
    resetCollectibles() {
        // Reset all collectibles for testing
        this.collectedItems = {
            collectable1: false,
            collectable2: false,
            collectable3: false
        };
        this.updateCollectionTracker();
        console.log('Collectibles reset to 0/3');
    }
    

    
    debugCollectibles() {
        // Debug collectibles status
        console.log('=== COLLECTIBLES DEBUG ===');
        console.log('Collection status:', this.collectedItems);
        this.collectibles.forEach(collectible => {
            console.log(`${collectible.name}: visible=${collectible.visible}, room=${collectible.room}, position=${collectible.x},${collectible.y}`);
        });
        console.log('Current room:', this.currentRoom);
        console.log('========================');
    }
    
    fixRoom1Collectible() {
        // Force fix Room 1 collectible
        console.log('=== FIXING ROOM 1 COLLECTIBLE ===');
        this.collectedItems.collectable1 = false;
        this.updateCollectionTracker();
        
        this.collectibles.forEach(collectible => {
            if (collectible.name === 'collectable1') {
                collectible.setVisible(false);
                if (collectible.body) {
                    collectible.body.setEnable(false);
                }
                console.log(`🔧 Reset ${collectible.name} for Room 1`);
            }
        });
        console.log('Room 1 collectible should now work properly');
    }
    
    forceResetGame() {
        // Completely reset the game state
        console.log('=== FORCE RESETTING GAME ===');
        
        // Reset collection status
        this.collectedItems = {
            collectable1: false,
            collectable2: false,
            collectable3: false
        };
        
        // Destroy existing collectibles and recreate them
        this.collectibles.forEach(collectible => {
            if (collectible && collectible.destroy) {
                collectible.destroy();
            }
        });
        
        // Clear collectibles array
        this.collectibles = [];
        
        // Recreate collectibles
        this.createCollectibles();
        
        // Update tracker
        this.updateCollectionTracker();
        
        console.log('Game force reset complete. Collection status:', this.collectedItems);
        console.log('All collectibles recreated and reset to 0/3');
    }
    
    monitorCollectionStatus() {
        // Monitor collection status changes
        const originalStatus = { ...this.collectedItems };
        
        // Check every second for unexpected changes
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                const currentStatus = { ...this.collectedItems };
                const changed = Object.keys(currentStatus).filter(key => 
                    currentStatus[key] !== originalStatus[key]
                );
                
                if (changed.length > 0) {
                    console.log(`🚨 UNEXPECTED COLLECTION STATUS CHANGE!`);
                    console.log(`Changed items:`, changed);
                    console.log(`Original:`, originalStatus);
                    console.log(`Current:`, currentStatus);
                }
            },
            loop: true
        });
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
            
            console.log(`Distance to ${store.name}: ${distance} (Player at ${this.player.x}, ${this.player.y}, Store at ${store.x}, ${store.y})`);
            
            if (distance < 150) { // Smaller distance for more precise detection
                console.log(`🎯 PLAYER POSITION DEBUG: Player at (${this.player.x}, ${this.player.y})`);
                console.log(`🎯 STORE DISTANCE DEBUG: ${store.name} at (${store.x}, ${this.player.y}) - Distance: ${distance}`);
                console.log(`🎯 NEAREST STORE: ${store.name} at distance ${distance}`);
                console.log(`Near ${store.name}, teleporting to room...`);
                
                // Draw border around the store that was hit
                this.drawStoreBorder(store);
                

                
                // Determine which room to enter based on store
                let roomKey = 'room1'; // Default
                console.log(`🔍 STORE DETECTION: Store name is "${store.name}"`);
                
                if (store.name === 'Store 1') {
                    roomKey = 'room1';
                    console.log(`✅ Detected Store 1, entering room1`);
                } else if (store.name === 'Store 2') {
                    roomKey = 'room2';
                    console.log(`✅ Detected Store 2, entering room2`);
                } else if (store.name === 'Store 3') {
                    roomKey = 'room3';
                    console.log(`✅ Detected Store 3, entering room3`);
                } else {
                    console.log(`❌ Unknown store name: "${store.name}", defaulting to room1`);
                }
                
                console.log(`🎯 Final room assignment: ${roomKey}`);
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
        this.roomBackground.setDepth(0); // Background should be behind everything
        
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
        
        // Show collectible for this room if not already collected
        let collectibleShown = false;
        console.log(`=== ENTERING ROOM: ${roomKey} ===`);
        console.log(`Current collection status:`, this.collectedItems);
        console.log(`Available collectibles:`, this.collectibles.length);
        
        this.collectibles.forEach((collectible, index) => {
            console.log(`\n--- Checking Collectible ${index + 1} ---`);
            console.log(`Name: ${collectible.name}`);
            console.log(`Room: ${collectible.room}`);
            console.log(`Target Room: ${roomKey}`);
            console.log(`Collected: ${this.collectedItems[collectible.name]}`);
            console.log(`Visible: ${collectible.visible}`);
            console.log(`Position: ${collectible.x}, ${collectible.y}`);
            console.log(`Scale: ${collectible.scaleX}, ${collectible.scaleY}`);
            console.log(`Depth: ${collectible.depth}`);
            
            if (collectible.room === roomKey && !this.collectedItems[collectible.name]) {
                collectible.setVisible(true);
                collectible.setDepth(100); // Ensure collectible is in front of everything
                // Safely enable physics body if it exists
                if (collectible && collectible.body) {
                    collectible.body.setEnable(true);
                }
                
                // Special debug for Room 1
                if (roomKey === 'room1') {
                    console.log(`🔍 ROOM 1 DEBUG: ${collectible.name} should be visible`);
                    console.log(`🔍 ROOM 1 DEBUG: Collection status for ${collectible.name}: ${this.collectedItems[collectible.name]}`);
                    console.log(`🔍 ROOM 1 DEBUG: Collectible position will be: 150, 200`);
                }
                
                // Position collectibles in different locations based on room
                if (roomKey === 'room1') {
                    collectible.setPosition(150, 200); // Top-left area of room
                    console.log(`✅ Showing ${collectible.name} in ${roomKey} at position 150,200`);
                } else if (roomKey === 'room2') {
                    collectible.setPosition(650, 250); // Top-right area of room
                    console.log(`✅ Showing ${collectible.name} in ${roomKey} at position 650,250`);
                } else if (roomKey === 'room3') {
                    collectible.setPosition(200, 450); // Bottom-left area of room
                    console.log(`✅ Showing ${collectible.name} in ${roomKey} at position 200,450`);
                }
                
                // Add collision detection for this specific collectible with a delay to prevent immediate collection
                this.time.delayedCall(500, () => {
                    this.physics.add.overlap(this.player, collectible, this.onCollectiblePickup, null, this);
                    console.log(`🎯 Collision detection enabled for ${collectible.name}`);
                });
                
                collectibleShown = true;
                console.log(`🎯 Collectible ${collectible.name} is now VISIBLE`);
            } else {
                collectible.setVisible(false);
                // Safely disable physics body if it exists
                if (collectible && collectible.body) {
                    collectible.body.setEnable(false);
                }
                if (collectible.room === roomKey) {
                    console.log(`❌ ${collectible.name} already collected or wrong room`);
                } else {
                    console.log(`❌ ${collectible.name} wrong room (${collectible.room} vs ${roomKey})`);
                }
            }
        });
        
        if (!collectibleShown) {
            console.log(`⚠️ No collectible shown for room ${roomKey}`);
            console.log(`This means either:`);
            console.log(`1. All collectibles for this room are already collected`);
            console.log(`2. No collectible is assigned to this room`);
            console.log(`3. There's an error in the collectible creation`);
        }
        
        // Debug: Show collection status
        console.log(`\nFinal collection status:`, this.collectedItems);
        console.log(`=== END ROOM ENTRY ===\n`);
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
        
        // Hide all collectibles when back in mall
        this.collectibles.forEach(collectible => {
            collectible.setVisible(false);
            // Safely disable physics body if it exists
            if (collectible && collectible.body) {
                collectible.body.setEnable(false);
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