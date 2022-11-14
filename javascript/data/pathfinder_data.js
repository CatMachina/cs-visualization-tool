const algorithmDescription = {
    bfs: {
        title: "Breadth First Search (BFS)",
        description: "Uses First In First Out (FIFO) method to process nodes. Adjacent neighbours are searched, whose neighbours are searched again, and so on.",
        shortest: true,
        weighted: false,
        algorithm: bfs
    }, 
    dfs: {
        title: "Depth First Search (DFS)",
        description: "Uses First In Last Out (FILO) method to process nodes. Picks a path, and then backtracks to other possibilities after a dead end.",
        shortest: false,
        weighted: false,
        algorithm: dfs
    },
    dijkstra: {
        title: "Dijkstra",
        description: "Uses priority method to process nodes. Priority is determined by cost of path so far. Similar to BFS.",
        shortest: true,
        weighted: true,
        algorithm: dijkstra
    },
    astar: {
        title: "A*",
        description: "Uses total path cost function method to process nodes. Cost is determined by cost of path so far plus estimated cost to destination. Similar to Djikstra.",
        shortest: true,
        weighted: true,
        algorithm: astar
    },
    bestfs: {
        title: "Best First Search",
        description: "Uses estimated cost function method to process nodes. Cost is determined by estimated cost to destination. Similar to A*.",
        shortest: false,
        weighted: true,
        algorithm: bestfs
    },
    bisearch: {
        title: "Bidirectional Search",
        description: "Uses First In First Out (FIFO) method to process nodes. Works by performing BFS on both source and target node.",
        shortest: true,
        weighted: false,
        algorithm: bisearch
    }
}

import PriorityQueue from "../data-structures/priority_queue.js";

const moves = [[0,1], [-1, 0], [1, 0], [0,-1]];

function dfs(sourceCoords, targetCoords)
{
    let stack = [sourceCoords];
    let totalQueue = [];
    let visited = {};
    let found = false;
    while(stack.length != 0) 
    {
        const coords = stack.slice(-1).pop();
        if(!visited[coords])
        {
            visited[coords] = true;
            totalQueue.push(coords);
        }
        if(arrayEqual(coords, targetCoords))
        {
            found = true;
            break;
        }
        found = false;
        for(let i = 0; i < moves.length; ++i)
        {
            const row = coords[0] + moves[i][0];
            const col = coords[1] + moves[i][1];
            const $next = $(`tr[row=${row}] > td[col=${col}]`);
            const nextCoords = [row, col];
            if($next.length && !($next.attr("class") && $next.attr("class").indexOf("wall") !== -1) && !visited[nextCoords])
            {
                stack.push(nextCoords);
                found = true;
                break;
            }
        }
        if(!found)
        {
            stack.pop();
        }
    }
    return { found, path: stack, totalQueue };
}

function bfs(sourceCoords, targetCoords)
{
    let queue = [sourceCoords];
    let totalQueue = [];
    let visited = {};
    let found = false;
    visited[sourceCoords] = 0;
    while(queue.length != 0)
    {
        const coords = queue.shift();
        totalQueue.push(coords);
        if(arrayEqual(coords, targetCoords))
        {
            found = true;
            break;
        }
        moves.forEach(move =>
        {
            const row = coords[0] + move[0];
            const col = coords[1] + move[1];
            const $next = $(`tr[row=${row}] > td[col=${col}]`);
            const nextCoords = [row, col];
            if($next.length && !($next.attr("class") && $next.attr("class").indexOf("wall") !== -1) && (visited[nextCoords] === undefined || visited[nextCoords] > visited[coords] + 1))
            {
                queue.push(nextCoords);
                visited[nextCoords] = visited[coords] + 1;
            }
        });
    }
    return { found, totalQueue, table: visited };
}

function dijkstra(sourceCoords, targetCoords)
{
    let queue = new PriorityQueue((a, b) => a.value <= b.value);
    let totalQueue = [];
    let visited = {};
    let found = false;
    visited[sourceCoords] = 0;
    queue.push({ coords: sourceCoords, value: 0 })
    while(!queue.empty())
    {
        let data = queue.pop();
        const coords = data.coords; 
        const value = data.value;
        totalQueue.push(coords);
        if(arrayEqual(coords, targetCoords))
        {
            found = true;
            break;
        }
        moves.forEach(move =>
        {
            const row = coords[0] + move[0];
            const col = coords[1] + move[1];
            const $next = $(`tr[row=${row}] > td[col=${col}]`);
            const weight = $next && $next.attr("weight") ? parseInt($next.attr("weight")) : 1;
            const nextCoords = [row, col];
            if($next.length && !($next.attr("class") && $next.attr("class").indexOf("wall") !== -1) && (visited[nextCoords] === undefined || visited[nextCoords] > visited[coords] + weight))
            {
                queue.push({ coords: nextCoords, value: value + weight });
                visited[nextCoords] = visited[coords] + weight;
            }
        });
    }
    return { found, totalQueue, table: visited };
}

