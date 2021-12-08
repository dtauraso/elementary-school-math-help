export const setVariable2 = () => {

}
export const getVariable2 = (root, absolutePath) => {

}

export const getState2 = (root, absolutePath) => {
    // assume absolute path is name1 name2 name3 - name4 name5 - name6
    let listOfStrings = absolutePath.split(' - ')
    let pathList = listOfStrings.map(string => string.split(' '))

    let tracker = root
    pathList.forEach(stateNameParts => {
        stateNameParts.forEach(stateNamePart => {
            if(stateNamePart in tracker) {
                tracker = tracker[stateNamePart]
            }
        })
        if('children' in tracker) {
            tracker = tracker['children']
        }
    })
    return tracker

}
export const setTimelineMetadataToStates = (contextualStateChart) => {
    
    // add timeline keys to each state
    // put in parent links
}
export const makeEntry = (  stateWeWillRunName,
                            functionName,
                            parentDataStateAbsolutePath,
                            parentDataState,
                            varName,
                            variable,
                            newValue,
                            childTimeLine) => {
    return {
        [stateWeWillRunName]: {
            functionName: functionName,
            [parentDataStateAbsolutePath]: {
                reference: parentDataState,
                // is set 1 time
                before: {
                    [varName]: variable
                },
                // is set 1 time and reset the remaining times set2 is called inside the
                // function for stateWeWillRunName
                after: {
                    [varName]: newValue
                }
            },
            childTimeLine: childTimeLine
        }
    }
}

export const getParentObject = () => {

}

export const setupFirstState = (parentState, childState, entry) => {

    // make the end to end entry
    parentState['E2ETimeLines'].push([])
    const lenParent = parentState['E2ETimeLines'].length
    parentState['E2ETimeLines'][lenParent - 1].push(entry)
    // what if there is no grandparent
    // get the parent's parent and link it down to parentState['E2ETimeLines'][lenParent - 1][lastItem]
    const grandParentOjbect = getParentObject(parentState)
    const grandparentTimeLinesLen = grandParentOjbect['E2ETimeLines'].length
    const grandparentTimeLineLen = grandParentOjbect['E2ETimeLines'][grandparentTimeLinesLen - 1].length
    grandParentOjbect['E2ETimeLines'][grandparentTimeLinesLen - 1][grandparentTimeLineLen - 1].childTimeLine = parentState['E2ETimeLines'][lenParent - 1]

    childState['unitTimeLines'].push([])
    const lenChild = childState['unitTimeLines'].length
    childState['unitTimeLines'][lenChild - 1].push(entry)
}

export const setupSetInAllRemainingStates = (parentState, childState, entry) => {

    /*
        make a new timeline for entries, because we need to keep the
        new entries separate from the previous entries from prior
        runs of the submachine
        make a new timeline for the child state
            the child state might be run more than 1 time in the same machine so we
            need to keep the child runs separated from each submachine run
        add entry to new timeline for the child state
        append entry to end to end time line for the parent state
        
    */
    parentState['E2ETimeLines'].push([])
    const lenParent = parentState['E2ETimeLines'].length
    parentState['E2ETimeLines'][lenParent - 1].push(entry)

    childState['unitTimeLines'].push([])
    const lenChild = childState['unitTimeLines'].length
    childState['unitTimeLines'][lenChild - 1].push(entry)

}
export const revisitingSuccessfullyRunStates = (parentState, childState, entry) => {

    const lenParent = parentState['E2ETimeLines'].length
    parentState['E2ETimeLines'][lenParent - 1].push(entry)

    const lenChild = childState['unitTimeLines'].length
    childState['unitTimeLines'][lenChild - 1].push(entry)

}
export const allRemainingSetCallsInState = (entry,
                                            stateWeWillRunName,
                                            parentDataStateAbsolutePath,
                                            varName,
                                            newValue) => {

    entry[stateWeWillRunName][parentDataStateAbsolutePath]['after'][varName] = newValue

}

