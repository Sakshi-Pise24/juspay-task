export const executeBlock = async (block, updateSprite, spriteId, stageWidth, stageHeight) => {
  return new Promise((resolve) => {
    updateSprite(spriteId, (prevSprite) => {
      let updatedSprite = { ...prevSprite };

      switch (block.type) {
        case 'move_right':
          updatedSprite.x = Math.min(updatedSprite.x + block.values.n, stageWidth - updatedSprite.size);
          break;

        case 'move_left':
          updatedSprite.x = Math.max(updatedSprite.x - block.values.n, 0);
          break;

        case 'turn_right':
          updatedSprite.rotation = (updatedSprite.rotation + block.values.n) % 360;
          break;

        case 'turn_left':
          updatedSprite.rotation = (updatedSprite.rotation - block.values.n + 360) % 360;
          break;

        case 'goto':
          updatedSprite.x = Math.max(0, Math.min(block.values.x, stageWidth - updatedSprite.size));
          updatedSprite.y = Math.max(0, Math.min(block.values.y, stageHeight - updatedSprite.size));
          break;

        case 'show':
          updatedSprite.isVisible = true;
          break;

        case 'hide':
          updatedSprite.isVisible = false;
          break;

        case 'size':
          updatedSprite.size = block.values.n;
          break;

        case 'repeat_animation':
          updatedSprite.animation = { type: 'move', steps: block.values.steps };
          break;

        case 'set_direction':
          updatedSprite.rotation = block.values.direction === 'left' ? 180 : 0;
          break;

        default:
          break;
      }

      return updatedSprite;
    });

    if (block.type === 'wait') {
      setTimeout(resolve, block.values.n * 1000);
    } else {
      setTimeout(resolve, 50); // Add a small delay for visual effect
    }
  });
};

export const runProgram = async (blocks, updateSprite, isRunning, spriteId, stageWidth, stageHeight) => {
  for (const block of blocks) {
    if (!isRunning.current) break;
    await executeBlock(block, updateSprite, spriteId, stageWidth, stageHeight);
  }
};

export const detectCollision = (sprites) => {
  const collidedSprites = [];
  for (let i = 0; i < sprites.length; i++) {
    for (let j = i + 1; j < sprites.length; j++) {
      const sprite1 = sprites[i];
      const sprite2 = sprites[j];
      const dx = sprite1.x - sprite2.x;
      const dy = sprite1.y - sprite2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < (sprite1.size + sprite2.size) / 2) {
        collidedSprites.push(sprite1, sprite2);
        return collidedSprites;
      }
    }
  }
  return collidedSprites;
};