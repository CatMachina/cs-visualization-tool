import algorithmDescription from "./data/graph_theory_data.js";

let rows = 1;
let cols = 1;
let selectedAlgorithm = "";
let creatingWalls = false;
let sourceCoordinates = [0, 0];
let targetCoordinates = [0, 0];
let draggedElement = null

$(document).ready(function() 
{
    makeGrid($("tbody"));
    $("table, table *").attr("draggable", false);
    $("#source-node, #target-node").attr("draggable", true);
    const algoDescBlock = $("#algorithm-description"); 
    $("#selection-menu p").click(function() 
    {
        selectedAlgorithm = $(this).attr("algo");
        const data = algorithmDescription[selectedAlgorithm];
        algoDescBlock.children("h1").text(data.title);
        algoDescBlock.children("p").text(data.description);
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
        $(this).removeClass("unselectable");
        if(!checkCell($(this)))
            return false;
        draggedElement = $(this).attr("id");
    })
    .on("dragenter", function(event) 
    {
        console.log("enter")
        event.preventDefault();
        if(!checkCell($(this)))
        {
            const src = draggedElement.split("-")[0];
            $(this).html(`<img src=assets/${src}-icon.svg />`);
        }
        $(this).addClass("shrinkAnimation");
        $(this).attr("id", draggedElement).attr("draggable", true);
    })
    .on("dragover", function(event) {
        event.preventDefault();
    })
    .on("dragleave", function()
    {   
        $(this).removeAttr("id").attr("draggable", false).removeClass("shrinkAnimation").empty();
    })
    .on("drop", function()
    {
        $(this).removeClass().addClass("unselectable");
        draggedElement = null;
    });
});

function checkCell(element) {
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
    sourceCoordinates = [Math.floor(rows / 2) - 1, Math.floor(cols / 4)];
    targetCoordinates = [Math.floor(rows / 2) - 1, Math.floor(3 * cols / 4)];
    for(let i = 0; i < rows; ++i)
    {
        const row = $("<tr></tr>").attr("row", i);
        for(let j = 0; j < cols; ++j)
        {
            const element = $("<td></td>").attr("col", j);
            if(i == sourceCoordinates[0] && j == sourceCoordinates[1])
            {
                element.html("<img src='assets/source-icon.svg' />").attr("id", "source-node").addClass("unselectable");
            }
            else if(i == targetCoordinates[0] && j == targetCoordinates[1])
            {
                element.html("<img src='assets/target-icon.svg' />").attr("id", "target-node").addClass("unselectable");
            }
            row.append(element);
        }
        container.append(row);
    }
}