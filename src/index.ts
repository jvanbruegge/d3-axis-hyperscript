export type Orientation = 'Horizontal' | 'Vertical';

export function createAxisGenerator(h : any) : any
{
    const axisFn = createAxis.bind(undefined, h);
    return Object.assign(axisFn, {
        axisTop: scale => axisFn(scale, 'Horizontal', 20, 10),
        axisRight: scale => axisFn(scale, 'Vertical', 20, 10),
        axisBottom: scale => axisFn(scale, 'Horizontal', 20, 10),
        axisLeft: scale => axisFn(scale, 'Vertical', 20, 10)
    });
}

function createAxis(h: any, scale : any, orientation : Orientation, spaceBefore: number, tickLength : number)
{
    const fn = n => {
        const ticks = scale.ticks(n)
            .map(scale)
            .map(v => {
                return h('g', {}, [
                    h('line', {
                        attrs: {
                            class: 'ticks',
                            x1: orientation === 'Horizontal' ? v : spaceBefore,
                            x2: orientation === 'Horizontal' ? v : spaceBefore + tickLength,
                            y1: orientation === 'Vertical' ? v : spaceBefore,
                            y2: orientation === 'Vertical' ? v : spaceBefore + tickLength
                        }
                    }, []),
                    h('text', { attrs: {
                        class: 'tickValue',
                        x: orientation == 'Horizontal' ? v + 5: 2,
                        y: orientation == 'Vertical' ? v + 5 : 2
                    }}, [
                        v.toFixed(0)
                    ])
                ]);
            });
        
        const [rangeX, rangeY] = scale.range();

        return h('g', { attrs: {
            class: 'axis'
        }}, [
            h('g', { attrs: {
                class: 'tickGroup'
            }}, [ ...ticks ]),
            h('line', {
                attrs: {
                    class: 'axisLine',
                    x1: orientation === 'Horizontal' ? 0 : spaceBefore + tickLength / 2,
                    x2: orientation === 'Horizontal' ? rangeX : spaceBefore + tickLength / 2,
                    y1: orientation === 'Vertical' ? 0 : spaceBefore + tickLength / 2,
                    y2: orientation === 'Vertical' ? rangeY : spaceBefore + tickLength / 2
                }
            }, [])
        ]);
    };

    return Object.assign(fn.bind(undefined, 20), { ticks: fn });
}
