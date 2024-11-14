import React from 'react';
import { Trash2 } from 'lucide-react';

export default function Component({ sprite, onUpdate, isSelected, onRemove }) {
  return (
    <div className={`p-4 mb-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{sprite.type} Sprite</h3>
        <button
          onClick={() => onRemove(sprite.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Remove sprite"
        >
          <Trash2 size={20} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <img src={sprite.image} alt={sprite.type} className="w-12 h-12" />
        <div>
          <p>X: {Math.round(sprite.x)}</p>
          <p>Y: {Math.round(sprite.y)}</p>
          <p>Rotation: {Math.round(sprite.rotation)}°</p>
        </div>
      </div>
    </div>
  );
}