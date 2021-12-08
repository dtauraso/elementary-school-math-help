import { makeQuantity } from '../../utility'
import {    
            appendStates,
            setVariable,
            getVariable,
            breathFirstTraversal, 
            getCell,
            getChildren,

            tableAssign,
            set,
            setArray,
            printTreeInteractive,
            getChild
        
        
        
        
        } from '../../reducerHelpers'

// Only add states when they need to be initially created or enumaerated with a graph generator.
// No singletone states should be created just cause they don't need to exist untill that reducer runs.
// variables shouldn't call functions

const problems = [
    {a: 4, b: 3},

    {a: 5, b: 6},

    {a: 2, b: 4},

    {a: 9, b: 4},

    {a: 5, b: 1}


]

// const answer = 4 + 3
// const secondAnswer =

// example states for the axios calls
// how much of the 'highly accurate' shotgun surgery can I get the program to do for me?
/*
to replicate the same counting algorithm with a slightly different state structure
new count var
1 function to make the state tree v vars
1 new context name at the front of all the states being generated
// (instead of `${iA} ${i}` use `display ${iA} ${i}`)
// the offset string will = 'offset '
// the variable access form will look like this `${offsetString}variableName`

*/
// adding a new state and some vars
// new startin next parts from root
// add new state name as a child from the parent

// add the cells representing the new state
// add the var's names to the new state

/* 
adding a single new state
put next parts in root
add a new link to the parent state child set (var set if it's a variable)
fill out the cell form

current state name form (i0. i1, i2)
new state name form (i0 + j. i1, i2)

*/


