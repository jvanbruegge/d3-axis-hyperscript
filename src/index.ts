import h from 'snabbdom/h';
import { VNode } from 'snabbdom/vnode';

export type Scale<T> = any;
export type Position = 'Top' | 'Bottom' | 'Left' | 'Right';
export interface XYPositions {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export interface Dimensions {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export default class AxisGenerator<T> {
    constructor(
        private _scale: Scale<T>,
        private _position: Position,
        private _ticks: [number, string | undefined] = [0, ''],
        private _tickSize: number = 12,
        private _padding: number = 3
    ) {}

    public scale(): Scale<T>;
    public scale<U>(scale: Scale<U>): AxisGenerator<U>
    public scale(scale?: any): any {
        if(typeof scale === 'undefined') {
            return this._scale;
        }
        return new AxisGenerator(scale, this._position, this._ticks, this._tickSize, this._padding);
    }

    public ticks(): [number, number];
    public ticks(count: number, specifier?: string): AxisGenerator<T>;
    public ticks(count?: number, specifier?: string): any {
        if(typeof count === 'undefined') {
            return this._ticks;
        }
        return new AxisGenerator(this._scale, this._position, [count, specifier], this._tickSize, this._padding);
    }

    public static axisTop<T>(scale: Scale<T>): AxisGenerator<T> {
        return new AxisGenerator(scale, 'Top');
    }

    public static axisBottom<T>(scale: Scale<T>): AxisGenerator<T> {
        return new AxisGenerator(scale, 'Bottom');
    }

    public static axisLeft<T>(scale: Scale<T>): AxisGenerator<T> {
        return new AxisGenerator(scale, 'Left');
    }

    public static axisRight<T>(scale: Scale<T>): AxisGenerator<T> {
        return new AxisGenerator(scale, 'Right');
    }

    public call(dimensions: Dimensions): VNode {
        const ticks: VNode[] = this._scale.ticks(this._ticks[0])
            .map(x => [x, this._scale(x)])
            .map(([value, p]) => {
                return h('g', {}, [
                    h('text', { attrs: {
                        class: 'tickValue',
                        x: getXForPosition(dimensions, this._position, this._padding, p),
                        y: getYForPosition(dimensions, this._position, this._padding, p)
                    }}, [this._scale.tickFormat(this.ticks[0], this.ticks[1])(value)]),
                    h('line', { attrs: {
                        class: 'ticks',
                        ...getXYPositions(dimensions, this._position, this._tickSize, this._padding, p)
                    }})
                ]);
            });

        return h('g', {}, [
            getBaseLine(this._position, dimensions, this._padding, this._tickSize)]
                .concat(ticks)
        );
    }
}

function getBaseLine(pos: Position, dimensions: Dimensions, padding: number, tickSize: number): VNode {
    if(pos === 'Bottom' || pos === 'Top') {
        const y = pos === 'Bottom' ?
            dimensions.bottom - padding - textHeight - tickSize / 2 :
            dimensions.top + padding + textHeight + tickSize / 2;

        return h('line', { attrs: {
            class: 'axis',
            x1: dimensions.left,
            x2: dimensions.right,
            y1: y,
            y2: y
        }});
    }
    const x = pos === 'Left' ?
        dimensions.left + padding + textWidth + tickSize / 2 :
        dimensions.right - padding - textWidth - tickSize / 2;

    return h('line', { attrs: {
        class: 'axis',
        x1: x,
        x2: x,
        y1: dimensions.top,
        y2: dimensions.bottom
    }});
}

const textWidth: number = 20;
const textHeight: number = 20;

function getXForPosition(dimensions: Dimensions, pos: Position, padding: number, value: number): number {
    if(pos === 'Left') { return padding; }
    if(pos === 'Right') { return dimensions.right - padding - textWidth; }

    return value - textWidth / 2;
}

function getYForPosition(dimensions: Dimensions, pos: Position, padding: number, value: number): number {
    if(pos === 'Bottom') { return dimensions.bottom - padding; }
    if(pos === 'Top') { return dimensions.top + padding + textHeight; }

    return value + textHeight / 2;

}

function getXYPositions(dimensions: Dimensions, pos: Position, tickSize: number, padding: number, value: number): XYPositions {
    if(pos === 'Top' || pos === 'Bottom') {
        const baseline = pos === 'Top' ?
            dimensions.top + padding + textHeight + tickSize / 2 :
            dimensions.bottom - textHeight - padding - tickSize / 2
        return {
            x1: value,
            x2: value,
            y1: baseline - tickSize / 2,
            y2: baseline + tickSize / 2
        };
    }
    const baseline = pos === 'Left' ?
        dimensions.left + padding + textWidth + tickSize / 2 :
        dimensions.right - padding - textWidth - tickSize / 2;
    return {
        x1: baseline - tickSize / 2,
        x2: baseline + tickSize / 2,
        y1: value,
        y2: value
    };
}
