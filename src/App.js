import React from 'react';
import './App.css';
import Node from "./Node";
import returnGenerations from "./algorithm"
import _ from "lodash";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid : getInitialGrid(30),
      generationSequence: [],
      deathrate: 30,
      tempdeathrate: 0,
      vaccinated: false,
      vaccinatedRate: 0,
      tempGeneration: 0,
      generations: 100,
      maxGenerations: 100,
      tempGenerations: 100, 
      tempVaccinatedRate: 0,
      tempvaccinated: false,
      distancing: false,
      tempdistancing: false,
      generation: 0,
      notSubmit: true,
      mouseIsPressed: false,
    };

    this.handleDeathChange = this.handleDeathChange.bind(this);
    this.handleVChange = this.handleVChange.bind(this);
    this.handleRateChange = this.handleRateChange.bind(this);
    this.handleDChange = this.handleDChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGenerationSubmit = this.handleGenerationSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleGenChange = this.handleGenChange.bind(this);
    this.handleGenerationsChange = this.handleGenerationsChange.bind(this);
    this.handleGenSubmit = this.handleGenSubmit.bind(this);
  };

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
  
  handleDeathChange(event) {
    this.setState({tempdeathrate : parseFloat(event.target.value)});
  };

  handleVChange(event) {
    this.setState(prevstate => 
      ({tempvaccinated : !prevstate.tempvaccinated})
      );
  };

  handleDChange(event) {
    this.setState(prevstate => 
      ({tempdistancing : !prevstate.tempdistancing})
    );
  };
  
  handleGenerationsChange(event) {
    this.setState({tempGenerations : parseInt(event.target.value)});
    this.setState({maxGenerations : parseInt(event.target.value)});
  };

  handleRateChange(event) {
    this.setState({tempVaccinatedRate : parseFloat(event.target.value)});
  }

  handleSubmit(event) {
    var spreadability = 0.5;
    if (this.state.tempdistancing) {
      spreadability = 0.2;
    }
    const generationSequence = returnGenerations(this.state.grid, spreadability, this.state.tempvaccinated, this.state.tempVaccinatedRate, this.state.tempdeathrate, this.state.tempGenerations);
    this.setState(prevstate => 
      ({
      deathrate : prevstate.tempdeathrate,
      vaccinated : prevstate.tempvaccinated,
      vaccinatedRate : prevstate.tempVaccinatedRate,
      generationSequence: generationSequence,
      distancing : prevstate.tempdistancing,
      generations : prevstate.tempGenerations,
      notSubmit: false,
    }));
    event.preventDefault();
  }
  
  handleGenerationSubmit(event) {
    this.setState(prevstate =>
      ({
        generation : prevstate.generation + 1,
        tempGeneration : prevstate.tempGeneration + 1,
      }));
      event.preventDefault();
  }

  handleBack(event) {
    this.setState(prevstate =>
      ({
        generation : prevstate.generation - 1,
        tempGeneration : prevstate.tempGeneration - 1,
      }));
      event.preventDefault();
  }

  handleGenChange(event) {
    this.setState({tempGeneration: parseInt(event.target.value)});
  }

  handleGenSubmit(event) {
    if (this.state.tempGeneration > this.state.maxGenerations - 1) {
      this.state.tempGeneration = this.state.maxGenerations - 1
    }
    this.setState(prevstate => 
      ({
        generation : prevstate.tempGeneration
      }));
      event.preventDefault();
  }

  render() {
    const {grid, mouseIsPressed, generationSequence, generation} = this.state;
    return (
      <div className = "App-header">
        <header className = "Pandemic">
          Pandemic Simulator
        </header>
        {this.state.notSubmit &&
          <>
          <div>
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                        const {col, row, justInfected, stillContagious, immune, isVaccinated, isDead} = node;
                        return (
                            <Node
                                key={nodeIdx}
                                row={row}
                                col={col}
                                justInfected={justInfected}
                                stillContagious={stillContagious}
                                isDead={isDead}
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
          <div className="inputBox">
            <h2>Input Box</h2>
            <form onSubmit={this.handleSubmit}>
              <label>
                Number of Generations? 
                <input type="number" value = {this.state.tempGenerations} onChange = {this.handleGenerationsChange}/>
              </label>
              <br />
              <label>
                Death Rate:
                <input type="number" value={this.state.tempdeathrate} onChange={this.handleDeathChange} step="0.01"/>
              </label>
              <br />
              <label>
                Vaccinated?   
                <input type="checkbox" onChange={this.handleVChange} />
              </label>
              <br />
              <label>
                Vaccinated Rate? <input type="number" value={this.state.tempVaccinatedRate} onChange={this.handleRateChange} step="0.01"/>
              </label>
              <br />
              <label>
                Social Distancing?    
                <input type="checkbox" onChange={this.handleDChange} />
              </label>
              <br />
              <input type="submit" value="Submit" />
            </form>
          </div>
          </>
        }
        {!this.state.notSubmit &&
          <>
          <div>
                {generationSequence[generation].map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                        const {col, row, justInfected, stillContagious, immune, isVaccinated, isDead} = node;
                        return (
                            <Node
                                key={nodeIdx}
                                row={row}
                                col={col}
                                justInfected={justInfected}
                                stillContagious={stillContagious}
                                immune={immune}
                                isDead = {isDead}
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
          <div>
          {(this.state.generation !== 0) && 
            <form onSubmit = {this.handleBack}>
              <input type="submit" value="Prev" />
            </form>
          }
            Generation: 
            <input type = "number" value = {this.state.tempGeneration} onChange = {this.handleGenChange} min="0" max={this.state.tempGeneration - 1} />
            <form onSubmit = {this.handleGenSubmit}>
              <input type="submit" value = "Submit" />
            </form>
          {(this.state.generation !== this.state.maxGenerations - 1) && 
          <form onSubmit={this.handleGenerationSubmit}>
            <input type="submit" value="Next" />
          </form>
          }
          </div>
          </>
        } 
      </div>
    );
  }
}

const getInitialGrid = (nvalue) => {
  const grid = [];
  for (let row = 0; row < nvalue; row++) {
    const currentRow = [];
    for (let col = 0; col < 2*nvalue; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    justInfected: false,
    stillContagious: false,
    immune: false,
    isDead: false,
    isVaccinated: false,
  };
};

const infectSquare = (grid, row, col) => {
  const newGrid = _.cloneDeep(grid);
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    justInfected: !node.justInfected,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}