export const applyE2EAndUnitTimelineRules = (
    set2CallCount,
    stateRunCount,
    childState,
    startChildren,
    parentState,
    childState,
    entry,
    stateWeWillRunName,
    parentDataStateAbsolutePath,
    varName,
    newValue
) => {
    if(set2CallCount === 0) {

        if(stateRunCount === 0) {
            // the start of each state
            
            if(childState in startChildren) {
                // the first state in the submachine
                setupFirstState(parentState, childState, entry)
            }
            else {
                // first set function called in all states that aren't start states
                setupSetInAllRemainingStates(parentState, childState, entry)                

            }
        }
        else if(stateRunCount > 0) {
            // any state that has already been successfully run once
            revisitingSuccessfullyRunStates(parentState, childState, entry)
        }
    }
    else if(set2CallCount > 0) {
        // all remaining set calls inside a single state
        allRemainingSetCallsInState(
            entry,
            stateWeWillRunName,
            parentDataStateAbsolutePath,
            varName,
            newValue)
    }
}
export const set2 = (root,
                    parentstateNameAbsolutePath,
                    stateWeWillRunName,
                    parentDataStateAbsolutePath,
                    varName,
                    newValue) => {
    // the react components will travel down the state chart
    // when loading components

    let parentState = getState2(root, parentstateNameAbsolutePath)
    let childState = getState2(root, stateWeWillRunName)
    let functionName = childState.functionCode.toString()
    let parentDataState = getState2(root, parentDataStateAbsolutePath)
    let variable = parentState['variables'][varName]

    let set2CallCount = childState['Set2SFromtateFunctionCallCount']
    let stateRunCount = childState['stateRunCount']
    let startChildren = parentState['start']

    root['entries'].push(makeEntry(
        stateWeWillRunName,
        functionName,
        parentDataStateAbsolutePath,
        parentDataState,
        varName,
        variable,
        newValue,
        null))
    const entriesLen = root['entries'].length
    const entry = root['entries'][entriesLen - 1]
    /* 
    unit test:
        entry is saved at the state it was made in
    end to end test:
        entry is saved at the parent state
    */
    applyE2EAndUnitTimelineRules(
        set2CallCount,
        stateRunCount,
        childState,
        startChildren,
        parentState,
        childState,
        entry,
        stateWeWillRunName,
        parentDataStateAbsolutePath,
        varName,
        newValue
    )

    parentState['variables'][varName] = newValue
    childState['Set2SFromtateFunctionCallCount'] += 1
    /*
    resetting
    childState['Set2SFromtateFunctionCallCount']
    childState['stateRunCount']
    will happen in breathFirstTraversal2
    
    */
    /*
    
    stateName could match parentDataState1 or not
    reference to rootObject, 
    parentstateNameAbsolutePath,
    stateWeWillRunName,
    parentDataStateAbsolutePath,
    varName,
    newValue
    the form state machine should hold a collection of timelines
    store the data into the parent state
    after the child state is done running
    take the last piece of data from the child state in the parent state
    and store it into the child state. use the refernce

    if childStateName is the start child and Set2SFromtateFunctionCallCount === 0
        start the new timeline

    if Set2SFromtateFunctionCallCount === 0 and stateRunCount === 0
        start the new timeline for the childStateName 
    reset Set2SFromtateFunctionCallCount after the state passed
    reset stateRunCount right before the recursive call(breathFirstTraversal2) unwinds
    parentstateName: {
        Set2SFromtateFunctionCallCount: 0,
        stateRunCount: 0
        timeLines: [ {
            0: {
                childStateName1: {
                    parentDataStateAbsolutePath1: {
                        // is assigned 1 time
                        before: {
                            var1: 
                            var2:
                        }
                        // is assigned the remaining times
                        after: {
                            var1:
                            var2
                        }
                    }
                }
            },
            1: {
                childStateName2: {
                    parentDataStateAbsolutePath2: {
                        before: {
                            var1: 
                            var2:
                        }
                        after: {
                            var1:
                            var2
                        }
                    }
                }
            }
        }]
    }
    
    */
}

export const treeVisualizer2 = () => {

}
export const saveErrorEntry = (
    temporaryState,
    nextStates,
    currentStateName) => {
        let entry = {}
        // let parentState = getState2(root, parentstateNameAbsolutePath)
        // let childState = getState2(root, stateWeWillRunName)
        // let functionName = childState.functionCode.toString()
        // let parentDataState = getState2(root, parentDataStateAbsolutePath)
        // let variable = parentState['variables'][varName]
    
        // let set2CallCount = childState['Set2SFromtateFunctionCallCount']
        // let stateRunCount = childState['stateRunCount']
        // let startChildren = parentState['start']
    
        // applyE2EAndUnitTimelineRules = (
        //     set2CallCount,
        //     stateRunCount,
        //     childState,
        //     startChildren,
        //     parentState,
        //     childState,
        //     entry,
        //     stateWeWillRunName,
        //     parentDataStateAbsolutePath,
        //     varName,
        //     newValue
        // )

}
export const breathFirstTraversal2 = (state, action, startStateName, levelId) => {

    let temporaryState = state
    let nextStates = startStateName
    let currentStateName = startStateName

    while(true) {
        let passes = false
        let winningStateName = ''
        
        nextStates.forEach(nextState => {

            if(nextState === undefined) {
                console.log("the js syntax for the next states is wrong")
                return null
            }

            if(passes) {
                return null
            }
            let state = getState2(temporaryState, nextState)
            if(!Object.keys(state).includes('functionCode')) {
                console.log(state, "doesn't have a function")
                return null
            }

            action.type = nextState

            const result = state['functionCode'](temporaryState, action)
            const success = result[1]

            if(!success) {
                // save error entry
                saveErrorEntry(
                    temporaryState,
                    nextStates,
                    currentStateName)
                // rest counts for state
                return null
            }
            temporaryState = result[0]

            passes = true
            winningStateName = nextState
            let childrenStates = getChildren(temporaryState, winningStateName)
            if(childrenStates === null) {
                return null
            }
            if(childrenStates.length === 0) {
                return null
            }
            action.meta.parentStateName = action.type
            const nestedResult = breathFirstTraversal2(
                temporaryState,
                action,
                childrenStates,
                levelId + 1
            )
            passes = nestedResult[1]
            if(!pass) {
                return null
            }
            temporaryState = nestedResult[0]
        })
        if(nextStates.length === 0) {
            return [temporaryState, passes]
        }
        else if(passes) {

            currentStateName = winningStateName
            const currentStateObject = getCell(temporaryState, currentStateName)
            if(!Object.keys(currentStateObject).includes('next')) {
                return [temporaryState, true]
            }
            if(currentStateObject.next.length === 0) {
                return [temporaryState, true]
            }
            nextStates = currentStateObject.next
        }
        else {
            return [temporaryState, false]
        }
    }

}