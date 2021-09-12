import React from "react";
import PropTypes from "prop-types";
import Node from "./Node";

import "./Grid.css";

export default class Grid extends React.Component {
    static propTypes = {
        grid : PropTypes.array,
    }

    constructor(props) {
        super(props);
        this.state = {
            grid : this.props.grid,
            mouseIsPressed : true,
        };
    }

    handleMouseDown(row, col) {
        const newGrid = infectSquare(this.state.grid, row, col);
        this.setState ({grid: newGrid, mouseIsPressed: true});
    }
    
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = infectSquare(this.state.grid, row, col);
        this.setState ({grid: newGrid});
    }
    
    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }
    
    render() {
        const {grid, mouseIsPressed} = this.state;
        return(
            <>
            <div>
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                        const {col, row, justInfected, stillContagious, immune, isVaccinated} = node;
                        return (
                            <Node
                                key={nodeIdx}
                                row={row}
                                col={col}
                                justInfected={justInfected}
                                stillContagious={stillContagious}
                                immune={immune}
                                isVaccinated={isVaccinated}
                                mouseIsPressed={mouseIsPressed}
                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                onMouseEnter={(row, col) =>
                                    this.handleMouseEnter(row, col)
                                }
                                onMouseUp={() => this.handleMouseUp()}>
                            </Node>
                        );
                        })}
                        </div>
                    );
                })}
            </div>
            </>
        );
    }
}

  
const infectSquare = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      justInfected: !node.justInfected,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}