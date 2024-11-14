import React, { useState, useRef, useEffect } from 'react';

export default function Component({ 
  sprites, 
  onUpdateSprite, 
  width, 
  height, 
  onSpriteSelect, 
  selectedSpriteId 
}) {
  const [draggingSprite, setDraggingSprite] = useState(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingSprite) {
        const stageRect = stageRef.current.getBoundingClientRect();
        let newX = e.clientX - stageRect.left - draggingSprite.offsetX;
        let newY = e.clientY - stageRect.top - draggingSprite.offsetY;

        newX = Math.max(0, Math.min(newX, width - draggingSprite.width));
        newY = Math.max(0, Math.min(newY, height - draggingSprite.height));

        onUpdateSprite(draggingSprite.id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setDraggingSprite(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingSprite, onUpdateSprite, width, height]);

  const handleMouseDown = (e, sprite) => {
    e.stopPropagation();
    const stageRect = stageRef.current.getBoundingClientRect();
    setDraggingSprite({
      id: sprite.id,
      offsetX: e.clientX - stageRect.left - sprite.x,
      offsetY: e.clientY - stageRect.top - sprite.y,
      width: sprite.size,
      height: sprite.size,
    });
    onSpriteSelect(sprite.id);
  };

  return (
    <div
      ref={stageRef}
      className="relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: '1px solid #000',
        backgroundColor: '#f0f0f0',
      }}
    >
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          className={`sprite ${selectedSpriteId === sprite.id ? 'ring-2 ring-blue-500' : ''} ${
            sprite.collided ? 'animate-pulse' : ''
          }`}
          style={{
            position: 'absolute',
            top: `${sprite.y}px`,
            left: `${sprite.x}px`,
            width: `${sprite.size}px`,
            height: `${sprite.size}px`,
            backgroundImage: `url(${sprite.image})`,
            backgroundSize: 'cover',
            cursor: 'move',
            display: sprite.isVisible ? 'block' : 'none',
            transform: `scaleX(${sprite.rotation === 180 ? -1 : 1}) rotate(${sprite.rotation}deg)`,
          }}
          onMouseDown={(e) => handleMouseDown(e, sprite)}
        />
      ))}
    </div>
  );
}