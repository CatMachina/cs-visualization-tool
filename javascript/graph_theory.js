import algorithmDescription from "./data/graph_theory_data.js";

let rows = 1;
let cols = 1;
let selectedAlgorithm = "";
$(document).ready(function() 
{
    makeGrid($("tbody"));

    const algoDescBlock = $("#algorithm-description"); 
    $("#selection-menu p").click(function() {
        selectedAlgorithm = $(this).attr("algo");
        const data = algorithmDescription[selectedAlgorithm];
        algoDescBlock.children("h1").text(data.title);
        algoDescBlock.children("p").text(data.description);

    });
});

function makeGrid(container) 
{
    // Javascript object for changing css variables
    const r = document.querySelector(":root");
    // Other initializations
    const defaultGridCellSize = getComputedStyle(r).getPropertyValue("--default-gridItem-size");
    rows = Math.floor(container.height() / defaultGridCellSize);
    cols = Math.floor(container.width() / defaultGridCellSize);
    for(let i = 0; i < rows; ++i)
    {
        const row = $("<tr></tr>").attr("row", i);
        for(let j = 0; j < cols; ++j)
        {
            row.append($("<td/>").attr("col", j));
        }
        container.append(row);
    }
}