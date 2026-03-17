// app/Secret/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretGame() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [keys, setKeys] = useState({});
  const [collectedFlowers, setCollectedFlowers] = useState([]);
  const [showDoor, setShowDoor] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  // Game constants
  const TILE_SIZE = 40; // Slightly larger tiles
  const MAP_WIDTH = 20;
  const MAP_HEIGHT = 15;
  const TOTAL_FLOWERS = 8;

  // Player position
  const [playerPos, setPlayerPos] = useState({ x: 10, y: 7 });

  // Fixed tulip positions
  const [flowerPositions] = useState([
    { x: 3, y: 2 }, { x: 16, y: 3 }, { x: 5, y: 12 }, { x: 18, y: 10 },
    { x: 2, y: 6 }, { x: 12, y: 13 }, { x: 19, y: 5 }, { x: 8, y: 4 }
  ]);

  // Door position
  const doorPosition = { x: 10, y: 4 };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameComplete) return;
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameComplete]);

  // Move player based on keys
  useEffect(() => {
    if (gameComplete) return;

    const moveInterval = setInterval(() => {
      setPlayerPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (keys['w']) newY = Math.max(0, prev.y - 1);
        if (keys['s']) newY = Math.min(MAP_HEIGHT - 1, prev.y + 1);
        if (keys['a']) newX = Math.max(0, prev.x - 1);
        if (keys['d']) newX = Math.min(MAP_WIDTH - 1, prev.x + 1);

        if (!showDoor && newX === doorPosition.x && newY === doorPosition.y) {
          return prev;
        }

        return { x: newX, y: newY };
      });
    }, 180);

    return () => clearInterval(moveInterval);
  }, [keys, showDoor, gameComplete]);

  // Check for flower collection
  useEffect(() => {
    flowerPositions.forEach((flower, index) => {
      if (
        !collectedFlowers.includes(index) &&
        playerPos.x === flower.x &&
        playerPos.y === flower.y
      ) {
        setCollectedFlowers((prev) => [...prev, index]);
      }
    });
  }, [playerPos, flowerPositions]);

  // Check if all flowers collected
  useEffect(() => {
    if (collectedFlowers.length === TOTAL_FLOWERS && !showDoor) {
      setShowDoor(true);
    }
  }, [collectedFlowers.length]);

  // Check for door interaction
  useEffect(() => {
    if (
      showDoor &&
      !doorOpening &&
      playerPos.x === doorPosition.x &&
      playerPos.y === doorPosition.y
    ) {
      setDoorOpening(true);
      
      setTimeout(() => {
        setGameComplete(true);
        router.push('/Secret/gallery');
      }, 2000);
    }
  }, [playerPos, showDoor, doorPosition, router]);

  // Drawing functions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with off-white background
    ctx.fillStyle = '#f5f0e8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid lines
    ctx.strokeStyle = '#e0d6cc';
    ctx.lineWidth = 1;
    for (let i = 0; i <= MAP_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * TILE_SIZE, 0);
      ctx.lineTo(i * TILE_SIZE, canvas.height);
      ctx.strokeStyle = '#e0d6cc';
      ctx.stroke();
    }
    for (let i = 0; i <= MAP_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * TILE_SIZE);
      ctx.lineTo(canvas.width, i * TILE_SIZE);
      ctx.strokeStyle = '#e0d6cc';
      ctx.stroke();
    }

    // Draw decorative elements
    drawDecorations(ctx);

    // Draw uncollected flowers
    flowerPositions.forEach((flower, index) => {
      if (!collectedFlowers.includes(index)) {
        drawFlower(ctx, flower.x * TILE_SIZE, flower.y * TILE_SIZE);
      }
    });

    // Draw door
    if (showDoor) {
      drawDoor(ctx, doorPosition.x * TILE_SIZE, doorPosition.y * TILE_SIZE, doorOpening);
    } else {
      // Draw hidden door spot
      ctx.fillStyle = '#d9cdbc';
      ctx.fillRect(
        doorPosition.x * TILE_SIZE + 2,
        doorPosition.y * TILE_SIZE + 2,
        TILE_SIZE - 4,
        TILE_SIZE - 4
      );
      
      // Draw lock icon
      ctx.fillStyle = '#999';
      ctx.font = '20px Arial';
      ctx.fillText('🔒', doorPosition.x * TILE_SIZE + 10, doorPosition.y * TILE_SIZE + 28);
    }

    // Draw player
    drawPlayer(ctx, playerPos.x * TILE_SIZE, playerPos.y * TILE_SIZE);

  }, [playerPos, collectedFlowers, showDoor, doorOpening]);

  // Helper drawing functions
  const drawFlower = (ctx, x, y) => {
    // Simple tulip design
    ctx.fillStyle = '#ff9ebb'; // Soft pink
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 15, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ff6b9d'; // Darker pink center
    ctx.beginPath();
    ctx.arc(x + 20, y + 18, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Stem
    ctx.fillStyle = '#9dc183';
    ctx.fillRect(x + 19, y + 25, 2, 12);
    
    // Leaf
    ctx.fillStyle = '#9dc183';
    ctx.beginPath();
    ctx.ellipse(x + 25, y + 28, 5, 2, 0.3, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawPlayer = (ctx, x, y) => {
    // Simplified character design
    ctx.fillStyle = '#f9d6c5'; // Skin tone
    ctx.beginPath();
    ctx.arc(x + 20, y + 15, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Dress
    ctx.fillStyle = '#ffb6c1';
    ctx.fillRect(x + 14, y + 20, 12, 15);
    
    // Eyes
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x + 16, y + 13, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 24, y + 13, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.arc(x + 20, y + 17, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();
  };

  const drawDoor = (ctx, x, y, opening) => {
    if (opening) {
      const progress = (Date.now() % 2000) / 2000;
      
      // Glowing effect
      ctx.fillStyle = `rgba(255, 215, 0, ${1 - progress})`;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      
      // Door opening
      ctx.fillStyle = '#c4a484';
      ctx.fillRect(x + (TILE_SIZE * progress), y, 
                  TILE_SIZE * (1 - progress), TILE_SIZE);
      
      // Light
      ctx.fillStyle = `rgba(255, 255, 200, ${progress})`;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    } else {
      // Door
      ctx.fillStyle = '#c4a484';
      ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      
      // Door handle
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE - 10, y + TILE_SIZE / 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawDecorations = (ctx) => {
    // Simple decorative elements
    const bushes = [
      { x: 2, y: 2 }, { x: 18, y: 3 }, { x: 4, y: 13 }, { x: 17, y: 12 }
    ];

    bushes.forEach(bush => {
      ctx.fillStyle = '#b0d9b1';
      ctx.beginPath();
      ctx.arc(bush.x * TILE_SIZE + 20, bush.y * TILE_SIZE + 20, 12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#90c290';
      ctx.beginPath();
      ctx.arc(bush.x * TILE_SIZE + 15, bush.y * TILE_SIZE + 15, 8, 0, Math.PI * 2);
      ctx.arc(bush.x * TILE_SIZE + 25, bush.y * TILE_SIZE + 18, 7, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#faf7f2',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    gameWrapper: {
      backgroundColor: 'white',
      borderRadius: '32px',
      padding: '2rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      maxWidth: 'fit-content',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '500',
      color: '#333',
      margin: 0,
    },
    flowerCounter: {
      backgroundColor: '#f0eae2',
      padding: '0.5rem 1rem',
      borderRadius: '40px',
      fontSize: '1rem',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    gameCanvas: {
      borderRadius: '24px',
      backgroundColor: '#f5f0e8',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
      display: 'block',
      imageRendering: 'pixelated',
    },
    footer: {
      marginTop: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
    },
    instructions: {
      color: '#999',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    keyHint: {
      display: 'flex',
      gap: '0.5rem',
    },
    key: {
      backgroundColor: '#f0eae2',
      padding: '0.3rem 0.8rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      color: '#666',
      fontWeight: '500',
    },
    progressBar: {
      width: '200px',
      height: '4px',
      backgroundColor: '#f0eae2',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#ff9ebb',
      width: `${(collectedFlowers.length / TOTAL_FLOWERS) * 100}%`,
      transition: 'width 0.3s ease',
    },
    message: {
      backgroundColor: '#333',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '40px',
      fontSize: '0.9rem',
      marginTop: '1rem',
      textAlign: 'center',
      animation: doorOpening ? 'pulse 1s infinite' : 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.gameWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>find the tulips 🌷</h1>
          <div style={styles.flowerCounter}>
            <span>{collectedFlowers.length}/{TOTAL_FLOWERS}</span>
            <span>found</span>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH * TILE_SIZE}
          height={MAP_HEIGHT * TILE_SIZE}
          style={styles.gameCanvas}
        />

        <div style={styles.footer}>
          <div style={styles.instructions}>
            <div style={styles.keyHint}>
              <span style={styles.key}>W</span>
              <span style={styles.key}>A</span>
              <span style={styles.key}>S</span>
              <span style={styles.key}>D</span>
            </div>
            <span>to move</span>
          </div>
          
          <div style={styles.progressBar}>
            <div style={styles.progressFill} />
          </div>
        </div>

        {collectedFlowers.length === TOTAL_FLOWERS && !doorOpening && (
          <div style={styles.message}>
            ✨ a secret door appeared! find it ✨
          </div>
        )}
        
        {doorOpening && (
          <div style={{...styles.message, backgroundColor: '#ff9ebb'}}>
            🚪 opening the door to your memories...
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}