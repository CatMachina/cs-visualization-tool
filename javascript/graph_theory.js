import algorithmDescription from "./data/graph_theory_data.js";

let rows = 1;
let cols = 1;
let selectedAlgorithm = "";
let creatingWalls = false;
let coordinates = {};
let draggedElement = null;
let animationRunning = false;

$(document).ready(function() 
{
    makeGrid($("tbody"));
    $("table, table *").attr("draggable", false);
    $("#source-node, #target-node").attr("draggable", true);
    const algoDescBlock = $("#algorithm-description"); 
    $("#selection-menu p").click(function() 
    {
        algoDescBlock.children("button").off();
        selectedAlgorithm = $(this).attr("algo");
        const data = algorithmDescription[selectedAlgorithm];
        algoDescBlock.children("h1").text(data.title);
        algoDescBlock.children("p").text(data.description);
        algoDescBlock.children("button").click(function() 
        {
            $("td").addClass("animating");
            let {path, totalQueue, table} = data.algorithm(coordinates.source, coordinates.target);
            animationRunning = true;
            if(!path)
            {
                path = getPath(table, coordinates.target, coordinates.source);
            }
            animateAlgorithm(totalQueue, animatePath.bind(null, path));
        });
    });
    $("#reset").click(function() 
    {
        $("td").removeClass();
        animationRunning = false;
    });

    $("td").mousedown(function() 
    {
        if(!checkCell($(this))) {
            creatingWalls = true;
            makeWall($(this));
        }
    })
    .mouseover(function ()
    {
        if(creatingWalls)
        {
            makeWall($(this));
        }
    })
    .mouseup(function() 
    {
        creatingWalls = false;
    })
    .on("dragstart", function() 
    {
        if(checkCell($(this)))
        {
            $(this).removeClass("unselectable");
            draggedElement = $(this).attr("id");
        }
    })
    .on("dragend", function()
    {
        if(draggedElement !== null)
        {
            $(this).attr("id", draggedElement)
            .attr("draggable", true)
            .html(`<img src=assets/${draggedElement.split("-")[0]}-icon.svg />`);
        }
    })
    .on("dragenter", function(event) 
    {
        if(cannotDrop($(this)))
            return;
        event.preventDefault();
        if(!checkCell($(this)))
        {
            const src = draggedElement.split("-")[0];
            $(this).html(`<img src=assets/${src}-icon.svg />`);
        }
        $(this).addClass("shrinkAnimation");
        $(this).attr("id", draggedElement).attr("draggable", true);
    })
    .on("dragover", function(event) 
    {
        // console.log("dragover")
        if(cannotDrop($(this)))
            return;
        event.preventDefault();
    })
    .on("dragleave", function()
    {   
        if(cannotDrop($(this))) 
            return;
        $(this).removeAttr("id").attr("draggable", false).removeClass("shrinkAnimation").empty();
    })
    .on("drop", function()
    {
        if(cannotDrop($(this)))
            return;
        $(this).removeClass().addClass("unselectable");
        coordinates[draggedElement.split("-")[0]] = [parseInt($(this).parent().attr("row")), parseInt($(this).attr("col"))];
        draggedElement = null;
    });
});

function getPath(table)
{
    let stack = [coordinates.target];
    const moves = [[0,-1], [-1, 0], [0,1], [1, 0]];
    while(stack.length != 0)
    {
        const coords = stack[0];
        if(coords[0] === coordinates.source[0] && coords[1] == coordinates.source[1])
            break;
        for(let i = 0; i < moves.length; ++i)
        {
            const row = coords[0] + moves[i][0];
            const col = coords[1] + moves[i][1];
            const next = $(`tr[row=${row}] > td[col=${col}]`);
            const nextCoords = [row, col]
            const weight = next.length && next.attr("weight") !== undefined ? parseInt(next.attr("weight")) : 1; 
            if(next.length != 0 && table[nextCoords] === table[coords] - weight)
            {
                stack.unshift(nextCoords);
                break;
            }
        }
    }
    return stack;
}

function animateAlgorithm(totalQueue, pathAnimationCallback) 
{
    if(!animationRunning)
    {
        cancelAnimation();
        return;
    }
    if(totalQueue.length === 0)
    {
        pathAnimationCallback();
        return;
    }
    const coords = totalQueue.shift();
    $(`tr[row=${coords[0]}] > td[col=${coords[1]}]`).addClass("visited");
    setTimeout(animateAlgorithm.bind(this, totalQueue, pathAnimationCallback), 50);
}

function animatePath(path) 
{
    if(!animationRunning)
    {
        cancelAnimation();
        return;
    }
    if(path.length === 0)
    {
        cancelAnimation();
        return;
    }
    const coords = path.shift();
    // console.log(coords);
    $(`tr[row=${coords[0]}] > td[col=${coords[1]}]`).removeClass("visited").addClass("path");
    setTimeout(animatePath.bind(this, path), 50);
}

function cancelAnimation() 
{
    $("td").removeClass("animating");
}

function cannotDrop(element) 
{
    return element.attr("class") == "wall" || (checkCell(element) && element.attr("id") != draggedElement);
}

function checkCell(element) 
{
    return element.attr("id") === "source-node" || element.attr("id") === "target-node";
}

function makeWall(element)
{
    if(checkCell(element))
        return
    if(element.attr("class") === "wall")
    {
        element.removeClass("wall");
    }
    else
    {
        element.addClass("wall");
    }
}

function makeGrid(container) 
{
    // Javascript object for changing css variables
    const r = document.querySelector(":root");
    // Other initializations
    const defaultGridCellSize = getComputedStyle(r).getPropertyValue("--default-gridItem-size");
    rows = Math.floor(container.height() / defaultGridCellSize);
    cols = Math.floor(container.width() / defaultGridCellSize);
    coordinates.source = [Math.floor(rows / 2) - 1, Math.floor(cols / 4)];
    coordinates.target = [Math.floor(rows / 2) - 1, Math.floor(3 * cols / 4)];
    for(let i = 0; i < rows; ++i)
    {
        const row = $("<tr></tr>").attr("row", i);
        for(let j = 0; j < cols; ++j)
        {
            const element = $("<td></td>").attr("col", j);
            if(i === coordinates.source[0] && j === coordinates.source[1])
            {
                element.html("<img src='assets/source-icon.svg' />").attr("id", "source-node").addClass("unselectable");
            }
            else if(i === coordinates.target[0] && j === coordinates.target[1])
            {
                element.html("<img src='assets/target-icon.svg' />").attr("id", "target-node").addClass("unselectable");
            }
            row.append(element);
        }
        container.append(row);
    }
}