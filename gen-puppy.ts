// Dumps the puppy's SVG path data to JSON so the p5 sketch can resample it as ink.
import * as g from './puppy-geometry.ts';
const out = {
	farLegs: g.farLegs, nearLegs: g.nearLegs, body: g.body, haunch: g.haunch, tail: g.tail,
	head: g.head, ears: g.ears, muzzle: g.muzzle, nose: g.nose, eyes: g.eyes, brows: g.brows,
	mouth: g.mouth, wagMarks: g.wagMarks, legBridge: g.legBridge,
	headScale: g.HEAD_SCALE, tailPivot: g.TAIL_PIVOT, viewBox: g.VIEWBOX,
	headT: { x: 316, y: 300, rot: -0.14, s: g.HEAD_SCALE },
	colors: { INK: g.INK, GOLD: g.GOLD, SHADE: g.SHADE, CREAM: g.CREAM },
};
await Bun.write('puppy.json', JSON.stringify(out));
console.log('ok');
