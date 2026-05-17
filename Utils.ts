import {DependencyList, Dispatch, SetStateAction, useEffect, useState} from "react";

/** I use this to form a chain of useEffect's, where the first effect would force the following effects to also run (in
 * order) regardless of their dependencies which don't overlap from effect to effect. Another behavior in mind is that
 * if the 2nd effect triggers due to its dependencies, it will trigger the 3rd effect regardless if the 1st ran. It's a
 * chain where the effects call upon the next one in line and could be started from anywhere in the chain. If I were to
 * do this with a singular useEffect I would have to somehow figure out which particular dependency triggered the function
 * to run, which is troublesome. Why is this a thing? I don't want to re-run expensive SQL queries for trivial stuff
 * where I can reuse cached data (like changing sort order). If the cached data has to be recalculated then the queries
 * which rely on it will also run afterward in a defined order. It creates a hierarchy of SQL queries where queries that
 * depend on other queries will run if the one above updates. It's how I deal with the gimmicks of a client side db which
 * is asynchronous.
 */

export function useAsyncEffectChain(...effects: [() => Promise<void | (() => void)>, DependencyList][]) {
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
                await effectCallback();
                setNextTrigger?.(prev => !prev);
            })();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [...effectDependencies, trigger, setNextTrigger]);
    }
}