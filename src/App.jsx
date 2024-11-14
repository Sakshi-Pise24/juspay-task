
// import React, { useState, useRef } from 'react';
// import BlockPalette from './components/BlockPalette/BlockPalette';
// import Workspace from './components/Workspace/Workspace';
// import Stage from './components/Stage/Stage';
// import SpriteManager from './components/Sprites/SpriteManager';
// import { runProgram } from './utils/blockExecutor';

// const App = () => {
//   const [activeCategory, setActiveCategory] = useState('motion');
//   const [workspace, setWorkspace] = useState([]);
//   const [sprites, setSprites] = useState([]);
//   const [isRunning, setIsRunning] = useState(false);
//   const [showSpriteOptions, setShowSpriteOptions] = useState(false);
//   const isRunningRef = useRef(false);

//   // Handle adding new sprite to the workspace
//   const handleAddSprite = (spriteType) => {
//     const offset = sprites.length * 20; // Increment position by 20 pixels for each sprite
//     const newSprite = {
//       id: Date.now(),
//       type: spriteType,
//       x: offset,
//       y: offset,
//       rotation: 0,
//       size: 100,
//       isVisible: true,
//       image: spriteType === 'cat' ? '/cat.png' : '/ball.png',
//       animation: 'moveRight', // Default animation
//     };
//     setSprites(prevSprites => [...prevSprites, newSprite]);
//     setShowSpriteOptions(false);
//   };

//   // Handle Block Management
//   const handleBlockAdd = (blockData) => setWorkspace(prev => [...prev, blockData]);
//   const handleBlockRemove = (index) => setWorkspace(prev => prev.filter((_, i) => i !== index));
//   const handleBlockParameterChange = (index, values) => setWorkspace(prev => prev.map((block, i) => i === index ? { ...block, values } : block));

//   const handleRun = async () => {
//     setIsRunning(true);
//     isRunningRef.current = true;
//     await runProgram(workspace, setSprites, isRunningRef);
//     setIsRunning(false);
//     isRunningRef.current = false;
//   };

//   const handleStop = () => {
//     setIsRunning(false);
//     isRunningRef.current = false;
//   };

//   const handleReset = () => setSprites([]);

//   const handleUpdateSprite = (spriteId, updatedProperties) => {
//     setSprites(prevSprites =>
//       prevSprites.map(sprite =>
//         sprite.id === spriteId ? { ...sprite, ...updatedProperties } : sprite
//       )
//     );
//   };

//   const handleDragStart = (e, spriteId) => e.dataTransfer.setData('spriteId', spriteId);
//   const handleDrop = (e) => {
//     const spriteId = e.dataTransfer.getData('spriteId');
//     const sprite = sprites.find((sprite) => sprite.id === parseInt(spriteId));
//     if (sprite) {
//       const updatedSprite = { ...sprite, x: e.clientX, y: e.clientY };
//       setSprites(prevSprites => prevSprites.map(s => s.id === sprite.id ? updatedSprite : s));
//     }
//   };

//   const handleDragOver = (e) => e.preventDefault(); // Allow dropping

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 flex">
//       {/* Main Flex container to divide the screen into 3 sections */}
//       <div className="flex w-full">
//         {/* Left section: Block Palette (1/4 width) */}
//         <div className="w-1/4 p-4 border-r-2">
//           <BlockPalette activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
//         </div>

//         {/* Middle section: Code Area (2/4 width) */}
//         <div className="w-2/4 p-4">
//           <Workspace
//             blocks={workspace}
//             onBlockAdd={handleBlockAdd}
//             onBlockRemove={handleBlockRemove}
//             onBlockParameterChange={handleBlockParameterChange}
//             onRun={handleRun}
//             onStop={handleStop}
//             isRunning={isRunning}
//           />
//         </div>

//         {/* Right section: Stage Area (1/4 width) */}
//         <div className="w-1/4 p-4 flex flex-col items-center">
//           <div className="w-full relative" onDrop={handleDrop} onDragOver={handleDragOver}>
//             <Stage sprites={sprites} onReset={handleReset} onDragStart={handleDragStart} />
//           </div>

//           {/* Add Sprite Button */}
//           <div className="mt-4 flex justify-center gap-4">
//             <button
//               onClick={() => setShowSpriteOptions(prev => !prev)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//             >
//               Add Sprite
//             </button>
//           </div>

//           {/* Sprite options */}
//           {showSpriteOptions && (
//             <div className="mt-4 flex justify-center gap-4">
//               <button
//                 onClick={() => handleAddSprite('cat')}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Cat Sprite
//               </button>
//               <button
//                 onClick={() => handleAddSprite('ball')}
//                 className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Ball Sprite
//               </button>
//             </div>
//           )}

//           {/* Reset Button */}
//           <button
//             onClick={handleReset}
//             className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Sprite Management (optional below sections) */}
//       <div className="w-full p-4">
//         {sprites.map(sprite => (
//           <SpriteManager key={sprite.id} sprite={sprite} onUpdate={handleUpdateSprite} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;
// 
import React, { useState, useRef } from 'react';
import BlockPalette from './components/BlockPalette/BlockPalette';
import Workspace from './components/Workspace/Workspace';
import Stage from './components/Stage/Stage';
import SpriteManager from './components/Sprites/SpriteManager';
import { runProgram } from './utils/blockExecutor';

