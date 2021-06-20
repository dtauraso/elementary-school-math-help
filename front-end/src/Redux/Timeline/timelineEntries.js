
export const makeInitEntry = (  stateWeWillRunName,
                                childTimeLine,
                                functionName) => {

    return {
        [stateWeWillRunName]: {
            B_childTimeLine: childTimeLine,
            C_functionName: functionName,
        }
    }
}
export const updateEntry = (entries,
                            stateWeWillRunName,
                            parentDataStateAbsolutePathArray,
                            parentDataState,
                            varName,
                            value,
                            newValue) => {

    let lastEntry = entries[entries.length - 1]

    lastEntry[stateWeWillRunName][`A_${parentDataStateAbsolutePathArray.join(' - ')}`] = {

        // is set 1 time
        A_before: {
            [varName]: value
        },
        // is set 1 time and reset the remaining times set2 is called inside the
        // function for stateWeWillRunName
        B_after: {
            [varName]: newValue
        },
        C_reference: parentDataState,
    }


}
export const updateEntry2 = (entries,
                            stateWeWillRunName,
                            parentDataStateAbsolutePathArray,
                            parentDataState,
                            varName,
                            value,
                            newValue) => {
                                let lastEntry = entries[entries.length - 1]

    lastEntry[stateWeWillRunName][`A_${parentDataStateAbsolutePathArray.join(' - ')}`] = {
        // REMOVE ALL NULLS 
        B_after: {
            [varName]: value
        },
        C_reference: parentDataState,
    }

}    
// export const saveErrorEntry = (
//     temporaryState,
//     parentStateNameAbsolutePathArray,
//     stateWeWillRunName,
//     parentDataStateAbsolutePathArray,
//     nextStates,
//     currentStateName,
//     varName,
//     newValue) => {
//         let entry = {}
//         let parentState = getState2(temporaryState, parentStateNameAbsolutePathArray)
//         let childState = getState2(temporaryState, stateWeWillRunName)
//         let functionName = childState.functionCode.toString()
//         let parentDataState = getState2(temporaryState, parentDataStateAbsolutePathArray)
//         let variable = parentState['variables'][varName]
    
//         let set2CallCount = childState['Set2SFromStateFunctionCallCount']
//         let stateRunCount = childState['stateRunCount']
//         let startChildren = parentState['start']
    
//         applyE2EAndUnitTimelineRules(
//             set2CallCount,
//             stateRunCount,
//             childState,
//             startChildren,
//             parentState,
//             entry,
//             stateWeWillRunName,
//             parentDataStateAbsolutePathArray,
//             varName,
//             newValue
//         )

// }
