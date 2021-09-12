import _ from "lodash";


export default function returnGenerations(grid, spreadability, vaccinated, vaccinatedRate, deathrate, tempgenerations) {
    var newGrid = _.cloneDeep(grid);
    const generations = [];
    if (vaccinated) {
        for (const row of grid) {
            for (const node of row) {
                if (Math.random() <= vaccinatedRate && !node.justInfected) {
                    const newNode = {
                        ...node,
                        isVaccinated : true
                    }
                    const {row, col} = node;
                    newGrid[row][col] = newNode;
                }
            }
        }
    }

    for (let i = 0; i < tempgenerations; i++) {
        generations.push(newGrid);
        newGrid = infect(newGrid, spreadability, deathrate);
    }

    return generations;
}



function getAllNewlyInfectedNodes(grid) {
    const nodes = []
    for (const row of grid) {
        for (const node of row) {
            if (node.justInfected) {
                nodes.push(node);
            }
        }
    }
    return nodes;
}

function getAllStillContagiousNodes(grid) {
    const nodes = []
    for (const row of grid) {
        for (const node of row) {
            if (node.stillContagious) {
                nodes.push(node);
            }
        }
    }
    return nodes;
}

function getAdjacentNodes(grid, node) {
    const nodes = [];
    const {col, row} = node;
    for (const tempRow of grid) {
        for (const tempNode of tempRow) {
            const col1 = tempNode.col;
            const row1 = tempNode.row;
            const distance = Math.sqrt(Math.pow((row-row1), 2) + Math.pow((col-col1), 2));
            if (distance < 3) {
                nodes.push(tempNode);
            }
        }
    }
    return nodes;
}

function infect(grid, spreadability, deathrate) {
    const newGrid = _.cloneDeep(grid);
    const allNewlyInfectedNodes = getAllNewlyInfectedNodes(grid);
    const allStillContagiousNodes = getAllStillContagiousNodes(grid);

    for (const node of allNewlyInfectedNodes) {
        const {col, row} = node;
        const adjacentNodes = getAdjacentNodes(grid, node);
        for (const neighborNode of adjacentNodes) {
            const neighborCol = neighborNode.col;
            const neighborRow = neighborNode.row;
            const distance = Math.sqrt(Math.pow((row-neighborRow), 2) + Math.pow((col-neighborCol), 2));
            if (Math.random() <= Math.pow(spreadability, distance) && !neighborNode.newlyInfected && !neighborNode.stillContagious && !neighborNode.immune && !neighborNode.isVaccinated && !neighborNode.isDead) {
                const newNode = {
                    ...neighborNode,
                    justInfected : true
                }
                newGrid[neighborRow][neighborCol] = newNode;
            }
        }
    }
    for (const node of allStillContagiousNodes) {
        const {col, row} = node;
        const adjacentNodes = getAdjacentNodes(grid, node);
        for (const neighborNode of adjacentNodes) {
            const neighborCol = neighborNode.col;
            const neighborRow = neighborNode.row;
            const distance = Math.sqrt(Math.pow((row-neighborRow), 2) + Math.pow((col-neighborCol), 2));
            if (Math.random() <= Math.pow(spreadability, distance) && !neighborNode.newlyInfected && !neighborNode.stillContagious && !neighborNode.immune && !neighborNode.isVaccinated && !neighborNode.isDead) {
                const newNode = {
                    ...neighborNode,
                    justInfected : true
                }
                newGrid[neighborRow][neighborCol] = newNode;
            }
        }
    }
    for (const node of allNewlyInfectedNodes) {
        const {col, row} = node;
        const newNode = {
            ...node,
            justInfected : false,
            stillContagious : true
        }
        newGrid[row][col] = newNode;
    }
    for (const node of allStillContagiousNodes) {
        const {col, row} = node;
        if (Math.random() < deathrate) {
            const newNode = {
                ...node,
                stillContagious : false,
                isDead: true,
            }
            newGrid[row][col] = newNode;
        } 
        else {
            const newNode = {
                ...node,
                stillContagious : false,
                immune: true
            }
            newGrid[row][col] = newNode;
        }   
        
    }

    return newGrid;
}