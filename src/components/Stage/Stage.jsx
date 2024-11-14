// import React, { useRef, useEffect } from 'react';

// const CANVAS_WIDTH = 480;
// const CANVAS_HEIGHT = 360;

// const Stage = ({ sprites, onReset, onDragStart }) => {
//   const canvasRef = useRef(null);
//   const contextRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     contextRef.current = context;
//     drawGrid();
//   }, []);

//   useEffect(() => {
//     if (!contextRef.current) return;
//     drawGrid();
//     sprites.forEach(sprite => {
//       if (sprite.isVisible) {
//         drawSprite(sprite);
//       }
//     });
//   }, [sprites]);

//   const drawGrid = () => {
//     const context = contextRef.current;
//     context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

//     // Draw grid and axes
//     context.strokeStyle = '#ddd';
//     context.lineWidth = 1;
//     for (let x = 0; x <= CANVAS_WIDTH; x += 40) {
//       context.beginPath();
//       context.moveTo(x, 0);
//       context.lineTo(x, CANVAS_HEIGHT);
//       context.stroke();
//     }
//     for (let y = 0; y <= CANVAS_HEIGHT; y += 40) {
//       context.beginPath();
//       context.moveTo(0, y);
//       context.lineTo(CANVAS_WIDTH, y);
//       context.stroke();
//     }

//     // Draw axes
//     context.strokeStyle = '#999';
//     context.lineWidth = 2;
//     context.beginPath();
//     context.moveTo(CANVAS_WIDTH / 2, 0);
//     context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
//     context.moveTo(0, CANVAS_HEIGHT / 2);
//     context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
//     context.stroke();
//   };

//   const drawSprite = (sprite) => {
//     const context = contextRef.current;
//     const img = new Image();
//     img.src = sprite.image;
//     img.onload = () => {
//       context.save();
//       context.translate(sprite.x + sprite.size / 2, sprite.y + sprite.size / 2);
//       context.rotate(sprite.rotation * (Math.PI / 180));
//       context.drawImage(img, -sprite.size / 2, -sprite.size / 2, sprite.size, sprite.size);
//       context.restore();
//     };
//   };

//   return (
//     <div className="relative">
//       <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border" />
//     </div>
//   );
// };

// export default Stage;
import React, { useState, useRef, useCallback } from 'react';

const Stage = ({ sprites, onDragStart }) => {
  const [draggingSprite, setDraggingSprite] = useState(null);
  const stageRef = useRef(null);

  // Function to calculate the mouse position relative to the stage
  const getMousePos = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Handle mouse down: start dragging the sprite
  const handleMouseDown = (e, sprite) => {
    const mousePos = getMousePos(e);
    setDraggingSprite({
      ...sprite,
      initialMousePos: mousePos,
      initialSpritePos: { x: sprite.x, y: sprite.y },
    });
  };

  // Handle mouse move: move the sprite based on mouse position
  const handleMouseMove = useCallback(
    (e) => {
      if (!draggingSprite) return;

      const mousePos = getMousePos(e);

      // Calculate how much the mouse has moved since drag started
      const dx = mousePos.x - draggingSprite.initialMousePos.x;
      const dy = mousePos.y - draggingSprite.initialMousePos.y;

      // Update the sprite's position
      const updatedSprite = {
        ...draggingSprite,
        x: draggingSprite.initialSpritePos.x + dx,
        y: draggingSprite.initialSpritePos.y + dy,
      };

      // Call the parent component to update sprite position
      onDragStart(updatedSprite);
    },
    [draggingSprite, onDragStart]
  );

  // Stop dragging when the mouse is released or leaves the area
  const handleMouseUp = () => {
    setDraggingSprite(null); // Stop dragging
  };

  const handleMouseLeave = () => {
    setDraggingSprite(null); // Stop dragging if the mouse leaves the stage area
  };

  return (
    <div
      ref={stageRef}
      className="relative"
      style={{
        width: '480px',
        height: '360px',
        border: '1px solid #000',
        backgroundColor: '#f0f0f0',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid or background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: 'url(grid-background.png) repeat', // Optional grid background
        }}
      />
      
      {sprites.map((sprite, index) => (
        <div
          key={index}
          className="sprite"
          style={{
            position: 'absolute',
            top: `${sprite.y}px`,
            left: `${sprite.x}px`,
            width: `${sprite.size}px`,
            height: `${sprite.size}px`,
            backgroundImage: `url(${sprite.image})`,
            backgroundSize: 'cover',
            cursor: 'pointer',
            zIndex: draggingSprite?.id === sprite.id ? 10 : 1, // Bring dragged sprite to front
          }}
          onMouseDown={(e) => handleMouseDown(e, sprite)}
        />
      ))}
    </div>
  );
};

export default Stage;
