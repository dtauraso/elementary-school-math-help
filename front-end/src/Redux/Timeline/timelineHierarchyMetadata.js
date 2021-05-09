export const substateKeys = (state) => {
    let specialKeys = ['functionCode',
                        'start',
                        'next',
                        'children',
                        'variables',
                        'parent']
    let keys = Object.keys(state).filter(key => !specialKeys.includes(key))
    // console.log(keys)
    return keys
}
export const isLeafState = (state) => {
    // console.log(state, !('children' in state), substateKeys(state).length)
    return substateKeys(state).length === 0 &&
            !('children' in state)
}
export const isInternalState = (state) => {

    return substateKeys(state).length > 0 ||
            'children' in state
}
export const setTimelineMetadataToStates = (contextualStateChart) => {
    
    // add timeline keys to each state
    // linking state to it's parent
    // a timeline key is not added to root because the key can only be added
    // to the child when it links to the root
    // put in parent links
    if(Object.keys(contextualStateChart).length === 0) {
        return [contextualStateChart]
    }
    // if('variables' in contextualStateChart && !('children' in state)) {
    //     // console.log("PASSES")
    //     return [contextualStateChart]
    // }
    if(isLeafState(contextualStateChart)) {
        // console.log(substateKeys(contextualStateChart), contextualStateChart)
        // console.log("leaf state", Object.keys(contextualStateChart))
        return [contextualStateChart]
    }
    if(isInternalState(contextualStateChart)) {

        // getting all the substates(may be several nodes long) of a particular state to connect
        // them to their parent
        let returnCollection = []
        
        if('children' in contextualStateChart) {
            let allSubstates = []

            Object.keys(contextualStateChart.children).forEach(child => {
                allSubstates = [
                    ...allSubstates,
                    ...setTimelineMetadataToStates(contextualStateChart.children[child])
                ]
            })
            allSubstates.forEach(nestedSubstate => {
                nestedSubstate['parent'] = contextualStateChart
                nestedSubstate['Set2SFromStateFunctionCallCount'] = 0
                nestedSubstate['stateRunCount'] = 0
                nestedSubstate['E2ETimeLines'] = []
                nestedSubstate['unitTimeLines'] = []
            })
            returnCollection.push(contextualStateChart)
        }
        let subKeys = substateKeys(contextualStateChart)

        if(subKeys.length > 0) {
            subKeys.forEach(subKey => {
                returnCollection = [
                    ...returnCollection,
                    ...setTimelineMetadataToStates(contextualStateChart[subKey])
                ]
            })
            if('variables' in contextualStateChart && !('children' in contextualStateChart)) {
                returnCollection = [
                    ...returnCollection,
                    contextualStateChart
                ]
            }
        }
        return returnCollection
    }
    else {
        console.log("problem", contextualStateChart)
    }
}
