import {clsx} from "clsx";

export function FloatDiagram(props: Props) {
    const minFloat = (props.min ?? 0);
    const maxFloat = (props.max ?? 1);

    function showThreshold(leftThreshold: number, rightThreshold: number) {
        return rightThreshold >= minFloat && leftThreshold <= maxFloat;
    }

    function getGrow(leftThreshold: number, rightThreshold: number) {
        return (rightThreshold - Math.max(leftThreshold, minFloat) - +(rightThreshold > maxFloat) * (1 - maxFloat)) / (maxFloat - minFloat);
    }

    function renderThreshold(color: string, leftThreshold: number, rightThreshold: number) {
        return showThreshold(leftThreshold, rightThreshold) &&
            <div className='h-full' style={{backgroundColor: color, flexGrow: getGrow(leftThreshold, rightThreshold)}} />
    }

    return (
        <div className={clsx('relative overflow-clip rounded-full h-2 w-65', props.className)}>
            <div className='flex h-full w-full'>
                { renderThreshold('oklch(44.8% 0.119 151.328)', 0, 0.07) }
                { renderThreshold('oklch(62.7% 0.194 149.214)', 0.07, 0.15) }
                { renderThreshold('oklch(85.2% 0.199 91.936)', 0.15, 0.38) }
                { renderThreshold('oklch(75% 0.183 55.934)', 0.38, 0.45) }
                { renderThreshold('oklch(44.4% 0.177 26.899)', 0.45, 1) }
            </div>
            {
                props.indicators && props.indicators.map((indicator) => (
                    <div className='absolute h-full w-0.5 top-0 transform translate-x-1/2' style={
                        {
                            backgroundColor: indicator.color,
                            left: `${((indicator.position - minFloat) / (maxFloat - minFloat)) * 100}%`
                        }
                    } />
                ))
            }
        </div>
    );
}

interface Props {
    min?: number;
    max?: number;
    indicators?: FloatIndicator[];
    className?: string;
}
