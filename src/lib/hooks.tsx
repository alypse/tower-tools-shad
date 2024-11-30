import { useCallback, useState } from 'react';

const versionCache = '2.0.0';

// @ts-ignore
export const useInputEvent = (setState: unknown) => useCallback(({ target: { value } }) => setState(value), [setState]);

export const useUpdatedState = (initial: unknown, key: string) => {
    let fromStorage: unknown;
    const cacheKey = `${key}-${versionCache}`;
    try {
        const valueFromStorage = localStorage.getItem(cacheKey);
        if (valueFromStorage) {
            fromStorage = JSON.parse(valueFromStorage)
        }
    } catch (e) {
        alert(e); // no storage
    }
    const initialValue = fromStorage === null || fromStorage === undefined ? initial : fromStorage;
    const [state, setState] = useState(initialValue);

    const updateState = useCallback(
        (newValue: (arg0: unknown) => unknown) => {
            setState((oldValue: unknown) => {
                const setValue = typeof newValue === 'function' ? newValue(oldValue) : newValue;
                try {
                    if (key) {
                        localStorage.setItem(cacheKey, JSON.stringify(setValue));
                    }
                } catch (e) {
                    alert(e); // no storage
                }
                return setValue;
            });
        },
        [key, cacheKey],
    );
    return [state, updateState];
};

export const useInputState = (initial: unknown, key: string) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useInputEvent(setState);
    return [state, updateState, setState];
};

// @ts-ignore
export const useCheckboxEvent = (setState: unknown) => useCallback(({ target: { checked } }) => setState(checked), [setState]);

export const useCheckboxState = (initial: unknown, key: string) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useCheckboxEvent(setState);
    return [state, updateState, setState];
};

export const useIntegerEvent = (setState: unknown, min: number, max: number) =>
    useCallback(
        // @ts-ignore
        ({ target: { value } }) => {
            let newValue = value ? Number.parseInt(value, 10) : 0;
            if (min != null && newValue < min) {
                newValue = min
            }
            if (max != null && newValue > max) {
                newValue = max
            }
            // @ts-ignore
            setState(newValue);
        },
        [setState, min, max],
    );

export const useIntegerState = (initial: unknown, key: string, min: number, max: number) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useIntegerEvent(setState, min, max);
    return [state, updateState, setState];
};


export const useFloatEvent = (setState: unknown, min: number, max: number) =>
    useCallback(
        // @ts-ignore
        ({ target: { value } }) => {
            let newValue = value ? Number.parseFloat(value) : 0;
            if (min != null && newValue < min) {
                newValue = min
            }
            if (max != null && newValue > max) {
                newValue = max
            }
            // @ts-ignore
            setState(newValue);
        },
        [setState, min, max],
    );

export const useFloatState = (initial: number, key: string, min: number, max: number) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useFloatEvent(setState, min, max);
    return [state, updateState, setState];
};

// @ts-ignore
export const useSelectEvent = (setState: unknown) => useCallback(({ target: { value } }) => setState(value), [setState]);

export const useSelectState = (initial: unknown, key: string) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useSelectEvent(setState);
    return [state, updateState, setState];
};

// @ts-ignore
export const useDropDownEvent = (setState: unknown) => useCallback(({ target: { value } }) => setState(value), [setState]);

export const useDropDownState = (initial: unknown, key: string) => {
    const [state, setState] = useUpdatedState(initial, key);
    const updateState = useDropDownEvent(setState);
    return [state, updateState, setState];
};