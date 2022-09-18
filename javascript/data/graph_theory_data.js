const algorithmDescription = {
    bfs: {
        title: "Breadth First Search (BFS)",
        description: "Uses a FIFO container in order to process inbound nodes. Uses isited array rather than a step array (see SPFA for weighted version).",
        shortest: true,
        weighted: false,
        algorithm: bfs
    }, 
    dfs: {
        title: "Depth First Search (DFS)",
        description: "Uses a FILO container in order to process inbound nodes. Keeps track of visited nodes with a boolean visited array",
        shortest: false,
        weighted: false,
        algorithm: dfs
    },
    dijkstra: {
        title: "Dijkstra",
        description: "Uses a priority FIFO container to process inbound nodes. Weight is kept track of with the lowest (or highest) weight taking priority to be processed.",
        shortest: true,
        weighted: true
    },
    spfa: {
        title: "Shortest Path Faster Algoritm (SPFA)",
        description: "Uses a FIFO container in order to process inbound nodes. Upgraded version of BFS, a step (integer) array is used to keep track of visited nodes while also keeping track of which nodes are in the FIFO container.",
        shortest: true,
        weighted: true
    }
}

const moves = [[0,1], [-1, 0], [1, 0], [0,-1]];

function bfs(sourceCoords, targetCoords) 
{
    let queue = [sourceCoords];
    let totalQueue = [];
    let visited = {};
    visited[sourceCoords] = 1;
    while(queue.length != 0)
    {
        const coords = queue.shift();
        totalQueue.push(coords)
        if(arrayEqual(coords, targetCoords))
            break;
        moves.forEach(move =>
        {
            const row = coords[0] + move[0];
            const col = coords[1] + move[1];
            const next = $(`tr[row=${row}] > td[col=${col}]`);
            const nextCoords = [row, col]
            if(next.length && next.attr("class").indexOf("wall") == -1 && (!visited[nextCoords] || visited[nextCoords] > visited[coords] + 1))
            {
                queue.push(nextCoords);
                visited[nextCoords] = visited[coords] + 1;
            }
        });
    }
    return { totalQueue, table: visited };
}

function dfs(sourceCoords, targetCoords)
{
    let stack = [sourceCoords];
    let totalQueue = [];
    let visited = {};
    while(stack.length != 0) 
    {
        const coords = stack.slice(-1).pop();
        if(!visited[coords])
        {
            visited[coords] = true;
            totalQueue.push(coords);
        }
        if(arrayEqual(coords, targetCoords))
            break;
        let found = false;
        for(let i = 0; i < moves.length; ++i)
        {
            const row = coords[0] + moves[i][0];
            const col = coords[1] + moves[i][1];
            const next = $(`tr[row=${row}] > td[col=${col}]`);
            const nextCoords = [row, col];
            if(next.length && next.attr("class").indexOf("wall") == -1 && !visited[nextCoords])
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
    return { path: stack, totalQueue };
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