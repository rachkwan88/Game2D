// 2D Mall Game - Main Game File
class MallScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MallScene' });
        this.player = null;
        this.cursors = null;
        this.stores = [];
        this.currentLevel = 'mall';
    }

    preload() {
        console.log('Preload started');
        
        // Load player image
        console.log('Loading player image: images/characters/player.jpg');
        this.load.image('player', 'images/characters/player.jpg');
        
        // Load store images with error handling
        console.log('Loading store images...');
        this.load.image('store1', 'images/stores/Store1.png');
        this.load.image('store2', 'images/stores/Store2.png');
        this.load.image('store3', 'images/stores/Store3.png');
        
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
        this.wasd = this.input.keyboard.addKeys('A,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.createMallLevel();
        this.createPlayer();
        this.createStores();
        this.setupCollisions();
        
        // Add some decorative elements
        this.addDecorations();
        
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
            this.player = this.physics.add.sprite(400, 350, 'player');
            this.player.setScale(0.8); // Slightly smaller to match stores
            this.player.setDepth(10); // Put player in front
            console.log('Player image loaded successfully');
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
            
            this.player = this.physics.add.sprite(400, 350, 'player-fallback');
            this.player.setScale(2);
            this.player.setDepth(10); // Put player in front
            console.log('Using fallback green square for player');
        }
        
        this.player.setCollideWorldBounds(true);
        console.log('Player created at', this.player.x, this.player.y);
    }

    createStores() {
        console.log('Creating stores');
        
        // All stores aligned horizontally at y=200
        // Store 1 (Left)
        const store1 = this.physics.add.sprite(150, 200, 'store1');
        store1.name = 'Store 1';
        store1.setScale(0.6); // Slightly smaller for better fit
        store1.setDepth(5);
        this.stores.push(store1);

        // Store 2 (Center)
        const store2 = this.physics.add.sprite(400, 200, 'store2');
        store2.name = 'Store 2';
        store2.setScale(0.6); // Slightly smaller for better fit
        store2.setDepth(5);
        this.stores.push(store2);

        // Store 3 (Right)
        const store3 = this.physics.add.sprite(650, 200, 'store3');
        store3.name = 'Store 3';
        store3.setScale(0.6); // Slightly smaller for better fit
        store3.setDepth(5);
        this.stores.push(store3);

        // Add store labels
        this.stores.forEach(store => {
            const text = this.add.text(store.x, store.y + 80, store.name, {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 8, y: 4 }
            });
            text.setOrigin(0.5);
            text.setDepth(15);
        });
        
        console.log('Stores created');
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
        this.add.text(400, 550, 'Use A/D or LEFT/RIGHT Arrow Keys to move • Press SPACE near stores to enter', {
            fontSize: '14px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.stores, this.onStoreCollision, null, this);
    }

    onStoreCollision(player, store) {
        // Highlight store when player is near
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
    }

    update() {
        if (!this.player) return;

        // Reset store tints and hide interaction hint
        this.stores.forEach(store => store.clearTint());
        if (this.interactionHint) {
            this.interactionHint.destroy();
            this.interactionHint = null;
        }

        // Player movement - LEFT and RIGHT only
        const speed = 200;
        this.player.setVelocity(0);

        // Left movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-speed);
            console.log('Moving LEFT');
        }
        
        // Right movement
        if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(speed);
            console.log('Moving RIGHT');
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

    enterStore(storeName) {
        console.log(`Entering ${storeName}!`);
        // Here you could implement different store levels
        alert(`Welcome to ${storeName}! This could be a different level.`);
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