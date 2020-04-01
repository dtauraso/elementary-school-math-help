import axios from 'axios';
import { store } from '../../index'
// import univer
// export const FETCH_CAT_START = 'FETCH_CAT_START'
// export const FETCH_CAT_SUCCESS = 'FETCH_CAT_SUCCESS'
// export const FETCH_CAT_FAILURE = 'FETCH_CAT_FAILURE'


// middleware functions
export const getCat = () => dispatch => {

    dispatch({  type: ['redux', 'FETCH_CAT_START'] });

    axios
        .get('https://aws.random.Root/meow')
        .then(res => {
            // console.log("from api", res.data.file)
            dispatch({  type: ['redux', 'FETCH_CAT_SUCCESS'],
                        payload: res.data.file });
        })
        .catch(err => {
            dispatch({  type: ['redux', 'FETCH_CAT_FAILURE'],
                        payload: err.response })
        });

};

export const submitAnswer = (lotsOfThings, pathToState) => dispatch => {

    // console.log("in the action")
    // prop drilling provides the path
    // ['redux', 'elementary school', 'children', 'problem set', '0', 'answerForm']
    // component provides the data the state function will use
    // runs a graph of connected nodes
    // use the action meta property
    // console.log(store.getState().redux.table)
    dispatch({
            type: [pathToState], // current state (can't make it the base state for object datatbecause sometimes the current state doesn't have ojbect data )
            payload: lotsOfThings,
            meta: {
                    basePath: pathToState, // base state(for the object data)
                    parentStateName: pathToState
                }
        });

}
