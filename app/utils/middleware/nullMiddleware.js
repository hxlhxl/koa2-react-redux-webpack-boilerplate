export default () => {
    return ({
        dispatch,
        getState
    }) => {
        return next => action => {
            next(action);
        };
    };
}