const makeProblemPartNumber = (  offsetString,
                                i,
                                j,
                                k,
                                {   value,
                                    quantity,
                                    isForm,
                                    operationType,
                                    isCorrect,
                                    isActualAnswer,
                                    isResult
                                },

                                isForDisplayResultsOnly
                            ) => {

    // i is the ith problem set, j is the jth problem

    let problemPartCoordinates = `${offsetString} ${i} ${j} ${k}`

    let ijk = `${i} ${j} ${k}`

    let problem_i = `${offsetString} problem ${i} ${j}`
    let problem_i_displayResult = `${problemPartCoordinates} displayResult`

    let valueName = `${offsetString} value ${ijk}`
    let quantityName = `${offsetString} quantity ${ijk}`
    let isFormName = `${offsetString} isForm ${ijk}`
    let operationTypeName = `${offsetString} operationType ${ijk}`



    let isCorrectName = `${offsetString} isCorrect ${ijk}`
    let isActualAnswerName = `${offsetString} isActualAnswerName ${ijk}`
    let isResultName = `${offsetString} isResultName ${ijk}`

    return {
        [problemPartCoordinates]: {
            parent: problem_i,
            name: problemPartCoordinates,
            substates: isForDisplayResultsOnly? []: ['displayResult'],
            variableNames: [valueName,
                            quantityName,
                            isFormName,
                            operationTypeName]

            },
            ...(isForDisplayResultsOnly? {}: {
                    // These are set to meaningfull values in the results route
                    [problem_i_displayResult]: {
                        parent: problemPartCoordinates,
                        name: problem_i_displayResult,
                        variableNames: [isCorrectName,
                                        isActualAnswerName,

                                        // tells OneValue to render a slightly different sequence of components when we are
                                        // in the results route (redux flag -> sequence of react components,
                                        // also, each flag must be exclusive)
                                        isResultName,
                        ]
                    },
                        [isCorrectName]: {
                            parent: problem_i_displayResult,
                            name: isCorrectName,
                            value: isCorrect
                        },
                        [isActualAnswerName]: {
                            parent: problem_i_displayResult,
                            name: isActualAnswerName,
                            value: isActualAnswer
                        },
                        [isResultName]: {
                            parent: problem_i_displayResult,
                            name: isResultName,
                            value: isResult
                        }
            }),
                

            [valueName]: {
                parent: problemPartCoordinates,
                name: valueName,
                value: value
            },
            [quantityName]: {
                parent: problemPartCoordinates,
                name: quantityName,
                value: quantity
            },
            [isFormName]: {
                parent: problemPartCoordinates,
                name: isFormName,
                value: isForm
            },
            [operationTypeName]: {
                parent: problemPartCoordinates,
                name: operationTypeName,
                value: operationType
            },
    }


}
const makeAnswerForm = (    offsetString,
                            i,
                            j,
                            k,
                            {   isForm,
                                operationType,
                                submission: {
                                    value,
                                    quantity,
                                    correct,
                                    firstAnswer,
                                    actualAnswer,
                                    submitCount,
                                    feedbackMessage,
                                    backgroundColor
                                },
                                progressMeter: {
                                    correctFirstTime,
                                    testingWithoutForm
                                }
                            }
                        ) => {

    let problemPartCoordinates = `${offsetString} ${i} ${j} ${k}`
    let ijk = `${i} ${j} ${k}`
    let problem_i = `${offsetString} problem ${i} ${j}`

    let problem_i_submission = `${problemPartCoordinates} submission`

    let valueName = `${offsetString} value ${ijk}`
    let quantityName = `${offsetString} quantity ${ijk}`
    let correctName = `${offsetString} correct ${ijk}`
    let firstAnswerName = `${offsetString} firstAnswer ${ijk}`
    let actualAnswerName = `${offsetString} actualAnswer ${ijk}`
    let submitCountName = `${offsetString} submitCount ${ijk}`
    let feedbackMessageName = `${offsetString} feedbackMessage ${ijk}`
    let backgroundColorName = `${offsetString} backgroundColor ${ijk}`

    let noValueName = `${offsetString} noValue ${ijk}`
    let isIntegerName = `${offsetString} isInteger ${ijk}`
    let isNotIntegerName = `${offsetString} isNotInteger ${ijk}`
    let submitValueName = `${offsetString} submitValue ${ijk}`
    let terminateProcessEarly = `${offsetString} terminateProcessEarly ${ijk}`


    let problem_i_submission_updateTypedAnswer = `${problem_i_submission} updateTypedAnswer`
    
    let problem_i_progressMeter = `${problemPartCoordinates} progressMeter`
    
    // for the ith problem set jth problem
    // unique to 1 program not k problem parts
    let ij = `${i} ${j}`
    let gotItRightTheFirstTimeName = `${offsetString} gotItRightTheFirstTime ${ij}`

    // 'else' is a keyword in js
    let elseStateName = `${offsetString} else ${ij}`

    let correctFirstTimeName = `${offsetString} correctFirstTime ${ij}`
    let testingWithoutFormName = `${offsetString} testingWithoutForm ${ij}`


    let isFormName = `${offsetString} isForm ${ij}`
    let operationTypeName = `${offsetString} operationType ${ij}`
    // [problemPartCoordinates]: {
    //     parent: `${offsetString}problem ${i}`,
    //     name: problemPartCoordinates,
    //     substates: isForDisplayResultsOnly? []: [`displayResult`],
    //     variableNames: [`${offsetString}value ${ij}`,
    //                     `${offsetString}quantity ${ij}`,
    //                     `${offsetString}isForm ${ij}`,
    //                     `${offsetString}operationType ${ij}`]

    //     },
    // problemPartCoordinates vs problem_i
    // both this one and the one for the number has the same error
    return {

    
    [problemPartCoordinates]: {
        parent: problem_i,
        name: problemPartCoordinates,
        substates: ['submission', 'progressMeter'],
        variableNames: [isFormName, operationTypeName]
    },
        [isFormName]: {
            parent: problemPartCoordinates,
            name: isFormName,
            value: isForm
        },
        [operationTypeName]: {
            parent: problemPartCoordinates,
            name: operationTypeName,
            value: operationType
        },
        

            // 2 indents from `${offsetString}${iAnswer} ${i}` as it's a substate
            // has the same parent as the superstate
            // we start our submitting the answer with this cell
            // this index(i) corresponds to the total number of problems

            [problem_i_submission]: {
                parent: problem_i,
                name: problem_i_submission,
                substates: ['updateTypedAnswer'],
                functionCode: returnState,
                nextStates: [problem_i_progressMeter],
                children: [
                    // need any non value or illegal value to terminate the process
                    noValueName,
                    isNotIntegerName, // because this returned true then entire tree == true and we move
                    // to the next state
                    isIntegerName,
                    submitValueName
                ],
                variableNames: [
                    valueName,
                    quantityName,
                    correctName,
                    firstAnswerName,
                    actualAnswerName,
                    submitCountName,
                    feedbackMessageName,
                    backgroundColorName
                ]

            },
                    // 4 total indents as it the substate of `${offsetString}${iAnswer} ${i} submission ${i}`
                    [problem_i_submission_updateTypedAnswer]: {
                        parent: problem_i,
                        name: problem_i_submission_updateTypedAnswer,
                        functionCode: updateTypedAnswer
                    },
                [valueName]: {
                    parent: problem_i_submission,
                    name: valueName,
                    value: value
                },
                [quantityName]: {
                    parent: problem_i_submission,
                    name: quantityName,
                    value: quantity
                },
                [correctName]: {
                    parent: problem_i_submission,
                    name: correctName,
                    value: correct
                },
                [firstAnswerName]: {
                    parents: problem_i_submission,
                    name: firstAnswerName,
                    value: firstAnswer
                },
                [actualAnswerName]: {
                    parents: problem_i_submission,
                    name: actualAnswerName,
                    value: actualAnswer
                },
                [submitCountName]: {
                    parents: problem_i_submission,
                    name: submitCountName,
                    value: submitCount
                },
                [feedbackMessageName]: {
                    parents: problem_i_submission,
                    name: feedbackMessageName,
                    value: feedbackMessage
                },
                [backgroundColorName]: {
                    parents: problem_i_submission,
                    name: backgroundColorName,
                    value: backgroundColor
                },
                [noValueName]: {
                    parents: problem_i_submission,
                    name: noValueName,
                    functionCode: noValue,
                    nextStates: [terminateProcessEarly]
                    // []
                },
                [isNotIntegerName]: {
                    parents: problem_i_submission,
                    name: isNotIntegerName,
                    functionCode: isNotInteger,
                    nextStates: [terminateProcessEarly]
                    // []
                },
                [terminateProcessEarly]: {
                    parents: problem_i_submission,
                    name: terminateProcessEarly,
                    functionCode: returnStateFalse
                },
                // returnStateFalse
                [isIntegerName]: {
                    parents: problem_i_submission,
                    name: isIntegerName,
                    functionCode: isInteger,
                    nextStates: [submitValueName]
                },
                [submitValueName]: {
                    parents: problem_i_submission,
                    name: submitValueName,
                    functionCode: submitValue,
                },
            [problem_i_progressMeter]: {
                parent: problem_i,
                name: problem_i_progressMeter,
                functionCode: returnState,
                children: [ gotItRightTheFirstTimeName, // passes if they are right and submission count == 1
                            elseStateName // 'else' is a keyword in js
                    ],
                variableNames: [
                    correctFirstTimeName,
                    testingWithoutFormName
                ]
            },
                [correctFirstTimeName]: {
                    parent: problem_i_progressMeter,
                    name: correctFirstTimeName,
                    value: correctFirstTime
                },
                [testingWithoutFormName]: {
                    parent: problem_i_progressMeter,
                    name: testingWithoutFormName,
                    value: testingWithoutForm
                },
                [gotItRightTheFirstTimeName]: {
                    parent: problem_i_progressMeter,
                    name: gotItRightTheFirstTimeName,
                    functionCode: gotItRightTheFirstTime
                },
                [elseStateName]: {
                    parent: problem_i_progressMeter,
                    name: elseStateName,
                    functionCode: returnState
                }
    }

}
const makeNumber = (
                    {   value,
                        quantity,
                        isForm,
                        // make an operationTypeForPadding
                        // make an isOperationTypeForPadding

                        operationType,

                        // flags for displaying the result
                        isCorrect,
                        isActualAnswer,
                        isResult
                    }
                ) => {

    return {
        
            value: value,
            quantity: quantity,
            isForm: isForm,
            // make an operationTypeForPadding
            // make an isOperationTypeForPadding

            operationType: operationType,

            // flags for displaying the result
            isCorrect: isCorrect,
            isActualAnswer: isActualAnswer,
            isResult: isResult
        
    }
}
const makeProblemPartsForDisplayResults = (ithProblem) => {

    // console.log('ith problem', {ithProblem})
    const {a, b, theirAnswer, actualAnswer, gotItRightTheFirstTime} = ithProblem

    const mySum = a + b
    return [
        // a
        makeNumber({
                value: a,
                quantity: makeQuantity(a, mySum),
                isForm: false,
                // make an operationTypeForPadding
                // make an isOperationTypeForPadding
    
                operationType: '',
    
                // flags for displaying the result
                isCorrect: false,
                isActualAnswer: false,
                isResult: false
        }),

        // b
        makeNumber({
            value: b,
            quantity: makeQuantity(b, mySum),
            isForm: false,
            // make an operationTypeForPadding
            // make an isOperationTypeForPadding

            operationType: '+',

            // flags for displaying the result
            isCorrect: false,
            isActualAnswer: false,
            isResult: false
        }),

        // theirAnswer
        makeNumber({
            value: theirAnswer,
            quantity: makeQuantity(theirAnswer, mySum),
            isForm: false,
            // make an operationTypeForPadding
            // make an isOperationTypeForPadding

            operationType: '',

            // flags for displaying the result
            isCorrect: gotItRightTheFirstTime,
            isActualAnswer: false,
            isResult: true
        }),

        // actualAnswer
        makeNumber({
            value: actualAnswer,
            quantity: makeQuantity(actualAnswer, mySum),
            isForm: false,
            // make an operationTypeForPadding
            // make an isOperationTypeForPadding

            operationType: '',

            // flags for displaying the result
            isCorrect: false,
            isActualAnswer: true,
            isResult: false
        })
    ]
    
}
const makeProblemParts = (ithProblem) => {

    return [
        {
            // reusable
            ...makeNumber({
                value: ithProblem.a,
                quantity: makeQuantity(ithProblem.a, ithProblem.a + ithProblem.b),
                isForm: false,
                // make an operationTypeForPadding
                // make an isOperationTypeForPadding
    
                operationType: '',
    
                // flags for displaying the result
                isCorrect: false,
                isActualAnswer: false,
                isResult: false
            })
        },
        {
            ...makeNumber({ 
                value: ithProblem.b,
                quantity: makeQuantity(ithProblem.b, ithProblem.a + ithProblem.b),
                isForm: false,
                operationType: '+',
    
                // flags for displaying the results
                isCorrect: false,
                isActualAnswer: false,
                isResult: false
            })
        },
        {
                // anserForm
                isForm: true,
                operationType: '',
                submission: {   value: '',
                                quantity: makeQuantity(0, ithProblem.a + ithProblem.b),
                                correct: false,
                                firstAnswer: null,
                                actualAnswer: ithProblem.a + ithProblem.b,
                                submitCount: 0,
                                feedbackMessage: 'O',
                                backgroundColor: 'white'
                },
                progressMeter: {    correctFirstTime: false,
                                    testingWithoutForm: false
                }
        }
    ]
}

