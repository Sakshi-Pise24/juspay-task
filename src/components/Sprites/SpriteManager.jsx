import React, { useState } from 'react';

const SpriteManager = ({ sprite, onUpdate }) => {
  const [animation, setAnimation] = useState(sprite.animation);
  const [visibility, setVisibility] = useState(sprite.isVisible);

  // Handle animation change
  const handleAnimationChange = (e) => {
    const newAnimation = e.target.value;
    setAnimation(newAnimation);
    onUpdate(sprite.id, { animation: newAnimation });
  };

  // Handle visibility toggle
  const handleVisibilityToggle = () => {
    const newVisibility = !visibility;
    setVisibility(newVisibility);
    onUpdate(sprite.id, { isVisible: newVisibility });
  };

  // Handle size change
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    onUpdate(sprite.id, { size: newSize });
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg mb-4">
      <h3 className="text-lg font-semibold">{sprite.type} - Animation</h3>
      
      {/* Animation Selector */}
      <select
        value={animation}
        onChange={handleAnimationChange}
        className="mt-2 p-2 border rounded-md"
      >
        <option value="moveRight">Move Right</option>
        <option value="moveLeft">Move Left</option>
        {/* Add more animations here as required */}
      </select>

      {/* Visibility Toggle */}
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          checked={visibility}
          onChange={handleVisibilityToggle}
          className="mr-2"
        />
        <label>Visible</label>
      </div>

      {/* Size Adjuster */}
      <div className="mt-4">
        <label>Size:</label>
        <input
          type="range"
          min="50"
          max="200"
          value={sprite.size}
          onChange={handleSizeChange}
          className="w-full mt-2"
        />
      </div>
    </div>
  );
};

export default SpriteManager;
