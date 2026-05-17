import {Card, CardPanel} from "@/components/ui/card.tsx";
import {type JSX} from "react";
import {TradeupCard} from "@/TradeupCard.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Separator} from "@/components/ui/separator.tsx";

interface Props {
    tradeupData: Tradeup[] | null;
}

export function TradeupList(props: Props): JSX.Element {
    return (
        <Card>
            <CardPanel className="p-3 flex gap-4 flex-wrap justify-between">
                {
                    props.tradeupData ? (
                        props.tradeupData.length ?
                            props.tradeupData.map(
                                tradeup =>
                                    <TradeupCard tradeup={tradeup} key={tradeup.id}/>
                            )
                            : <p>No tradeups found. Try changing filters.</p>
                    ) : (
                        Array.from({length: 50}).map((_, index) => (
                                <Card className="w-56 h-50" key={index}>
                                    <CardPanel>
                                        <Skeleton className="my-2 h-2"/>
                                        <Skeleton className="my-2 h-2"/>
                                        <Separator/>
                                        <Skeleton className="my-2 h-2"/>
                                    </CardPanel>
                                </Card>
                            )
                        )
                    )
                }
            </CardPanel>
        </Card>
    );
}