const initState = (temporaryState, parentName, stateName) => {
    return {
        ...temporaryState,
        [stateName]: {
            parent: parentName,
            children: [],
            name: stateName,
        }
    }
}
const addChild = (Root2, stateName, newChildName) => {

    // newChildName is an array of strings
    // let newChildrenForProblemSet = [
    //     [`problem ${i}`]
    // ]
    
    // console.log('here')
    // add starting trie links to root and add the new problem child to the problem set
    // console.log({stateName})
    // console.log("here", Object.keys(Root2[stateName]))
    Root2 = {
        ...Root2,
        [stateName]: {
            ...Root2[stateName],
            children: !Object.keys(Root2[stateName]).includes('children')?
                            [newChildName]:
                            [...Root2[stateName].children, newChildName]
        }
    }
    return Root2
}
const addVariable = (Root2, stateName, newVariableName) => {

    // newChildName is an array of strings
    // let newChildrenForProblemSet = [
    //     [`problem ${i}`]
    // ]
    
    // console.log('here')
    // add starting trie links to root and add the new problem child to the problem set
    // console.log({stateName})
    // console.log("here", Object.keys(Root2[stateName]))
    Root2 = {
        ...Root2,
        [stateName]: {
            ...Root2[stateName],
            variableNames: !Object.keys(Root2[stateName]).includes('variableNames')?
                            [newVariableName]:
                            [...Root2[stateName].variableNames, newVariableName]
        }
    }
    return Root2
}

const addSubstate = (Root2, stateName, newSubstateName) => {

    // console.log(stateName, newSubstateName)
    Root2 = {
        ...Root2,
        [stateName]: {
            ...Root2[stateName],
            substates: !Object.keys(Root2[stateName]).includes('substates')?
                                [newSubstateName]:
                                [...Root2[stateName].substates, newSubstateName]
        }
    }
    return Root2
}

