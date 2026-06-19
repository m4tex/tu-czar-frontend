import {type DependencyList, type Dispatch, type SetStateAction, useEffect, useState} from "react";

/**
 * Defines a pipeline of async execution steps. Any step could be triggered by its dependency list, after which the
 * pipeline runs from that point.
 *
 * Particularly useful for client side db's. It allows you to handle expensive queries only when needed, without more
 * trivial queries like pagination and sorting forcing requerying of all data.
 */
export function useCheckpointPipeline(sharedCondition: boolean, ...effects: [() => Promise<void | (() => void)>, DependencyList][]) {
    const triggers: [boolean, Dispatch<SetStateAction<boolean>>][] = [];

    for (let i = 1; i < effects.length; i++) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        triggers[i] = useState(false);
    }

    for (let i = 0; i < effects.length; i++) {
        const [effectCallback, effectDependencies] = effects[i];

        const trigger = triggers?.[i]?.[0];
        const setNextTrigger = triggers?.[i + 1]?.[1];

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            (async () => {
                if (!sharedCondition) return;
                await effectCallback();
                setNextTrigger?.(prev => !prev);
            })();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [...effectDependencies, trigger, setNextTrigger]);
    }
}