
/*
i : {
    paragraph: {
        j: {
            paragraph: {
                k: {                        1 word
                    value,
                    quantity,
                    isForm,
                    operationType,
                    displayResultsOnly: {   special conditions
                        values: [
                            isCorrect,
                            isActualAnswer,
                            isResult
                        ]
                    }

                    paragraph: [            you are describing the behavor k does
                    
                    ]
                    nextPhrase: [           list of phrases of what to read next after k is done

                    ]
                    values: [               variables

                    ]
                }
            }
        }
    }
}

elementarySchool : {
    utilities: {
        createProblem: {
            functionCode: makeProblemSet
        }
    }
    testing: {
        functionCode:
        paragraph: {
            autosolve: {
                functionCode: autoSolve
                nextPhrase: [
                    'setupForBackEnd'
                ]
            }
            setupForBackEnd: {
                functionCode: setupForBackend
            }
        }
    },
    storeResults: {
        functionCode: storeResults,
        variables: {
            resultsFromBackend: -1,
            payload: {'problem set tale': []}
        }
        paragraph: setupSubmachineForDisplay
    },
    displayResults: {
        paragraph: {
            saveProblemSetSelectedForDisplay: {
                functionCode: saveProblemSetSelectedForDisplay,
                nextPhrase: ['setupSubmachineForDisplay']
            },
            setupSubmachineForDisplay: {
                functionCode: setupSubmachineForDisplayF
            }
            problemSet: {
                0:{}
            }
        },
        variables: {
            selectedProblemSetFromBackend: -1,
            problemSetIdMapToAppendedProblemId: {},
            problemCount: 0
        }

    },
    paragraph: {
        plusProblems: {
            paragraph: {}
        },
        dpslayResults: {
            paragraph: {}
        }
    }
}

->
state names are syllables
the extra context information is like a suffix, or ajective
parent: get this from prev state name,
name: state name,
suffix: what name do we give our slight modification to the state,
variableNames: [valueName,
                quantityName,
                isFormName,
                operationTypeName]
sentence: [
    words to describe the state
]

Tell them what's exciting about it
put words to things
contextually sensitive hierarchical tree graph
    will need a good example for telling apart the substates from the chldren(word suffix vs descriptive phrase)
    it makes it easier to add features when the code is organized in a way that's easier for humans to process

don't apologize
blockers
    first time making state machine engine with redux
        the graph was hardcoded
    second attenpt
        the graph had generation functions for the problems
    3rd attempt
        because the problems had the same structure on the different routes an extra coordinate name was used to tell them
        apart
        the benefit was it allowed me to use the same functional component for proving the problems to be solved and displaying
        the results, despite the fact that the routes had different things on them and the data sources for the problem set
        were different
    4th attempt
        the js code for the generation functions was well engineered js, but there was a readability problem. The engineer would be expected to 
        hunt around and find the hierarchy. Switching the flat hash table to a json object made the hierarchy easier to understand.
        The entire frontend had to be redone. The entire file structure had to be redone also.

*/

import { makeQuantity } from "../../utility"

// const makeNumber = ()
let displayResultComponents = [ 
    {theirAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5), isCorrect: true}},
    actualAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5)}}},

    {theirAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5), isCorrect: true}},
    actualAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5)}}},

    {theirAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5), isCorrect: true}},
    actualAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5)}}},

    {theirAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5), isCorrect: true}},
    actualAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5)}}},

    {theirAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5), isCorrect: true}},
    actualAnswer: {variables: {value: 5, quantity: makeQuantity(5, 5)}}}
]
const makeProblemComponents = ( problems,
                                displayResultComponents,
                                operationType) => {

    let problemSet = {}
    problems.forEach((problem, i) => {

        let {a, b} = problem
        const mySum = a + b
        problemSet[i] = {
            children: {
                a: {variables: {value: a, quantity: makeQuantity(a, mySum)}},
                b: {variables: {value: b, quantity: makeQuantity(b, mySum), operationType: operationType}},
            }
        }
        if(operationType === 'add' || operationType === 'subtract') {
            problemSet[i]['children']['answerForm'] = {
                variables: {value: mySum, quantity: makeQuantity(mySum, mySum)},
                submission: {
                    variables: {
                        value: '',
                        quantity: makeQuantity(0, mySum),
                        correct: false,
                        firstAnswer: null,
                        actualAnswer: mySum,
                        submitCount: 0,
                        feedbackMessage: 'O',
                        backgroundColor: 'white'
                    }
                },
                progressMeter: {
                    variables: {
                        correctFirstTime: false,
                        testingWithoutForm: false
                    }
                }
            }
        }
        if(!displayResultComponents) {
            return
        }
        problemSet[i][children]['theirAnswer'] = displayResultComponents[i]['theirAnswer']
        problemSet[i][children]['actualAnswer'] = displayResultComponents[i]['actualAnswer']

    })
    return problemSet
}

let newContextualStateChart = {
    elementarySchool : {
        utilities: {
            createProblems: {
            // functionCode: makeProblemSet
            }
        },
        testing: {
            // functionCode: returnState,
            start: ['autosolve'],
            children: {
                autosolve: {
                    // functionCode: autoSolve,
                    next: ['setupForBackEnd']
                },
                setupForBackEnd: {
                // functionCode: setupForBackend
                }
            }
        },
        storeResults: {
            // functionCode: storeResults,
            variables: {
                resultsFromBackend: -1,
                payload: {'problem set tale': []}
            }
        },
        children: {
            plusProblems: {
                'problemSet 0': makeProblemComponents(problems, false, 'add')
            },
            dislayResults: {
                'problemSet 0': makeProblemComponents(problems, displayResultComponents),
                // functionCode: returnState,
                start: ['saveProblemSetSelectedForDisplay'],
                children: {
                    saveProblemSetSelectedForDisplay: {
                        // functionCode: saveProblemSetSelectedForDisplay,
                        next: ['setupSubmachineForDisplay']
                    },
                    setupSubmachineForDisplay: {
                        // functionCode: setupSubmachineForDisplay
                    },
                    problemSet: {
                        0: {}
                    }
                },
                variables: {
                    selectedProblemSetFromBackend: -1,
                    problemSetIdMapToAppendedProblemId: {},
                    problemCount: 0
                }
            }
        }
    }
}