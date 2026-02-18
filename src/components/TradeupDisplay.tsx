import {JSX} from "react";

interface Props {
    tradeup: TradeupEntry
}

export function TradeupDisplay(props: Props): JSX.Element {
    return (
        <p>Displaying contract {props.tradeup[0].profitFactor}</p>
    );
}