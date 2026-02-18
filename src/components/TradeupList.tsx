import {Card, CardPanel} from "@/components/ui/card.tsx";
import {JSX, useState} from "react";
import {TradeupDisplay} from "@/components/TradeupDisplay.tsx";

interface Props {
    tradeups: TradeupEntry[]
}

export function TradeupList(props: Props): JSX.Element {
    const [display, setDisplay] = useState<TradeupEntry | null>(null);

    return (
        <Card>
            <CardPanel className="p-3 flex gap-4">
                {
                    display ?
                        <TradeupDisplay tradeup={display} />
                    : (
                        props.tradeups.length ?
                        props.tradeups.map(([tradeupStats, tradeup]) => '')
                        : <p>Nothing to show. Load tradeup data to start.</p>
                    )
                }
            </CardPanel>
        </Card>
    )
}