const App = () => {
  const [activeCategory, setActiveCategory] = useState('motion');
  const [workspace, setWorkspace] = useState([]);
  const [sprites, setSprites] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showSpriteOptions, setShowSpriteOptions] = useState(false);
  const isRunningRef = useRef(false);

  const STAGE_WIDTH = 400; // Assuming the stage has a width of 400px
  const SPRITE_SPACING = 200; // Space between each sprite

  React.useEffect(() => {
    console.log('Updated sprites:', sprites); // Debugging log
  }, [sprites]);

  // Handle adding new sprite to the workspace
  const handleAddSprite = (spriteType) => {
    console.log('Adding sprite of type:', spriteType); // Debug log
  
    const spriteX = sprites.length > 0 ? (sprites.length * SPRITE_SPACING) % STAGE_WIDTH : 0;
    const spriteY = sprites.length > 0 ? Math.floor((sprites.length * SPRITE_SPACING) / STAGE_WIDTH) * SPRITE_SPACING : 0;
  
    const newSprite = {
      id: Date.now(),
      type: spriteType,
      x: spriteX,
      y: spriteY,
      rotation: 0,
      size: 100,
      isVisible: true,
      image: spriteType === 'cat' ? '/cat.png' : '/ball.png',
      animation: 'moveRight',
    };
  
    setSprites((prevSprites) => {
      console.log('Previous sprites array:', prevSprites); // Debug log
      return [...prevSprites, newSprite];
    });
  
    setShowSpriteOptions(false);
  };
  
  // Handle Block Management
const handleBlockAdd = (blockData) => {
  console.log("block data",blockData)
  setWorkspace((prev) => [...prev, blockData]);}

  const handleBlockRemove = (index) => setWorkspace((prev) => prev.filter((_, i) => i !== index));
  const handleBlockParameterChange = (index, values) =>
    setWorkspace((prev) => prev.map((block, i) => (i === index ? { ...block, values } : block)));

  const handleRun = async () => {
    setIsRunning(true);
    isRunningRef.current = true;
    await runProgram(workspace, setSprites, isRunningRef);
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const handleStop = () => {
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const handleReset = () => setSprites([]);

  const handleUpdateSprite = (spriteId, updatedProperties) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) => (sprite.id === spriteId ? { ...sprite, ...updatedProperties } : sprite))
    );
  };

  // Drag functionality (starting drag)
  const [draggingSpriteId, setDraggingSpriteId] = useState(null);
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e, spriteId) => {
    const sprite = sprites.find((s) => s.id === spriteId);
    if (sprite) {
      const offsetX = e.clientX - sprite.x;
      const offsetY = e.clientY - sprite.y;
      setDraggingSpriteId(spriteId);
      setDraggingOffset({ x: offsetX, y: offsetY });
    }
  };

  const handleDragMove = (e) => {
    if (draggingSpriteId) {
      const newX = e.clientX - draggingOffset.x;
      const newY = e.clientY - draggingOffset.y;
      setSprites((prevSprites) =>
        prevSprites.map((sprite) =>
          sprite.id === draggingSpriteId ? { ...sprite, x: newX, y: newY } : sprite
        )
      );
    }
  };

  const handleDragEnd = () => {
    setDraggingSpriteId(null);
  };

  // Handle sprite drop
  const handleDrop = () => {
    setDraggingSpriteId(null); // Stop dragging when the mouse is released
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-8 flex flex-col"
      onMouseMove={handleDragMove} // Track the mouse movement while dragging
      onMouseUp={handleDragEnd} // Handle when the mouse button is released (drop)
    >
      {/* Main Flex container to divide the screen into 3 sections */}
      <div className="flex w-full">
        {/* Left section: Block Palette (1/4 width) */}
        <div className="w-1/4 p-4 border-r-2">
          <BlockPalette activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>

        {/* Middle section: Code Area (2/4 width) */}
        <div className="w-2/4 p-4">
          <Workspace
            blocks={workspace}
            onBlockAdd={handleBlockAdd}
            onBlockRemove={handleBlockRemove}
            onBlockParameterChange={handleBlockParameterChange}
            onRun={handleRun}
            onStop={handleStop}
            isRunning={isRunning}
          />
        </div>

        {/* Right section: Stage Area (1/4 width) */}
        <div className="w-1/4 p-4 flex flex-col items-center">
          <div className="w-full relative" onDrop={handleDrop}>
            <Stage
              sprites={Array.isArray(sprites) ? sprites : []} // Ensure sprites is an array
              onReset={handleReset}
              onDragStart={handleDragStart}
              draggingSpriteId={draggingSpriteId}
            />
          </div>

          {/* Add Sprite Button */}
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setShowSpriteOptions((prev) => !prev)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Sprite
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Sprite Management */}
      <div className="w-full p-4">
        {Array.isArray(sprites) && sprites.map((sprite) => (
          <SpriteManager key={sprite.id} sprite={sprite} onUpdate={handleUpdateSprite} />
        ))}
      </div>

      {/* Animation Selector Block at the bottom */}
      {showSpriteOptions && (
        <div className="absolute bottom-8 left-0 right-0 p-4 bg-gray-800 text-white flex justify-start gap-4 overflow-x-auto">
          <button
            onClick={() => handleAddSprite('cat')}
            className="bg-green-500 text-white w-12 h-12 rounded-md"
          >
            <img src="/cat.png" alt="cat" className="w-full h-full object-cover rounded-md" />
          </button>
          <button
            onClick={() => handleAddSprite('ball')}
            className="bg-yellow-500 text-white w-12 h-12 rounded-md"
          >
            <img src="/ball.png" alt="ball" className="w-full h-full object-cover rounded-md" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
