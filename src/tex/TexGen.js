import sobel from './sobel.js'
import textures from './textures.js'

const renderSVG = (src) => {
	const svg = new Image()
	svg.src = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' }))
	return new Promise((resolve) => {
		svg.onload = () => {
			const ctx = document.createElement('canvas').getContext('2d')
			ctx.drawImage(svg, 0, 0)
			resolve(ctx)
		}
	})
}

const TILETEXTURES = [
	textures.sphere('#f44', 26), // R
	textures.sphere('#4f4', 26), // G
	textures.sphere('#44f', 26), // B
	textures.sphere('#ff4', 26), // Y
	textures.sphere('#4ff', 26), // C
	textures.sphere('#f4f', 26), // M
	textures.sphere('#fff', 26), // W
	textures.bricks('#fff', '#fff', '#888', 0, 0, 63.5, 63.5, .5, 0, 255), // floor
	textures.bricks('#a55', '#aaa', '#fffa', .9, .5, 30, 14, 2, 16, 40, 2), // wall
	textures.nil(),
	textures.plate('#f44', 22), // r
	textures.plate('#4f4', 22), // g
	textures.plate('#44f', 22), // b
	textures.plate('#ff4', 22), // y
	textures.plate('#4ff', 22), // c
	textures.plate('#f4f', 22), // m
	textures.plate('#fff', 22), // w
	textures.crate('#320', 0),
	textures.portal(26),
	textures.sphere('#fff', 30), // player
	textures.checkerBoard('#fc3', '#421'), // player
	textures.bricks('#aac', '#ddd', '#fff3', 0, 0, 31, 31, 1, 0, 100), // floor
	textures.wood('#fed'), // floor
	textures.bricks('#333', '#444', '#fff3', .7, .01, 30, 14, 2, 16, 8), // wall
	textures.crate('#d72', 1),
	textures.marble('#fff', 8),
	textures.stone(),
	textures.panel('#8ac', '#0000', true), // wall
	textures.panel('#46b', '#0007', true), // wall
	textures.crate('#820', 2),
	textures.bricks('#fa7', '#e86', '#fff4', .07, .2, 30, 30, 2, 16, 200, 2), // wall
	textures.bricks('#459', '#222', '#fff3', .7, .01, 15, 15, 1, 7, 32, 2), // wall
	textures.bricks('#ccc', '#777', '#fff2', .07, .1, 60, 60, 2, 0, 20), // floor
	textures.bricks('#ccf', '#ccf', '#fffb', .47, .1, 64, 64, 0, 0, 20), // floor
	textures.panel('#a64', '#fff3', false), // wall
	textures.bricks('#2cf', '#567', '#aaa3', 0, 0, 3, 3, 1, 2, 30), // floor
	textures.metalCrate(),
	textures.roundedTile(), // floor
]

export default () => new Promise((resolve) => {
	const diffuse = [], normals = []

	const tiles = TILETEXTURES.map((t, i) => new Promise((r) => {
		Promise.all([
			renderSVG(t[0]).then((img) => diffuse[i] = img),
			renderSVG(t[1]).then((img) => normals[i] = img)
		]).then(r)
	}))

	Promise.all(tiles).then(() => {
		resolve([
			diffuse.map((t) => t.getImageData(0, 0, 64, 64)),
			normals.map((t, i) => sobel(t.getImageData(0, 0, 64, 64), TILETEXTURES[i][2], TILETEXTURES[i][3]))
		])
	})
})