const makeProblemSet = (state, action) => {


    // get offset from action
    const offsetString = action.meta.offsetString
    // const offsetStateName = offsetString.slice(0, offsetString.length - 1)
    // console.log({offsetStateName})
    // get the list of problems from action
    const mathProblems = action.meta.mathProblems
    let temporaryState = state
    // add a problem set branch
    
    const nameOfProblemSetCetagory = offsetString

    // categories for problems to be in: addProblems, subtractProblems, displayResults
    // this is where the appending happens(add a new item with increased value in the key)
    let problemSetId = getChildren(temporaryState, nameOfProblemSetCetagory).length

    const nameOfProblemSet = `${offsetString} problemSet ${problemSetId}`

    // printTreeInteractive(temporaryState)
    // displayResults -> 'displayResults problemSet 1'
    console.log("|", nameOfProblemSetCetagory, "|" , nameOfProblemSet)
    temporaryState = addChild(temporaryState, nameOfProblemSetCetagory, nameOfProblemSet)
    // console.log('got here')

    // need to also add the problem set state
    temporaryState = initState(temporaryState, nameOfProblemSetCetagory, nameOfProblemSet)
    // correct up to here
    // printTreeInteractive(temporaryState)
    // console.log({mathProblems})
    const i = problemSetId
    // make a test run with just printing out the number's
    mathProblems.forEach((mathProblem, j) => {
        let dataForSingleProblem = {}
        let problemParts = []
        if(offsetString === 'displayResults') {
            dataForSingleProblem = makeProblemPartsForDisplayResults(mathProblem)
            const [a, b, answer, yourAnswer] = dataForSingleProblem
            problemParts = [a, b, answer, yourAnswer]
        }
        else {
            dataForSingleProblem = makeProblemParts(mathProblem)
            const [a, b, answerForm] = dataForSingleProblem
            problemParts = [a, b, answerForm]

        }
        // console.log('got the data')
        // console.log(dataForSingleProblem)
        // add a problem branch
        // the children of each problem set have the same name as the ones in the neighbor problem set
        // had 2 parents pointing to the same set of children the entire time
        // make sure each problem has the problem set id, the problem id, and the problem part id
        const nameOfProblem = `${offsetString} problem ${i} ${j}`
        temporaryState = addChild(temporaryState, nameOfProblemSet, nameOfProblem)

        temporaryState = initState(temporaryState, nameOfProblemSet, nameOfProblem)
    
        problemParts.forEach((problemPart, k) => {

            const problemPartCoordinates = `${offsetString} ${i} ${j} ${k}` // can use the OneValue key and the AddTwoValues key
            temporaryState = addChild(temporaryState, nameOfProblem, problemPartCoordinates)

            // a, b
            if(k < 2) {
                temporaryState = appendStates(  temporaryState,
                                                makeProblemPartNumber(  offsetString,
                                                                        i,
                                                                        j,
                                                                        k,
                                                                        problemPart))
            }
            
            // answerForm or answer
            if(k === 2) {
                // answer
                if(offsetString === 'displayResults') {
                    temporaryState = appendStates(  temporaryState,
                                                    makeProblemPartNumber(  offsetString,
                                                                            i,
                                                                            j,
                                                                            k,
                                                                            problemPart))
    
                }
                else {
                    // answerForm
                    // console.log({problemPart})
                    temporaryState = appendStates(  temporaryState,
                                                    makeAnswerForm( offsetString,
                                                                    i,
                                                                    j,
                                                                    k,
                                                                    problemPart))
    
                }
                
            }
            if(k === 3) {
                // yourAnswer
                if(offsetString === 'displayResults') {
                    temporaryState = appendStates(  temporaryState,
                                                    makeProblemPartNumber(  offsetString,
                                                                            i,
                                                                            j,
                                                                            k,
                                                                            problemPart))
    
                }
            }

            // make the graph representing each problem part
            // offset, i, j
            // make a problem part branch with the attributes using (offset, i, j)
            
        })
        // console.log('added problem parts')
        // printTreeInteractive(temporaryState)
        // console.log(temporaryState)


        
    })
    // printTreeInteractive(temporaryState)

    return [temporaryState, true]
}


// reducers that make state machines holding references to other reducers
// make a simpler version for just showing a + b = c
export const fetchCatStart = (state, action) => {

    return {...state,
            catTree : {...state.catTree,
                        isFetching: true
                    }
            
    }
}

export const fetchCatSuccess = (state, action) => {


    return {...state,
            catTree : {...state.catTree,
                        error: '',
                        isFetching: false,
                        Root: action.payload
                }
        
    }
}
export const fetchCatFailure = (state, action) => {
    return {...state,
            catTree : {...state.catTree,
                        error: action.payload,
                        Root: null,
                        isFetching: false
                }

    }
}
const returnState = (state, action) => {
    return [state, true]
}
const returnStateFalse = (state, action) => {
    return [state, false]
}
const updateTypedAnswer = (state, action) => {
    const { newValue } = action.payload
    const stateName = action.type
    // console.log('updating the typed answer')
    // console.log(action.meta.parentStateName)
    let parentList = action.meta.parentStateName.split(' ')
    const parentStateName = parentList.slice(0, parentList.length - 2).join(' ')
    const offsetString = action.meta.offsetString
    // console.log("got here", parentStateName)
    // parent state name plusProblems 2 0 submission 0
    // plusProblems 2 0 submission 0 
    // the one passed into here plusProblems 2 0 submission 0 updateTypedAnswer 0
    // console.log('new value', newValue, 'parent name', parentStateName)

    // set is probably wrong
    // the value is now in the submission context
    state = set(state, action, `${parentStateName} submission`, 'value', newValue)
    // console.log("after set", state)
    let newValue2 = getVariable(state, `${parentStateName} submission`, 'value')
    // it's like the value is set for certain sanerios
    // console.log(newValue2)
    return [state, true]

}
const noValue = (state, action) => {
    // console.log("is invalid")
    const submissionStateName = action.meta.parentStateName
    const offsetString = action.meta.offsetString
    // console.log({submissionStateName})
    // printTreeInteractive(state)
    // this value should have been set by updateTypedAnswer
    let newValue2 = getVariable(state, submissionStateName, 'value')
    // console.log('value', newValue2)

    let newValue = getVariable(state, submissionStateName, 'value').value
    if(newValue.length === 0) {

        // const parentStateName = action.meta.parentStateName

        let newState = setArray(
            state,
            submissionStateName,
            'quantity',
            makeQuantity(0,
                    getVariable(state, submissionStateName, 'actualAnswer').value))

        newState = set(newState, action, submissionStateName, 'feedbackMessage', 'O')

        newState = set(newState, action, submissionStateName, 'backgroundColor', 'white')
        
        return [newState, true]
    
    }
    return [state, false]
}

