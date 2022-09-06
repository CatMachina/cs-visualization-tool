const algorithmDescription = {
    bfs: {
        title: "Breadth First Search (BFS)",
        description: "Uses a FIFO container in order to process inbound nodes. Uses isited array rather than a step array (see SPFA for weighted version).",
        shortest: true,
        weighted: false
    }, 
    dfs: {
        title: "Depth First Search (DFS)",
        description: "Uses a FILO container in order to process inbound nodes. Keeps track of visited nodes with a boolean visited array",
        shortest: false,
        weighted: false
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

export default algorithmDescription;