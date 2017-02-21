export type Orientation = 'Horizontal' | 'Vertical';
export type length = number | undefined;

export function createAxisGenerator(h : any) : any
{
    const axisFn = createAxis.bind(undefined, h);
    return Object.assign(axisFn, {
        axisTop: scale => axisFn(scale, 'Horizontal', undefined, 0),
        axisRight: scale => axisFn(scale, 'Vertical', undefined, 0),
        axisBottom: scale => axisFn(scale, 'Horizontal', 0, undefined),
        axisLeft: scale => axisFn(scale, 'Vertical', 0, undefined)
    });
}

function createAxis(h: any, scale : any, orientation : Orientation, topRight: length, bottomLeft : length)
{
    const fn = n => {
        const ticks = scale.ticks(n)
            .map(scale)
            .map(v => {
                return h('line.ticks', {
                    attrs: {
                        x1: orientation === 'Horizontal' ? v : -bottomLeft,
                        x2: orientation === 'Horizontal' ? v : topRight,
                        y1: orientation === 'Vertical' ? v : -topRight,
                        y2: orientation === 'Vertical' ? v : bottomLeft
                    }
                }, []);
            });
        
        const [rangeX, rangeY] = scale.range();

        return h('g.axis', {}, [
            h('g.tickGroup', {}, [ ...ticks ]),
            h('line.axisLine', {
                attrs: {
                    x1: 0,
                    x2: orientation === 'Horizontal' ? rangeX : 0,
                    y1: 0,
                    y2: orientation === 'Vertical' ? rangeY : 0
                }
            }, [])
        ]);
    };

    return Object.assign(fn.bind(undefined, 20), { ticks: fn });
}
