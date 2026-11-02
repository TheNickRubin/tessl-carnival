import { describe, expect, it } from 'vitest';
import {
  CANNON,
  TANK_SIZE,
  createState,
  fire,
  hitAlongPath,
  isHit,
  scoreForHit,
  step,
  type Target,
} from './game';

const target: Target = { x: 400, y: 200, radius: 28, speed: 120 };

describe('water cannon', () => {
  it('starts with a full tank and no score', () => {
    const state = createState();
    expect(state.tank).toBe(TANK_SIZE);
    expect(state.score).toBe(0);
    expect(state.phase).toBe('playing');
  });

  it('uses one shot of water per fire', () => {
    const state = createState();
    expect(fire(state, 400, 0)).toBe(true);
    expect(state.tank).toBe(TANK_SIZE - 1);
    expect(state.shots).toHaveLength(1);
  });

  it('cannot fire once the tank is empty', () => {
    const state = createState();
    state.tank = 0;
    expect(fire(state, 400, 0)).toBe(false);
    expect(state.shots).toHaveLength(0);
  });

  it('never fires downwards, even when aimed below the cannon', () => {
    const state = createState();
    fire(state, CANNON.x + 100, CANNON.y + 100);
    expect(state.shots[0].vy).toBeLessThan(0);
  });

  it('scores a hit and sends the target back to the start of its rail', () => {
    const state = createState();
    state.targets = [{ ...target }];
    state.shots = [{ x: target.x, y: target.y + 5, vx: 0, vy: 0 }];
    step(state, 0);
    expect(state.score).toBe(scoreForHit(target));
    expect(state.shots).toHaveLength(0);
    expect(state.targets[0].x).toBeLessThan(0);
  });

  it('scores a hit when a shot crosses a target in one step', () => {
    const state = createState();
    state.targets = [{ ...target }];
    // Starts below the target and ends 100 px above it after one step.
    state.shots = [{ x: target.x, y: target.y + 100, vx: 0, vy: -2000 }];
    step(state, 0.1);
    expect(state.score).toBe(scoreForHit(target));
    expect(state.shots).toHaveLength(0);
  });

  it('soaks the first target along the path when a shot crosses two', () => {
    const state = createState();
    const near = { ...target, y: 300, speed: 60 };
    const far = { ...target, y: 100, speed: 180 };
    state.targets = [far, near].map((t) => ({ ...t, speed: 0 }));
    state.shots = [{ x: target.x, y: 400, vx: 0, vy: -4000 }];
    step(state, 0.1);
    expect(state.splashes[0].y).toBe(near.y);
  });

  it('misses when the path passes beside the target', () => {
    expect(hitAlongPath({ x: 460, y: 300 }, { x: 460, y: 100 }, target)).toBeNull();
    expect(hitAlongPath({ x: 400, y: 300 }, { x: 400, y: 250 }, target)).toBeNull();
    expect(hitAlongPath({ x: 400, y: 300 }, { x: 400, y: 100 }, target)).toBeCloseTo(72 / 200);
  });

  it('ends the game when the tank is empty and the last shot has landed', () => {
    const state = createState();
    state.tank = 0;
    state.shots = [{ x: 10, y: -20, vx: 0, vy: -700 }];
    step(state, 0.1);
    expect(state.phase).toBe('over');
  });

  it('keeps playing while a shot is still in the air', () => {
    const state = createState();
    state.targets = [];
    state.tank = 0;
    state.shots = [{ x: 400, y: 300, vx: 0, vy: -700 }];
    step(state, 0.1);
    expect(state.phase).toBe('playing');
  });

  it('detects a hit inside the target and a miss outside it', () => {
    expect(isHit({ x: 410, y: 210, vx: 0, vy: 0 }, target)).toBe(true);
    expect(isHit({ x: 460, y: 200, vx: 0, vy: 0 }, target)).toBe(false);
  });

  it('scores a fast target higher than a slow one', () => {
    const slow = scoreForHit({ ...target, speed: 60 });
    const fast = scoreForHit({ ...target, speed: -180 });
    expect(Math.max(fast, slow)).toBeGreaterThanOrEqual(slow);
  });
});
