$(document).ready(function() 
{
    makeGrid($("tbody"));
});

function makeGrid(container) 
{
    // Javascript object for changing css variables
    const r = document.querySelector(":root");
    // Other initializations
    const defaultGridCellSize = getComputedStyle(r).getPropertyValue("--default-gridItem-size");
    const rows = Math.floor(container.height() / defaultGridCellSize);
    const cols = Math.floor(container.width() / defaultGridCellSize);
    console.log(rows);
    console.log(cols);
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