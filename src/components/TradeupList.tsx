import {Card, CardPanel} from "@/components/ui/card.tsx";
import {type JSX, useState} from "react";
import {TradeupDisplay} from "@/components/TradeupDisplay.tsx";
import {TradeupCard} from "@/TradeupCard.tsx";

interface Props {
    tradeupData: TradeupData
}

export function TradeupList(props: Props): JSX.Element {
    const [display, setDisplay] = useState<Tradeup | null>(null);

    return (
        <Card>
            <CardPanel className="p-3 flex gap-4 flex-wrap justify-between">
                {
                    display ?
                        <TradeupDisplay tradeup={display} />
                    : (
                        Object.keys(props.tradeupData).length ?
                        Object.entries(props.tradeupData).map(
                            (entry, index) =>
                                <TradeupCard tradeupString={entry[0]} tradeups={entry[1]} key={index} />
                        )
                        : <p>Nothing to show. Load tradeup data to start.</p>
                    )
                }
            </CardPanel>
        </Card>
    )
}