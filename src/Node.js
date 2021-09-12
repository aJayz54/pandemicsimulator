import React from "react";
import PropTypes from "prop-types";


import "./Node.css";

export default class Node extends React.Component {
    static propTypes = {
        row : PropTypes.number,
        col : PropTypes.number,
        justInfected : PropTypes.bool,
        stillContagious : PropTypes.bool,
        immune : PropTypes.bool,
        isDead : PropTypes.bool,
        isVaccinated : PropTypes.bool,
        onMouseDown : PropTypes.func,
        onMouseUp : PropTypes.func, 
        onMouseEnter : PropTypes.func,
    };    

    render () {
        const {
            row,
            col,
            justInfected,
            stillContagious,
            isDead,
            immune,
            isVaccinated,
            onMouseDown,
            onMouseUp,
            onMouseEnter,
        } = this.props;

        const extraModifier = justInfected ? 'node-new' 
        : stillContagious ? 'node-old'
        : immune ? 'node-immune'
        : isVaccinated ? 'node-vaccinated' 
        : isDead ? 'node-dead'
        : '';

        return (
            <div
                id = {`node-${row}-${col}`}
                className = {`node ${extraModifier}`}
                onMouseDown = {() => onMouseDown(row, col)}
                onMouseEnter = {() => onMouseEnter(row, col)}
                onMouseUp = {() => onMouseUp()}>
            </div>
        );
    }
}