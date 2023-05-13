export const TIMEOUT_MAX = 2147483647; // 2^31-1
/**
 * Creates a new timeout, which can exceed the max timeout limit of 2^31-1.
 * Since multiple timeouts are used internally, the timeoutId used to clear the timeout
 * is returned as a handle (object) and changes whenever the max timeout limit is exceeded.
 * The handle parameter can be ignored, it is used internally for updating the timeoutId
 * in the handle after creating the next timeout.
 */
export function longTimeout(fn, timeout, handle) {
    let after = 0;
    if (timeout > TIMEOUT_MAX) {
        after = timeout - TIMEOUT_MAX;
        timeout = TIMEOUT_MAX;
    }
    handle !== null && handle !== void 0 ? handle : (handle = {
        timeoutId: undefined,
    });
    handle.timeoutId = setTimeout(() => {
        if (after > 0) {
            longTimeout(fn, after, handle);
        }
        else {
            fn();
        }
    }, timeout);
    return handle;
}
/* Extracts second, minute, hour, date, month and the weekday from a date. */
export function extractDateElements(date) {
    return {
        second: date.getSeconds(),
        minute: date.getMinutes(),
        hour: date.getHours(),
        day: date.getDate(),
        month: date.getMonth(),
        weekday: date.getDay(),
        year: date.getFullYear(),
    };
}
/* Gets the amount of days in the given month (indexed by 0) of the given year. */
export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
/* Gets the amount of days from weekday1 to weekday2. */
export function getDaysBetweenWeekdays(weekday1, weekday2) {
    if (weekday1 <= weekday2) {
        return weekday2 - weekday1;
    }
    return 6 - weekday1 + weekday2 + 1;
}
export function wrapFunction(fn, errorHandler) {
    return () => {
        try {
            const res = fn();
            if (res instanceof Promise) {
                res.catch((err) => {
                    if (errorHandler) {
                        errorHandler(err);
                    }
                });
            }
        }
        catch (err) {
            if (errorHandler) {
                errorHandler(err);
            }
        }
    };
}
//# sourceMappingURL=utils.js.map