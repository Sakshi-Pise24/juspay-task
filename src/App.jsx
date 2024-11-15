import React, { useState, useRef, useEffect, useCallback } from 'react';
import BlockPalette from './components/BlockPalette/BlockPalette';
import Workspace from './components/Workspace/Workspace';
import Stage from './components/Stage/Stage';
import SpriteManager from './components/Sprites/SpriteManager';
import { runProgram, detectCollision } from './utils/blockExecutor';
// import { Trash2 } from 'lucide-react';

export default function Component() {
  const [activeCategory, setActiveCategory] = useState('motion');
  const [workspaces, setWorkspaces] = useState({});
  const [sprites, setSprites] = useState([]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSpriteOptions, setShowSpriteOptions] = useState(false);
  const isRunningRef = useRef(false);

  const STAGE_WIDTH = 480;
  const STAGE_HEIGHT = 360;

  const handleCollision = useCallback((sprite1, sprite2) => {
    // Swap positions
    const tempX = sprite1.x;
    const tempY = sprite1.y;

    setSprites(prevSprites => prevSprites.map(sprite => {
      if (sprite.id === sprite1.id) {
        return { ...sprite, x: sprite2.x, y: sprite2.y };
      } else if (sprite.id === sprite2.id) {
        return { ...sprite, x: tempX, y: tempY };
      }
      return sprite;
    }));

    // Swap workspaces (actions)
    const tempWorkspace = workspaces[sprite1.id];
    setWorkspaces(prev => ({
      ...prev,
      [sprite1.id]: workspaces[sprite2.id],
      [sprite2.id]: tempWorkspace
    }));

    // Visualize collision (e.g., brief color change)
    setSprites(prevSprites => prevSprites.map(sprite => {
      if (sprite.id === sprite1.id || sprite.id === sprite2.id) {
        return { ...sprite, collided: true };
      }
      return sprite;
    }));

    // Reset collision visualization after a short delay
    setTimeout(() => {
      setSprites(prevSprites => prevSprites.map(sprite => {
        if (sprite.id === sprite1.id || sprite.id === sprite2.id) {
          return { ...sprite, collided: false };
        }
        return sprite;
      }));
    }, 500);
  }, [workspaces, setWorkspaces, setSprites]);

  useEffect(() => {
    if (isRunning) {
      const collisionInterval = setInterval(() => {
        const collidedSprites = detectCollision(sprites);
        if (collidedSprites.length === 2) {
          handleCollision(collidedSprites[0], collidedSprites[1]);
        }
      }, 100);

      return () => clearInterval(collisionInterval);
    }
  }, [isRunning, sprites, handleCollision]);

  const handleAddSprite = (spriteType) => {
    const newSprite = {
      id: Date.now(),
      type: spriteType,
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      rotation: 0,
      size: 100,
      isVisible: true,
      image: spriteType === 'cat' ? '/cat.png' : '/ball.png',
      animation: { type: 'move', steps: 10 },
      collided: false
    };

    setSprites((prevSprites) => [...prevSprites, newSprite]);
    setWorkspaces((prevWorkspaces) => ({
      ...prevWorkspaces,
      [newSprite.id]: []
    }));
    setSelectedSpriteId(newSprite.id);
    setShowSpriteOptions(false);
  };

  const handleRemoveSprite = (spriteId) => {
    setSprites((prevSprites) => prevSprites.filter((sprite) => sprite.id !== spriteId));
    setWorkspaces((prevWorkspaces) => {
      const { [spriteId]: removed, ...rest } = prevWorkspaces;
      return rest;
    });
    if (selectedSpriteId === spriteId) {
      setSelectedSpriteId(null);
    }
  };

  const handleBlockAdd = (blockData) => {
    if (selectedSpriteId) {
      setWorkspaces((prevWorkspaces) => ({
        ...prevWorkspaces,
        [selectedSpriteId]: [...(prevWorkspaces[selectedSpriteId] || []), blockData]
      }));
    }
  };

  const handleBlockRemove = (index) => {
    if (selectedSpriteId) {
      setWorkspaces((prevWorkspaces) => ({
        ...prevWorkspaces,
        [selectedSpriteId]: prevWorkspaces[selectedSpriteId].filter((_, i) => i !== index)
      }));
    }
  };

  const handleBlockParameterChange = (index, values) => {
    if (selectedSpriteId) {
      setWorkspaces((prevWorkspaces) => ({
        ...prevWorkspaces,
        [selectedSpriteId]: prevWorkspaces[selectedSpriteId].map((block, i) => 
          i === index ? { ...block, values } : block
        )
      }));
    }
  };

  const handleRun = async () => {
    if (selectedSpriteId) {
      setIsRunning(true);
      isRunningRef.current = true;
      await runProgram(workspaces[selectedSpriteId], updateSprite, isRunningRef, selectedSpriteId, STAGE_WIDTH, STAGE_HEIGHT);
      setIsRunning(false);
      isRunningRef.current = false;
    }
  };

  const handlePlayAll = async () => {
    setIsRunning(true);
    isRunningRef.current = true;
    
    const allPrograms = Object.entries(workspaces).map(([spriteId, blocks]) => 
      runProgram(blocks, updateSprite, isRunningRef, Number(spriteId), STAGE_WIDTH, STAGE_HEIGHT)
    );

    await Promise.all(allPrograms);

    setIsRunning(false);
    isRunningRef.current = false;
  };

  const handleStop = () => {
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const handleReset = () => {
    setSprites(sprites.map(sprite => ({
      ...sprite,
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      rotation: 0,
      size: 100,
      isVisible: true,
      collided: false
    })));
    setWorkspaces(Object.fromEntries(Object.keys(workspaces).map(key => [key, []])));
  };

  const updateSprite = (spriteId, updater) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === spriteId
          ? (typeof updater === 'function' ? updater(sprite) : { ...sprite, ...updater })
          : sprite
      )
    );
  };

  const handleSpriteSelect = (spriteId) => {
    setSelectedSpriteId(spriteId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Scratch Clone</h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <BlockPalette activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          </div>
          <div className="col-span-5">
            <Workspace
              blocks={workspaces[selectedSpriteId] || []}
              onBlockAdd={handleBlockAdd}
              onBlockRemove={handleBlockRemove}
              onBlockParameterChange={handleBlockParameterChange}
              onRun={handleRun}
              onStop={handleStop}
              isRunning={isRunning}
            />
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handlePlayAll}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
              >
                Play All
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="col-span-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <Stage 
                sprites={sprites} 
                onUpdateSprite={updateSprite} 
                width={STAGE_WIDTH} 
                height={STAGE_HEIGHT}
                onSpriteSelect={handleSpriteSelect}
                selectedSpriteId={selectedSpriteId}
              />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowSpriteOptions((prev) => !prev)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {showSpriteOptions ? 'Hide Sprite Options' : 'Add Sprite'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Sprite Manager</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sprites.map((sprite) => (
              <SpriteManager 
                key={sprite.id} 
                sprite={sprite} 
                onUpdate={updateSprite}
                isSelected={sprite.id === selectedSpriteId}
                onRemove={handleRemoveSprite}
              />
            ))}
          </div>
        </div>
      </div>
      {showSpriteOptions && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 text-white flex justify-center gap-4">
          <button
            onClick={() => handleAddSprite('cat')}
            className="bg-green-500 text-white w-16 h-16 rounded-md hover:bg-green-600 transition-colors"
          >
            <img src="/cat.png" alt="cat" className="w-full h-full object-cover rounded-md" />
          </button>
          <button
            onClick={() => handleAddSprite('ball')}
            className="bg-yellow-500 text-white w-16 h-16 rounded-md hover:bg-yellow-600 transition-colors"
          >
            <img src="/ball.png" alt="ball" className="w-full h-full object-cover rounded-md" />
          </button>
        </div>
      )}
    </div>
  );
}