const isInteger = (state, action) => {
    const submissionStateName = action.meta.parentStateName
    const offsetString = action.meta.offsetString

    // console.log(getVariable(state, parentStateName, 'value').value,
            // parseInt(getVariable(state, parentStateName, 'value').value))
    // console.log(!isNaN(parseInt(getVariable(state, submissionStateName, 'value').value)) === true)
    return [state, !isNaN(parseInt(getVariable(state, submissionStateName, 'value').value)) === true]
}
const isNotInteger = (state, action) => {
    const submissionStateName = action.meta.parentStateName
    const offsetString = action.meta.offsetString

    // console.log(getVariable(state, parentStateName, 'value').value,
            // parseInt(getVariable(state, parentStateName, 'value').value))
    // console.log(isNaN(parseInt(getVariable(state, submissionStateName, 'value').value)) === true)
    // if(isNaN(parseInt(getVariable(state, submissionStateName, 'value').value)) === true) {
    //     return [state, false]

    // }
    return [state, isNaN(parseInt(getVariable(state, submissionStateName, 'value').value)) === true]


}
const determineAnswerMessage = (actualAnswer, value) => {
    
    return actualAnswer === value? 'O':'X'
    // if correct first time
        // append 1 to the returned result
}

const determineAnswer = (actualAnswer, value) => {
    return actualAnswer === value
}
// submit value
// 66(passs), 8(passes), 7(passes), ''(passes), 'gh'(pass)

// all reducers below this line probably point to the wrong states

const submitValue = (state, action/*e*/) => {
    // start changing this state
    // console.log("submit value", action.type, action.meta.parentStateName)
    // console.log(e.target.value)
    // console.log(pathDownObject)
    // console.log(answerForm)
    // console.log("submit value")
    // console.log("current state", action.meta.currentState)
    // fails when the user puts in an empty value

    // in the submission state
    // console.log(state, action.type)
    // all the info has made it this far
    // const { newValue } = action.payload
    const stateName = action.type
    const submissionStateName = action.meta.parentStateName
    const offsetString = action.meta.offsetString
    // console.log('submitting our value function')
    // console.log(submissionStateName, stateName)
    const newValue = getVariable(state, submissionStateName, 'value').value

    // const { basePath } = action.meta.basePath
    // const variablesBasePath = [...action.meta.basePath, 'variables']

    // [...action.type, 'variables'] is the path to the vars for the answer form
    // console.log(getValue(state, makeVariablesObjectPath(action)))
    // console.log("set value", parentStateName, getVariable(state, parentStateName, 'value'))
    // this line works
    let newState = set(state, action, submissionStateName, 'value', parseInt(newValue))
    // console.log('after the value is set')
    // printTreeInteractive(state)
    // console.log('new tree')
    // console.log(newState, stateName)
    // console.log("correct", getVariable(state, parentStateName, 'correct'))
    let actualAnswer = getVariable(newState, submissionStateName, 'actualAnswer').value
    let maxValue = newValue > actualAnswer? newValue: actualAnswer
    // wrong
    newState = setArray(
        newState,
        submissionStateName,
        'quantity',
        makeQuantity(newValue,
            maxValue)
                )
    // console.log('after the quantity is set', maxValue)
    // printTreeInteractive(state)
    // we have no way of knowing if the value they entered is wrong or too small
    // console.log('new tree 2', newState, stateName)
// pass in correctFirstTime


    newState = set(newState, action, submissionStateName, 'correct', ['actualAnswer', 'value'], determineAnswer)

    newState = set(newState, action, submissionStateName, 'feedbackMessage', ['actualAnswer', 'value'], determineAnswerMessage)

    newState = set(newState, action, submissionStateName, 'backgroundColor', 'black')

    // console.log('new tree 3', newState, stateName)
    newState = set(newState, action, submissionStateName, 'submitCount', getVariable(newState, submissionStateName, 'submitCount').value + 1)
    const submitCount = getVariable(newState, submissionStateName, 'submitCount').value

    // so this matches gotItRightTheFirstTime
    if(submitCount === 1) {
        newState = set(newState, action, submissionStateName, 'firstAnswer', getVariable(newState, submissionStateName, 'value').value)

    }
    // console.log('after everything')
    // printTreeInteractive(state)

    // console.log('new tree 4', newState, stateName)

    return [newState, true]
    
}
const gotItRightTheFirstTime = (state, action) => {

    // complex reducer because within the context of contextual state charts it can update 2 different parent states
    // console.log("here", action, state)
    const stateName = action.type
    // the vars are from the basePath
    const parentStateName = action.meta.parentStateName
    const submissionStateName = action.meta.basePath
    const offsetString = action.meta.offsetString

    // console.log('parent', parentStateName)
    let submitCount = getVariable(state, submissionStateName, 'submitCount').value
    let correct = getVariable(state, submissionStateName, 'correct').value
    let newState = state
    if(submitCount === 1 && correct) {
        newState = set(newState, action, parentStateName, 'correctFirstTime', true)

        // need to use the same parent state name for getting and setting
        const feedbackMessage = getVariable(state, submissionStateName, 'feedbackMessage').value
        newState = set(newState, action, submissionStateName, 'feedbackMessage', feedbackMessage + '1')

        return [newState, true]

    }
    return [newState, false]

}
// tests above this line pass
const processProblems = (state, action, cb) => {

    // This function generates the (i, j) coordinates for finding the correct state
    // (i, j) => 00, 13, ... (numberOfProblems, numberOfProblems * 3)
    // "problem set 0" tells me how many problems we need to use to look for the forms
    const offsetString = action.meta.offsetString

    let problems = getChildren(state, `${offsetString} problemSet 0`)
    let numberOfProblems = problems.length
    let temporaryState = state


    for(let i = 0; i < numberOfProblems; i += 1) {
        temporaryState = cb(temporaryState, action, 0, i, 0)
    }
    return temporaryState

}

