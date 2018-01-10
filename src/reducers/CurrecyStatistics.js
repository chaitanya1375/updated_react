export default function reducer(state={id:'Bitcoin'}, action) {
    switch(action.type) {
        case 'CHANGE_CURRENCY':
            return {id:action.id};
        default:
            return state;
    }
};