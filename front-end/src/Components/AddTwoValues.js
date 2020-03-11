import React from 'react'
import OneValue from './OneValue';
import styled from 'styled-components'
import Answer from './Answer'
// AddTwoValues box
// mobile first
const backgroundColor = "lightblue"
const Container = styled.div`

    // @media(max-width: 400px) {
        width: vw;
        background-color: ${props => props.backgroundColor};
        border: 1px solid #BADA55;
    
        margin: 0 auto;
        // magin-left: 
    // }
    
`
/*
make a component for this
bring in the recursive object spread function for updating the forms
problemSet: {
    0: {
        a: {
            value: 4
            quantity: makeQuantity(whatValueHas)
        }
        b: {
            value: 3
            quantity:
        }
        answerForm: {
            theirAnswer:
            actualAnswer: 4 + 3
        }
    }
}

< bla i={i} problem={problem} setProblemSet={setProblemSet} setProblemSet={setProblemSet} />
*/

const makeQuantity = (value, total) => {
    let x = []
    for(let i = 0; i < total; i++) {
        if(i < value) {
            x = [...x, 1]

        } else {
            x = [...x, 0]
        }
    }

    return x

}

export const PresentProblems = (props) => {

    const answer = 4 + 3
    const [problemSet, setProblemSet] = useState({
        0: {
            a: {
                value: 4,
                quantity: makeQuantity(4, answer)
            },
            b: {
                value: 3,
                quantity:makeQuantity(3, answer)
            },
            answerForm: {
                theirAnswer: undefined,
                actualAnswer: answer
            }
        }
    })
    return (
        <div>

        {Object.keys(problemSet).map(problemId => {
            
            <AddTwoValues
                key={problemId}
                pathDownObject={[problemId]}
                problem={problemSet[problemId]}
                setProblemSet={setProblemSet}

                />

        })}
        {/* < bla i={i} problem={problem} setProblemSet={setProblemSet} setProblemSet={setProblemSet} /> */}

        </div>
    )
}

// need to know all the values so the right total spaces can be calculated
export const AddTwoValues = (props) => {
    // have useState here
    const {

        pathDownObject,
        problem,
        setProblemSet
    } = props
    const total = problem.a.value + problem.b.value
    return (
        // needs a form and both values with the solution
        <Container backgroundColor={backgroundColor}>
            {/* <h1>testing</h1> */}
            <OneValue
                problemPart={problem.a}
                total={total}
                path={[...path, "a"]}
                backgroundColor={backgroundColor}/>
            <OneValue
                
                problemPart={problem.b} 
                total={total}
                path={[...path, "b"]}

                backgroundColor={backgroundColor}/>
            <Answer
                value={total} 
                total={total}
                path={[...path, "answerForm"]}

                backgroundColor={backgroundColor}/>
        </Container>
    )
}

// export default AddTwoValues;