const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 1024;
const block = 4;

window.requestAnimationFrame(loop);

function loop() {
	generate(2 ** 10 + 1);

	//requestAnimationFrame(loop);
}

function generate(size) {
	let points = [Math.random(), Math.random(), Math.random(), Math.random()];
	let map = new Array(size * size);

	map[0 + 0 * size] = points[0];
	map[size - 1 + 0 * size] = points[1];
	map[size - 1 + (size - 1) * size] = points[2];
	map[0 + (size - 1) * size] = points[3];

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			genBlock(map, size, x, y);
			drawBlock(map, size, x, y);
		}
	}
}

function genBlock(map, size, x, y) {
	build_map(map, size, [x * 13, y * 13, 14, 14]);
}

function drawBlock(map, size, x, y) {
	//build_map(map, size, [x*13,y*13, 13, 13]);
	draw(map, size, x * 100, y * 100, 100, 100, x * 100, y * 100); //
}

function draw(map, size, szx, szy, blszx, blszy, px, py) {
	let imgx = 100;
	let imgy = 100;
	let imageData = ctx.createImageData(imgx, imgy);
	let data = imageData.data;
	for (let y = 0; y < blszy; y++) {
		for (let x = szx; x < blszx + szx; x++) {
			let rgb = Math.round(map[x + (y + szy) * size] * 255);
			let red = 255;
			let green = 255;
			let blue = 255;
			if (rgb <= 255 && rgb > 230) {
				red = 255;
				green = 255;
				blue = 255;
			} else if (rgb <= 230 && rgb > 220) {
				red = 155;
				green = 155;
				blue = 0;
			} else if (rgb <= 220 && rgb > 200) {
				red = 0;
				green = 128;
				blue = 0;
			} else if (rgb <= 200 && rgb > 170) {
				red = 0;
				green = 90;
				blue = 0;
			} else if (rgb <= 170 && rgb > 150) {
				red = 0;
				green = 155;
				blue = 0;
			} else if (rgb <= 150 && rgb > 140) {
				red = 181;
				green = 193;
				blue = 136;
			} else if (rgb <= 140 && rgb > 130) {
				red = 245;
				green = 241;
				blue = 162;
			} else if (rgb <= 130 && rgb > 100) {
				red = 0;
				green = 0;
				blue = 255;
			} else if (rgb <= 100 && rgb > 70) {
				red = 0;
				green = 0;
				blue = 200;
			} else if (rgb <= 70 && rgb > 50) {
				red = 0;
				green = 0;
				blue = 170;
			} else if (rgb <= 50 && rgb > 20) {
				red = 0;
				green = 0;
				blue = 120;
			} else if (rgb <= 20 && rgb > 0) {
				red = 29;
				green = 51;
				blue = 74;
			}
			if (x == szx || y == 0 || x == blszx + szx - 1 || y == blszy - 1) {
				red = 0;
				green = 0;
				blue = 0;
			}
			data[4 * (x - szx + y * imgx) + 0] = red;
			data[4 * (x - szx + y * imgx) + 1] = green;
			data[4 * (x - szx + y * imgx) + 2] = blue;
			data[4 * (x - szx + y * imgx) + 3] = 255;
		}
	}
	ctx.putImageData(imageData, px, py);
	return imageData;
}

function build_map(map, size, offset = [0, 0, 32, 32]) {
	for (let y = offset[1]; y < offset[1] + offset[3]; y++) {
		for (let x = offset[0]; x < offset[0] + offset[2]; x++) {
			getblock(map, size, block * 2 * x - 1, block * 2 * y - 1);
		}
	}

	return map;
}

function getblock(map, size, cx, cy) {
	let e = 0.011;

	diamond(map, size, 0, 0, size - 1, size - 1, e, cx, cy);
}

function diamond(map, size, x1, y1, x2, y2, e, x, y) {
	let mid_x = (x1 + x2) / 2;
	let mid_y = (y1 + y2) / 2;
	let mean = (map[x1 + y1 * size] + map[x2 + y1 * size] + map[x2 + y2 * size] + map[x1 + y2 * size]) / 4.0;

	let r = Math.random() * 2.0 - 1.0;
	map[mid_x + mid_y * size] = mean + r * e;

	square(map, size, [mid_x, y1 - (mid_y - y1), mid_x, mid_y, x2, y1, x1, y1], mid_x, y1, e); //Up
	square(map, size, [mid_x, mid_y, mid_x, y2 + (y2 - mid_y), x2, y2, x1, y2], mid_x, y2, e); //Down
	square(map, size, [x2, y1, x2, y2, x2 + (x2 - mid_x), mid_y, mid_x, mid_y], x2, mid_y, e); //Right
	square(map, size, [x1, y1, x1, y2, mid_x, mid_y, x1 - (mid_x - x1), mid_y], x1, mid_y, e); //Left

	if (mid_x - x1 > 1) {
		e *= 0.7;
		if (mid_x - x1 <= block) {
			diamond(map, size, mid_x, y1, x2, mid_y, e, x, y);
			diamond(map, size, x1, y1, mid_x, mid_y, e, x, y);
			diamond(map, size, mid_x, mid_y, x2, y2, e, x, y);
			diamond(map, size, x1, mid_y, mid_x, y2, e, x, y);
		} else {
			if (mid_x <= x && mid_y >= y) {
				//console.log("Top-right", mid_x);
				diamond(map, size, mid_x, y1, x2, mid_y, e, x, y); //Top-right
			} else if (mid_x >= x && mid_y >= y) {
				//console.log("Top-left", mid_x);
				diamond(map, size, x1, y1, mid_x, mid_y, e, x, y); //Top-left
			} else if (mid_x <= x && mid_y <= y) {
				//console.log("Bottom-right", mid_y);
				diamond(map, size, mid_x, mid_y, x2, y2, e, x, y); //Bottom-right
			} else if (mid_x >= x && mid_y <= y) {
				//console.log("Bottom-left", mid_y);
				diamond(map, size, x1, mid_y, mid_x, y2, e, x, y); //Bottom-left
			}
		}
	}
}

function square(map, size, points, diamond_mid_x, diamond_mid_y, e) {
	let mean = 0.0,
		count = 0;
	//console.log([diamond_mid_x,diamond_mid_y]);

	//If the value has already been set in a previous call, return
	if (map[diamond_mid_x + diamond_mid_y * size] !== undefined) return;

	for (let i = 0; i < points.length; i += 2) {
		let x = points[i],
			y = points[i + 1];

		if (x < 0) x = size + x;
		if (x >= size) x = x - size - 1;
		if (y < 0) y = size + y;
		if (y >= size) y = y - size - 1;
		if (map[x + y * size] === undefined) continue;

		mean += map[x + y * size];
		count++;
	}
	//	console.log(count);
	let r = Math.random() * 2.0 - 1.0;
	map[diamond_mid_x + diamond_mid_y * size] = mean / count + r * e;
}