import {Card, CardFooter, CardPanel} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useQuery} from "@/DuckDBHooks.ts";
import {FloatDiagram} from "@/components/FloatDiagram.tsx";

interface Props {
    tradeup: Tradeup;
}

const paragraphStyle = 'whitespace-nowrap overflow-clip text-xs text-left';

export function TradeupCard(props: Props) {
    const { data: s1data, loading: s1loading, error: s1error } = useQuery<Skin>(`SELECT * FROM tradeups.skins WHERE name = $$${props.tradeup.skin1}$$`);
    const { data: s2data, loading: s2loading, error: s2error } = useQuery<Skin>(`SELECT * FROM tradeups.skins WHERE name = $$${props.tradeup.skin2}$$`);

    const skin1 = s1data?.[0];
    const skin2 = s2data?.[0];

    if (s1error || s2error) {
        console.log('Error loading skin data');
    }

    const typeColors = [
        s1data?.[0]?.rarityColor,
        'orange',
        'yellow'
    ];

    return (
        <Card className="w-56 h-50 overflow-hidden">
            <CardPanel>
                {<p className={paragraphStyle}>{props.tradeup.skin1count}x {props.tradeup.skin1}</p>}
                {
                    skin1 &&
                        <FloatDiagram className='my-1 w-full h-[6px]' min={skin1.min_float} max={skin1.max_float}
                                      indicators={[
                                          { position: props.tradeup.skin1optimal, color: 'white' },
                                          { position: props.tradeup.skin1minAvg, color: 'red' },
                                          { position: props.tradeup.skin1maxAvg, color: 'red' },
                                      ]} />
                }
                {
                    props.tradeup.skin2 ?
                        <p className={paragraphStyle}>{props.tradeup.skin2count}x {props.tradeup.skin2}</p>
                        : null
                }
                {
                    skin2 &&
                        <FloatDiagram className='my-1 w-full h-[6px]' min={skin2.min_float} max={skin2.max_float}
                                      indicators={[
                                          { position: props.tradeup.skin2optimal!, color: 'white' },
                                          { position: props.tradeup.skin2minAvg!, color: 'red' },
                                          { position: props.tradeup.skin2maxAvg!, color: 'red' },
                                      ]} />
                }
                <Separator className="mt-2 mb-2"/>
                <p className={paragraphStyle}>
                    Avg. Profit: {props.tradeup.profit.toFixed(2)}x
                </p>

            </CardPanel>
            <Separator />
            <CardFooter>
                Cost: ${Math.round(props.tradeup.cost * 100) / 100}
            </CardFooter>
                { !s1loading && !s2loading &&
                    <div className={`h-1 w-full`} style={{backgroundColor: s1data?.[0]?.rarityColor}} />
                }
                <div className={`h-1 w-full`} style={{backgroundColor: typeColors[props.tradeup.type] }} />
        </Card>
    );
}