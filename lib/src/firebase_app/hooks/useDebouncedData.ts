import React from "react";

/**
 * Hack to prevent data updates for incomplete callbacks from Firestore
 * triggers
 * @param data
 * @param timeoutMs
 */
export function useDebouncedData<T>(data: T[], timeoutMs = 2000) {

    const [deferredData, setDeferredData] = React.useState(data);
    const dataLength = React.useRef(deferredData.length ?? 0);
    const pendingUpdate = React.useRef(false);

    React.useEffect(() => {

        const performUpdate = () => {
            setDeferredData(data);
            dataLength.current = data.length;
            pendingUpdate.current = false;
        };

        pendingUpdate.current = true;

        const immediateUpdate = data.length >= dataLength.current;
        let handler: any;
        if (immediateUpdate)
            performUpdate()
        else
            handler = setTimeout(performUpdate, timeoutMs);

        return () => {
            clearTimeout(handler);
            if (pendingUpdate.current && immediateUpdate)
                performUpdate();
        };
    }, [data, timeoutMs]);

    return deferredData;
}