const solveProblem = (state, action, i, j, k) => {

    // the last one is always ""
    // the last one's correctFirstTime is always not getting set
    // now it seems to be working
    // don't know if it was solved
    const offsetString = action.meta.offsetString
    // console.log("inside solveProblem", `|${offsetString}|${i} ${j}`)
    // printTreeInteractive(state)
    let temporaryState = state
    let a = getVariable(state, `${offsetString} ${i} ${j} ${k}`, 'value').value
    let b = getVariable(state, `${offsetString} ${i} ${j} ${k + 1}`, 'value').value
    let submission =           `${offsetString} ${i} ${j} ${k + 2} submission`
    // console.log(a, b, submission)
    // randomly get it wrong
    let randomValue = Math.floor(Math.random() * 10) % 2
    // plusProblems correctFirstTime 4
    if(randomValue === 0) {
        // console.log("answer is right the first time")
        temporaryState = set(temporaryState, action, submission, 'value', a + b)
        let progressMeter = `${offsetString} ${i} ${j} ${k + 2} progressMeter`
        temporaryState = set(temporaryState, action, progressMeter, 'correctFirstTime', true)
    
    }
    else {
        // if b == 1 then this is always messed up
        temporaryState = set(temporaryState, action, submission, 'value', -1)
        let progressMeter = `${offsetString} ${i} ${j} ${k + 2} progressMeter`
        temporaryState = set(temporaryState, action, progressMeter, 'correctFirstTime', false)

    }
    // let result = getVariable(temporaryState, submission, `${offsetString}value`)
    // console.log('get result', result)
    // solved it correctly up to here
    // console.log('result', temporaryState)
    temporaryState = set(temporaryState, action, submission, 'correct', ['actualAnswer', 'value'], determineAnswer)

    temporaryState = set(temporaryState, action, submission, 'submitCount', getVariable(temporaryState, submission, 'submitCount').value + 1)

    temporaryState = set(temporaryState, action, submission, 'firstAnswer', getVariable(temporaryState, submission, 'value').value)

    // console.log("solved a problem", j)
    // printTreeInteractive(temporaryState)
    return temporaryState
}

const autoSolve = (state, action) => {
    // runs through all the forms and solve them for getting test data for the backend
    // this is instead of solving the problems manuallly
    // indexes of the states making up each part of the form
    // a0, b0, answerForm0, ....
    // (i, j) => 00, 10, 20, 31, 41, 51... (numberOfProblems * 3, numberOfProblems)

    // "problem set 0" tells me how many problems we need to use to look for the forms
    // const parentStateName = action.meta.parentStateName
    // console.log('inside autoSolve', `|${action.meta.offsetString}|`)
    let temporaryState = processProblems(state, action, solveProblem)
    // console.log('after autosolve')
    printTreeInteractive(temporaryState)

    return [temporaryState, true]

}
const collectProblems = (state, action, i, j, k) => {

    // getCell(state, parentStateName)
    // console.log('in collect problems', state)
    let temporaryState = state
    const offsetString = action.meta.offsetString

    let a = getVariable(state, `${offsetString} ${i} ${j} ${k}`, 'value').value
    let b = getVariable(state, `${offsetString} ${i} ${j} ${k + 1}`, 'value').value
    let submission =           `${offsetString} ${i} ${j} ${k + 2} submission`
    let progressMeter =        `${offsetString} ${i} ${j} ${k + 2} progressMeter`


    let firstAnswer = getVariable(state, submission, 'firstAnswer').value

    let actualAnswer = getVariable(state, submission, 'actualAnswer').value

    let gotItRightTheFirstTime = getVariable(state, progressMeter, 'correctFirstTime').value
    // console.log('values', a, b, firstAnswer)
    let row = {
        a: a,
        b: b,
        theirAnswer: firstAnswer,
        actualAnswer: actualAnswer,
        gotItRightTheFirstTime: gotItRightTheFirstTime
    }


    let myProblemTable = getCell(state, 'payload')
    // console.log('my promblem table', myProblemTable)
    temporaryState = tableAssign(
        state,
        myProblemTable, 
        {   ...myProblemTable.value,
            'problem set table': [...myProblemTable.value['problem set table'], row]

        }
        )

    return temporaryState
    // myProblemTable = [...myProblemTable, row]


    // a0 | b0 | theirAnswer0 | actualAnswer | gotItRightTheFirstTime0
}
const setupForBackend = (state, action) => {

    // console.log('we are setting the completed form data for submitting to the backend')
    // console.log('state', state, action)
    // make a single payload state


    let temporaryState = state
    const offsetString = action.meta.offsetString
    
    // console.log('added the problem set table', temporaryState)
    temporaryState = processProblems(temporaryState, action, collectProblems)

    // console.log("done with first part", temporaryState)
    // let x = getCell(temporaryState, ['payload'])
    let myCompletedProblems = getCell(temporaryState, 'payload')
    // console.log('completed problems', myCompletedProblems)
    const correctProblems = myCompletedProblems.value['problem set table'].filter(problem => problem.gotItRightTheFirstTime).length
    // console.log('correctProblems', correctProblems)
    // calculate % of correct problems
    // round to largest whole number
    temporaryState = tableAssign(
        temporaryState,
        myCompletedProblems, 
        {   ...myCompletedProblems.value,
            'problem sets table': {nameOfProblemSet: `${offsetString} problem set 0`,
                                numberCorrect: correctProblems,
                                totalProblems: myCompletedProblems.value['problem set table'].length
                            }
        }
        )


    return [temporaryState, true]
}

