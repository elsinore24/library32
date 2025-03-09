import RAPIER from '@dimforge/rapier3d-compat';

let world: RAPIER.World;
let initialized = false;

export async function initPhysics() {
  if (initialized) return;
  
  await RAPIER.init();
  
  // Create a new physics world
  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
  
  initialized = true;
  return world;
}

export function getWorld() {
  if (!initialized) {
    throw new Error('Physics engine not initialized. Call initPhysics() first.');
  }
  return world;
}

export function createBookBody(position: { x: number; y: number; z: number }) {
  if (!world) return null;

  // Book rigid body
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(position.x, position.y, position.z);
  
  const rigidBody = world.createRigidBody(bodyDesc);

  // Book collider (cuboid shape)
  const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.7, 0.1);
  world.createCollider(colliderDesc, rigidBody);

  return rigidBody;
}

export function updatePhysics(deltaTime: number) {
  if (!world) return;
  world.step();
}

// Cleanup function
export function cleanupPhysics() {
  if (world) {
    world.free();
    initialized = false;
  }
}