function astar(sourceCoords, targetCoords)
{
    let queue = new PriorityQueue((a, b) => a.f < b.f || (a.f === b.f && manhattan(a.coords) < manhattan(b.coords)));
    let totalQueue = [];
    let visited = {};
    let found = false;
    visited[sourceCoords] = 0;
    queue.push({ coords: sourceCoords, g: 0, f: manhattan(sourceCoords)})
    while(!queue.empty())
    {
        let data = queue.pop();
        const coords = data.coords;
        const g = data.g;
        totalQueue.push(coords);
        if(arrayEqual(coords, targetCoords))
        {
            found = true;
            break;
        }
        moves.forEach(move =>
        {
            const row = coords[0] + move[0];
            const col = coords[1] + move[1];
            const $next = $(`tr[row=${row}] > td[col=${col}]`);
            const weight = $next && $next.attr("weight") ? parseInt($next.attr("weight")) : 1;
            const nextCoords = [row, col];
            if($next.length && !($next.attr("class") && $next.attr("class").indexOf("wall") !== -1) && (visited[nextCoords] === undefined || visited[nextCoords] > visited[coords] + weight))
            {
                queue.push({ coords: nextCoords, g: g + weight, f: g + weight + manhattan(nextCoords) });
                visited[nextCoords] = visited[coords] + weight;
            }
        });
    }
    function manhattan(arr1, arr2 = targetCoords) 
    {
        return Math.abs(arr1[0] - arr2[0]) + Math.abs(arr1[1] - arr2[1]);
    }
    return { found, totalQueue, table: visited };
}

function bestfs(sourceCoords, targetCoords)
{
    let queue = new PriorityQueue((a, b) => manhattan(a.coords) < manhattan(b.coords) || (manhattan(a.coords) === manhattan(b.coords) && a.g < b.g));
    let totalQueue = [];
    let visited = {};
    let found = false;
    visited[sourceCoords] = 0;
    queue.push({ coords: sourceCoords, g: 0})
    while(!queue.empty())
    {
        let data = queue.pop();
        const coords = data.coords;
        const g = data.g;
        totalQueue.push(coords);
        if(arrayEqual(coords, targetCoords))
        {
            found = true;
            break;
        }
        moves.forEach(move =>
        {
            const row = coords[0] + move[0];
            const col = coords[1] + move[1];
            const $next = $(`tr[row=${row}] > td[col=${col}]`);
            const weight = $next && $next.attr("weight") ? parseInt($next.attr("weight")) : 1;
            const nextCoords = [row, col];
            if($next.length && !($next.attr("class") && $next.attr("class").indexOf("wall") !== -1) && (visited[nextCoords] === undefined))
            {
                queue.push({ coords: nextCoords, g: g + weight});
                visited[nextCoords] = visited[coords] + weight;
            }
        });
    }
    function manhattan(arr1, arr2 = targetCoords) 
    {
        return Math.abs(arr1[0] - arr2[0]) + Math.abs(arr1[1] - arr2[1]);
    }
    return { found, totalQueue, table: visited };
}

function bisearch(sourceCoords, targetCoords)
{
    let queue = [{ coords: sourceCoords, fromSource: true }, { coords: targetCoords, fromSource: false }];
    let totalQueue = [];
    let visitedS = {};
    let visitedT = {};
    let found = false;
    visitedS[sourceCoords] = 0;
    visitedT[targetCoords] = 0;
    while(!found && queue.length != 0)
    {
        const data = queue.shift();
        const coords = data.coords;
        const fromSource = data.fromSource;
        totalQueue.push(coords);
        if(visitedS[coords] && visitedT[coords])
        {
            found = true;
            queue = [coords];
            break;
        }
        moves.forEach(move =>
        {
            if(found)
                return;
            const row = coords[0] + move[0];
            const col = coords[1] + move[1];
            const $next = $(`tr[row=${row}] > td[col=${col}]`);
            const nextCoords = [row, col];
            if($next.length && !($next.attr("class") && $next.attr("class").indexOf("wall") !== -1))
            {
                if(fromSource && (visitedS[nextCoords] === undefined || visitedS[nextCoords] > visitedS[coords] + 1))
                {
                    visitedS[nextCoords] = visitedS[coords] + 1;
                    queue.push({ coords: nextCoords, fromSource: true});
                }
                else if(!fromSource && (visitedT[nextCoords] === undefined || visitedT[nextCoords] > visitedT[coords] + 1))
                {
                    visitedT[nextCoords] = visitedT[coords] + 1;
                    queue.push({ coords: nextCoords, fromSource: false});
                }
            }
        });
    }
    while(queue.length != 0)
    {
        const coords = queue.shift();
        if(arrayEqual(coords, targetCoords))
        {
            break;
        }
        moves.forEach(move =>
        {
            const row = coords[0] + move[0];
            const col = coords[1] + move[1];
            const $next = $(`tr[row=${row}] > td[col=${col}]`);
            const nextCoords = [row, col];
            if($next.length && !($next.attr("class") && $next.attr("class").indexOf("wall") !== -1) && visitedT[nextCoords] !== undefined && (visitedS[nextCoords] === undefined || visitedS[nextCoords] > visitedS[coords] + 1))
            {
                queue.push(nextCoords);
                visitedS[nextCoords] = visitedS[coords] + 1;
            }
        });
    }
    return { found, totalQueue, table: visitedS };
}

function arrayEqual(arr1, arr2){
    if(arr1 === arr2)
        return true;
    if(arr1 === null || arr2 === null)
        return false;
    if(arr1.length !== arr2.length)
        return false;
    for(let i = 0; i < arr1.length; ++i)
    {
        if(arr1[i] !== arr2[i])
            return false;
    }    
    return true;
}

export default algorithmDescription;