const saveProblemSetSelectedForDisplay = (state, action) => {

    // wouldn't be possible if stateName is an array of strings
    // takes in a new value and updates itself
    const stateName = action.type
    const parentStateName = action.meta.parentStateName
    let problemSetId = action.payload
    let temporaryState = state
    console.log(stateName, problemSetId)
    // debugger
    // store the payload to selectedProblemSetFromBackend instead

    // not connected to the main graph
    // temporaryState = setVariable(temporaryState, parentStateName, stateName, newValue) => {
    // console.log('updating value', stateName)
    temporaryState = setVariable(   temporaryState,
                                    parentStateName,
                                    'selectedProblemSetFromBackend',
                                    problemSetId)

    // console.log('new value', newValue)
    // printTreeInteractive(temporaryState)
    return [temporaryState, true]
}
// only runs when user does autocompute
const storeResults = (state, action) => {

    const stateName = action.type
    const payload = action.payload
    let temporaryState = state

    // console.log('store resulst', payload)

    let parentStateName = 'elementarySchool storeResults'
    temporaryState = setVariable(temporaryState, parentStateName, 'resultsFromBackend', payload)
    // console.log('saved payload')
    // console.log(temporaryState)
    return [temporaryState, true]
}

const setupSubmachineForDisplay = (state, action) => {

    const stateName = action.type
    const payload = action.payload
    let temporaryState = state

    let problemSets = getCell(temporaryState, 'resultsFromBackend').value['problems']
    // console.log({problemSets})
    // problemSetId is too large(the sql id table isn't getting reset)
    let problemSetId = getCell(temporaryState, 'selectedProblemSetFromBackend').value

    // console.log('my problem sets', problemSets, 'selected problem set id', problemSetId)
    const myProblemSet = problemSets[problemSetId]
    // console.log('the problem set to display', myProblemSet)
    // make the state machine structure for each problem
    // action.meta.problemSet = myProblemSet
    action.meta.mathProblems = myProblemSet
    action.meta.offsetString = 'displayResults'
    console.log({action})
    // can't just append the next problem set for display when a user selects a random problem set
    // we can change the problem set gneration to using a dict system
    // we can also loop the makeProblemSet for all the times there are problem sets
    // have this function be called earlier in the timeline and use a loop
    // we are just appending to the end of a growing list
    // loop idea works

    // map the problem id selected to the last problem appended
    // systemwide problem requarding offsetString as a state name
    // 'plusProblems' as a state name vs 'plusProblems ' as a state name access substring
    // for(let i = 0; i < problemSets.length; i += 1 ) {
    let problemSetIdMapToAppendedProblemId = getVariable(temporaryState, 'elementarySchool displayResults', 'problemSetIdMapToAppendedProblemId').value
    // the second time selecting problemSetId messes things up
    // it's using the previously selected one for a different item
    // seems to be set to the previously selected item
    // this if statement may be wrong
    if(problemSetIdMapToAppendedProblemId[problemSetId] === undefined) {

        temporaryState = setVariable(temporaryState, 'elementarySchool displayResults', 'problemCount', myProblemSet.length)

        // works because this always appens the next generated set to the parent's child array
        // and we map the set they picked with the index of the last position of the parent's child array

        // "displayResults problemSet 0" is the problem set name genrated but the '0' doesn't refer to the ith problem set
        // when this runs it's overriting previous correctly calculated results for a different problem set
        // this problem set is for display purposes
        let result = makeProblemSet(temporaryState, action)
        temporaryState = result[0]
        let myDisplayResults = getCell(temporaryState, 'displayResults')
    
        // index of the last item appended
        let appendedProblemId = myDisplayResults.children.length - 1
    
        // have it find out if the user already picked it and only generate stuff if the user hasn't picked it before
        // works
        console.log({problemSetId, appendedProblemId})
    
        temporaryState = setVariable(   temporaryState,
                                        'elementarySchool displayResults',
                                        'problemSetIdMapToAppendedProblemId',
                                        {...problemSetIdMapToAppendedProblemId,
                                            [problemSetId]: appendedProblemId})
    }  

    // temporaryState = {
    //     ...temporaryState,
    //     // add var name to parent
    //     'elementarySchool displayResults': {
    //         ...temporaryState['elementarySchool displayResults'],
    //         variableNames: [...temporaryState['elementarySchool displayResults'].variableNames,
    //                         'problemSetIdMapToAppendedProblemId']
    //     },
    //     // add variable to machine and link it to parent
    //     'problemSetIdMapToAppendedProblemId': {
    //         parent: 'elementarySchool displayResults', // same parent as selectedProblemSetFromBackend
    //         name: 'problemSetIdMapToAppendedProblemId',
    //         value: {[problemSetId]: appendedProblemId}
    //     }
    // }
    // 'problemSetIdMapToAppendedProblemId'
    // one state varable with value = {problemSetId: appendedProblemId}
    console.log('set dict up', temporaryState)


    printTreeInteractive(temporaryState)

    // have the viewing card read the structure
    return [temporaryState, true]
}

const setupSubmachineForProblems = (state, action) => {

    // set the problems into action.meta
    // call setupProblem

}


