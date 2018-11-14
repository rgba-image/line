import { CompositeMode } from '@rgba-image/common';
export declare type Line = (dest: ImageData, x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, a: number, compositeMode?: CompositeMode) => void;
export declare const line: Line;
export declare const bresenhamLine: Line;
