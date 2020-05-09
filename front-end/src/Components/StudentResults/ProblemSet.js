import React from 'react'
import styled from 'styled-components'
import Loader from 'react-loader-spinner';
import ProblemSetCard from './ProblemSetCard'
import { connect } from 'react-redux'
import { getCat, submitAnswer, addToAnswer } from '../Redux/Actions'
import {
    getCell,
    getVariable } from '../../reducerHelpers'

    
const ProblemSet = (props) => {
    const {Root} = props

    // assume the state chart is already made
    // look for states using the old frontend components with a start offset of 'display '
    let problemSet = getCell(Root, 'resultsFromBackend').jsObject['problems']
    let id = getCell(Root, 'selectedProblemSetFromBackend').value
    if(id >= 0) {
        console.log('my problems', problemSet[id])
        return (
            <div>
                {problemSet[id].map((problem, i) => (
                    <ProblemSetCard key={i} stateCoordinates={{problemSet: id, problem: i}}/>
                ))}
            </div>
        )
    } else {
        return (
            <div>
            </div>
        )
    
    }
}

const mapStateToProps = state => {
    return {
        Root: state
    }
}
export default connect(
    mapStateToProps,
    { getCat, submitAnswer, addToAnswer }

)(ProblemSet)