// reducers and the state for it in the same file
// merge the states with 1 initialState
// group by context of problem, not by kind of coding construct
// let Root2 = {}
let Root2 = {

    // the indents are to illustrate the nesting the editor should pickup on but doesn't
    'root': {
        name: 'root',
        children: ['elementarySchool']
    },

    /*
    elementartySchool
        children:
            add, subtract, display

    add
        children
            plusProblems problemSet 0, plusProblems problemSet 1
    plusProblems problemSet 0
        children
            plusProblems problem 0, plusProblems problem 2, plusProblems problem 3
    plusProblems problem 0
        children
            plusProblems(batch name) problemPart 0(ith probelem) 0(ith problem part)
    
    plusProblems(batch name) problemPart 0(ith probelem) 0(ith problem part)
        children 
        plusProblems varName 0 0

    subtract
        children
            subtractProblems problemSet 0, subtractProblems problemSet 1
    
    display
        children
            displayResults problemSet 0, displayResults problemSet 1
    
    
    batch branching routine


    make a new branch (plusProblems problemSet 0)

    for each subbranch(problem) we need 
        make a submachine for each sub sub branch(numbers, form) we need
    

    make submachine
        if we are at a number
            make the number
        else
            make the form
    */
    'elementarySchool': {
        parent: 'root',
        name: 'elementarySchool',
        substates: ['utilities', 'testing', 'storeResults', 'displayResults'],
        children: ['plusProblems', 'displayResults'],
    },
                // 2 indents as it's a substate
                'elementarySchool utilities': {
                    parent: 'root',
                    name: 'elementarySchool utilities',
                    substates: ['create problem']
                },
    
                        'elementarySchool utilities createProblem': {
                            parent: 'root',
                            name: 'elementarySchool utilities createProblem',
    
                            functionCode: makeProblemSet,
                        },
    'plusProblems': {
        parent: 'elementarySchool',
        name: 'plusProblems',
        // holds each problem set
        children: []
    },
    'displayResults': {
        parent: 'elementarySchool',
        name: 'displayResults',
        children: []
    },
            'elementarySchool testing': {
                parent: 'root',
                name: 'elementarySchool testing',
                functionCode: returnState,
                children: ['autoSolve']
            },
                // 1 indent as it's just a child/variable
                'autoSolve': {
                    parent: 'elementarySchool testing',
                    name: 'autoSolve',
                    functionCode: autoSolve,
                    nextStates: ['setupForBackend']
                },
                'setupForBackend': {
                    parent: 'elementarySchool testing',
                    name: 'setupForBackend',
                    functionCode: setupForBackend,

                },
// --------------------------

            // after this is run there is no need to transfer the payload
            'elementarySchool storeResults': {
                parent: 'root',
                name: 'elementarySchool storeResults',
                functionCode: storeResults,
                variableNames: ['resultsFromBackend', 'payload'],
            },
                'resultsFromBackend': {
                    parent: 'elementarySchool storeResults',
                    name: 'resultsFromBackend',
                    value: -1
                },
                // from the backend response
                'payload': {
                    parent: 'elementarySchool storeResults',
                    name: 'payload',
                    value: {'problem set table': []}
                },
// ----------------------------
            // for displaying results only
            'elementarySchool displayResults' : {
                parent: 'root',
                name: 'elementarySchool displayResults',
                children: ['saveProblemSetSelectedForDisplay', 'displayResults problemSet 0'],
                variableNames: ['selectedProblemSetFromBackend', 'problemSetIdMapToAppendedProblemId', 'displayResults problemCount']
            },
                'selectedProblemSetFromBackend': {
                    parent: 'elementarySchool storeResults',
                    name: 'selectedProblemSetFromBackend',
                    value: -1,
                },
                // maps the ith problem set to the jth appended problem set for display
                'problemSetIdMapToAppendedProblemId': {
                    parent: 'elementarySchool displayResults',
                    name: 'problemSetIdMapToAppendedProblemId',
                    value: {}  // so I don't have to spend more time doing 'value' vs 'value' attribute juggling while setting
                    // a state to a value
                },
                'displayResults problemCount': {
                    parent: 'elementarySchool displayResults',
                    name: 'displayResults problemCount',
                    value: 0
                },


                'saveProblemSetSelectedForDisplay': {
                    parent: 'elementarySchool storeResults',
                    name: 'getProblemsFromBackend',
                    functionCode: saveProblemSetSelectedForDisplay,
                    nextStates: ['setupSubmachineForDisplay']
                },

                // get the data from resultsFromBackend and selectedProblemSetFromBackend
                // and use it to identify the right js object to make the submachine out of
                'setupSubmachineForDisplay': {
                    parent: 'elementarySchool storeResults',
                    name: 'setupSubmachineForDisplay',
                    functionCode: setupSubmachineForDisplay
                }       
}



// 'nameOne nameTwo'
// 'elementarySchool utilities'
// 'elementarySchool testing'
// 'elementarySchool storeResults'


// 1 state per entry in table

    
    
// let elementarySchoolName = 'elementarySchool'
// let x = treeVisualizer2(Root2, elementarySchoolName)
// console.log('tree', x)

// let stateMachine = setupProblem(Root2)
// console.log(stateMachine)
// console.log('state to export', stateMachine[0])
// let machine2 = setupProblem(stateMachine[0])
// machine2 = setupProblem(machine2[0])
// get the list of problems from action

// converts the problems to the contextual state chart structure
let action = {
    type: 'elementarySchool utilities createProblem',
    meta: {
            basePath: 'elementarySchool utilities createProblem', // base state(for the object data)
            parentStateName: 'elementarySchool utilities createProblem',
            offsetString: 'plusProblems',
            mathProblems: problems
        }
}
const [temporaryState, success] = breathFirstTraversal(
    Root2,
    action,
    [action.type],
    0,
    {})
// console.log('done with machine')
// let elementarySchoolName = 'elementarySchool'
// let x = treeVisualizer2(temporaryState, elementarySchoolName)
// console.log('tree', x)
// the data is setup at this point
// if(success) {
//     console.log('all reducers are done', temporaryState)
//     return temporaryState
// } else {
//     return state
// }
// problemParts exists here but not in presentProblems
export var Root = temporaryState