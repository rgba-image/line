"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const common_1 = require("@rgba-image/common");
const create_image_1 = require("@rgba-image/create-image");
const png_1 = require("@rgba-image/png");
const __1 = require("..");
const lineHelper = (dest, linePoints, color, compositeMode) => {
    const [x0, y0, x1, y1] = linePoints;
    const [r, g, b, a] = color;
    if (compositeMode === common_1.COMPOSITE_NORMAL) {
        __1.line(dest, x0, y0, x1, y1, r, g, b, a);
    }
    else {
        __1.line(dest, x0, y0, x1, y1, r, g, b, a, compositeMode);
    }
};
const bresenhamHelper = (dest, linePoints, color, compositeMode) => {
    const [x0, y0, x1, y1] = linePoints;
    const [r, g, b, a] = color;
    if (compositeMode === common_1.COMPOSITE_NORMAL) {
        __1.bresenhamLine(dest, x0, y0, x1, y1, r, g, b, a);
    }
    else {
        __1.bresenhamLine(dest, x0, y0, x1, y1, r, g, b, a, compositeMode);
    }
};
describe('line', () => {
    const lineNwToSe = [8, 8, 56, 56];
    const lineNeToSw = [56, 8, 8, 56];
    const lineHorizontalTop = [4, 12, 60, 12];
    const lineHorizontalMiddle = [4, 32, 60, 32];
    const color = [51, 153, 255, 191];
    describe('line', () => {
        it('no compositing', () => {
            const dest = create_image_1.createImage(64, 64);
            lineHelper(dest, lineNwToSe, color, -1);
            lineHelper(dest, lineNeToSw, color, -1);
            lineHelper(dest, lineHorizontalTop, color, -1);
            lineHelper(dest, lineHorizontalMiddle, color, -1);
            const png = png_1.toPng(dest);
            fs.writeFileSync('./src/test/fixtures/line-no-composite.png', png);
        });
        it('composites', () => {
            const dest = create_image_1.createImage(64, 64);
            lineHelper(dest, lineNwToSe, color, common_1.COMPOSITE_NORMAL);
            lineHelper(dest, lineNeToSw, color, common_1.COMPOSITE_NORMAL);
            lineHelper(dest, lineHorizontalTop, color, common_1.COMPOSITE_NORMAL);
            lineHelper(dest, lineHorizontalMiddle, color, common_1.COMPOSITE_NORMAL);
            const png = png_1.toPng(dest);
            fs.writeFileSync('./src/test/fixtures/line-composite-normal.png', png);
        });
    });
    describe('bresenhamLine', () => {
        it('no compositing', () => {
            const dest = create_image_1.createImage(64, 64);
            bresenhamHelper(dest, lineNwToSe, color, -1);
            bresenhamHelper(dest, lineNeToSw, color, -1);
            bresenhamHelper(dest, lineHorizontalTop, color, -1);
            bresenhamHelper(dest, lineHorizontalMiddle, color, -1);
            const png = png_1.toPng(dest);
            fs.writeFileSync('./src/test/fixtures/bresenham-no-composite.png', png);
        });
        it('composites', () => {
            const dest = create_image_1.createImage(64, 64);
            bresenhamHelper(dest, lineNwToSe, color, common_1.COMPOSITE_NORMAL);
            bresenhamHelper(dest, lineNeToSw, color, common_1.COMPOSITE_NORMAL);
            bresenhamHelper(dest, lineHorizontalTop, color, common_1.COMPOSITE_NORMAL);
            bresenhamHelper(dest, lineHorizontalMiddle, color, common_1.COMPOSITE_NORMAL);
            const png = png_1.toPng(dest);
            fs.writeFileSync('./src/test/fixtures/bresenham-composite-normal.png', png);
        });
    });
});
//# sourceMappingURL=index.js.map