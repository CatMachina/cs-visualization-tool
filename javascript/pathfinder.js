import algorithmDescription from "./data/pathfinder_data.js";

let rows = 1;
let cols = 1;
let selectedAlgorithm = "";
let creatingCells = false;
let currentCell = "wall";
let coordinates = {};
let draggedElement = null;
let animationRunning = false;
let animationSpeed = 50;
let helpModalStep = 1;
let helpModalStyles;
let helpModalTarget;

$(document).ready(function() 
{
    makeGrid($("tbody"));
    loadSelectionMenu();
    $("#help").click(function() 
    {
        helpModalStep = 1;
        $(".modalBody").removeClass("selected").addClass("notSelected");
        $("#help-step-1").removeClass("notSelected").addClass("selected");
        $("#help-modal-previous-button > p").text("Skip Tutorial");
        $("#help-modal-next-button > p").text("Next");
        $(".modalContent").removeAttr("style");
        $("#help-modal").addClass("showModal");
    });
    $(".closeButton").click(closeHelpModal);
    $(window).click(function(event) 
    {
        if(event.target.id === "help-modal") {
            closeHelpModal();
        }
    })
    $("#help-modal-next-button").click(helpModalNextButton);
    $("#help-modal-previous-button").click(helpModalPreviousButton);
    $("#selectables").append(generateSelectables());
    $("#selectables > img").click(function() 
    {
        selectGridPlacementElement($(this))
    });
    $("#animation-speed").on("input", function(event) 
    {
        const value = event.target.value;
        animationSpeed = value;
        $("#range-value").text(value + "ms");
    })
    $("#reset-path").click(function() 
    {
        $("td").removeClass("visited").removeClass("path");
        animationRunning = false;
    });
    $("#reset-walls").click(function() 
    {
        $("td").removeClass("wall");
    });
    $("#reset-weights").click(function() 
    {
        $("td[weight]").removeAttr("weight").removeClass().empty();
    });
    $("#reset-all").click(function() 
    {
        $("tbody").empty();
        makeGrid($("tbody"));
        animationRunning = false;
    });
});

$(window).on("load", function() {
    const $selectionMenu = $("#selection-menu");
    const $algorithmDescriptionBlock = $("#algorithm-description");
    const $table = $("table");
    const $selectables = $("#selectables");
    const $animationSpeedContainer = $("#animation-speed-container");
    const $resetButtonWrapper = $("#reset-button-wrapper");
    helpModalTarget = {
        2: $selectionMenu,
        3: $algorithmDescriptionBlock,
        4: $table,
        5: $selectables,
        6: $animationSpeedContainer,
        7: $resetButtonWrapper
    }
    helpModalStyles = {
        1: {
            "top": "50%",
            "left": "50%"
        },
        2: {
            "top": $selectionMenu.offset().top + $selectionMenu.height(),
            "left": $selectionMenu.offset().left,
        },
        3: {
            "top": $algorithmDescriptionBlock.offset().top + $algorithmDescriptionBlock.height(),
            "left": $algorithmDescriptionBlock.offset().left + $algorithmDescriptionBlock.width() / 2
        },
        4: {
            "top": $table.offset().top,
            "left": $table.offset().left + $table.width() / 2
        },
        5: {
            "top": $selectables.offset().top + $selectables.height(),
            "left": Math.max(0, $selectables.offset().left + $selectables.width() / 2 - 350)
        },
        6: {
            "top": $animationSpeedContainer.offset().top + $animationSpeedContainer.height(),
            "left": $animationSpeedContainer.offset().left + $animationSpeedContainer.width() / 2
        },
        7: {
            "top": $resetButtonWrapper.offset().top + $resetButtonWrapper.height(),
            "left": Math.min($(window).outerWidth() - 600, $resetButtonWrapper.offset().left + $resetButtonWrapper.width() / 2 - 300),
        },
        8: {
            "top": "50%",
            "left": "50%"
        }
    }
});

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
    setTimeout(animateAlgorithm.bind(this, totalQueue, pathAnimationCallback), animationSpeed);
}

function animatePath(path, found) 
{
    if(!animationRunning)
    {
        if(!found)
            displayPathNotFound();
        cancelAnimation();
        return;
    }
    if(path.length === 0)
    {
        if(!found)
            displayPathNotFound();
        cancelAnimation();
        return;
    }
    const coords = path.shift();
    $(`tr[row=${coords[0]}] > td[col=${coords[1]}]`).removeClass("visited").addClass("path");
    setTimeout(animatePath.bind(this, path, found), animationSpeed);
}

function cancelAnimation() 
{
    $("td").removeClass("animating");
    animationRunning = false;
}

function cannotDrop($element) 
{
    return $element.attr("class") == "wall" || (checkCell($element) && $element.attr("id") != draggedElement);
}

function checkCell($element) 
{
    return animationRunning || $element.attr("id") === "source-node" || $element.attr("id") === "target-node";
}

function closeHelpModal() 
{
    $("#help-modal").removeClass("showModal");
    $("*").removeClass("helpModalTarget");
}

function displayPathNotFound()
{
    $("#path-not-found-modal").addClass("showModal");
    $("#path-not-found-modal h1").addClass("shakingAnimation").on("animationend", () => {$(this).removeClass("shakingAnimation")});
    setTimeout(() => {$("#path-not-found-modal").removeClass("showModal")}, 2000);
}

function generateSelectables()
{
    let htmlString = "<img id='wall' class='selected' src='./assets/wall-icon.svg' />";
    for(let i = 0; i <= 9; ++i)
    {
        htmlString += `<img id=${i} src='./assets/${i}-icon.svg'/>`;
    }
    htmlString += "<img id='eraser' src='./assets/eraser-icon.svg' />";
    return htmlString;
}

function getPath(table, totalQueue)
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
            const $next = $(`tr[row=${row}] > td[col=${col}]`);
            const $curr = $(`tr[row=${coords[0]}] > td[col=${coords[1]}]`);
            const nextCoords = [row, col];
            const weight = $curr.attr("weight") !== undefined ? parseInt($curr.attr("weight")) : 1;
            if($next.length && checkValid(nextCoords) && table[nextCoords] === table[coords] - weight)
            {
                stack.unshift(nextCoords);
                break;
            }
        }
    }
    function checkValid(coords)
    {
        let valid = false;
        for(let i = 0; i < totalQueue.length; ++i)
        {
            if(totalQueue[i][0] === coords[0] && totalQueue[i][1] === coords[1])
            {
                valid = true;
                break;
            }
        }
        return valid;
    }
    return stack;
}

function helpModalNextButton()
{
    if(helpModalStep === 1)
        $("#help-modal-previous-button > p").text("Previous");
    else if(helpModalStep === 7)
        $("#help-modal-next-button > p").text("Finish!");
    else if(helpModalStep === 8)
    {
        closeHelpModal();
        return;
    }
    if(helpModalTarget[helpModalStep]?.length)
        helpModalTarget[helpModalStep].removeClass("helpModalTarget");
    $(`#help-step-${helpModalStep}`).addClass("notSelected").removeClass("selected");
    helpModalStep += 1;
    $(`#help-step-${helpModalStep}`).removeClass("notSelected").addClass("selected");
    $("#help-modal > .modalContent").css(helpModalStyles[helpModalStep]);
    if(helpModalTarget[helpModalStep]?.length)
        helpModalTarget[helpModalStep].addClass("helpModalTarget");
}

function helpModalPreviousButton(){
    if(helpModalStep === 1)
    {
        closeHelpModal();
        return;
    }
    if(helpModalStep === 2)
        $("#help-modal-previous-button > p").text("Skip Tutorial");
    else if(helpModalStep === 8)
        $("#help-modal-next-button > p").text("Next");
    if(helpModalTarget[helpModalStep]?.length)
        helpModalTarget[helpModalStep].removeClass("helpModalTarget");
    $(`#help-step-${helpModalStep}`).addClass("notSelected").removeClass("selected");
    helpModalStep -= 1;
    $(`#help-step-${helpModalStep}`).removeClass("notSelected").addClass("selected");
    $("#help-modal > .modalContent").css(helpModalStyles[helpModalStep]);
    if(helpModalTarget[helpModalStep]?.length)
        helpModalTarget[helpModalStep].addClass("helpModalTarget");
}

function loadSelectionMenu()
{
    let menuElementHTMLString = "";
    Object.keys(algorithmDescription).forEach(key => {
        menuElementHTMLString += `<button algo=${key}><p>${algorithmDescription[key].title}</p></button>`;
    });
    $("#selection-menu").html(menuElementHTMLString);

    const animationSpeed = 300;
    const $algorithmSelectionAnimation = $("#algorithm-description.noSelection > div");
    animateSelectionPointer();
    function animateSelectionPointer(depth = 0) 
    {
        if(depth % 8 === 0)
            $algorithmSelectionAnimation.children('img:not(#start-chevron)').remove();
        else
            $algorithmSelectionAnimation.append("<img class='unselectable' src='./assets/white-chevron-left-icon.svg' draggable='false'/>");
        setTimeout(animateSelectionPointer.bind(null, (depth + 1) % 8), animationSpeed);
    }

    $("#selection-menu button").click(selectionMenuButtonClick);
}

function makeElement($element)
{
    if(checkCell($element) || $element.attr("class") === "path" || $element.attr("class") === "visited")
        return
    if(currentCell === "wall")
    {
        if($element.attr("class") === "wall")
            $element.removeClass();
        else
            $element.removeAttr("weight").removeClass().addClass("wall").empty();
    }
    else if (currentCell === "eraser")
        $element.removeClass().removeAttr("weight").empty();
    else
    {
        if($element.attr("weight") == currentCell)
            $element.removeAttr("weight").empty();
        else 
            $element.removeClass().html(`<img src="./assets/${currentCell}-icon.svg" />`).attr("weight", parseInt(currentCell)).addClass("unselectable");
    }
}

function makeGrid($container) 
{
    // Javascript object for changing css variables
    const r = document.querySelector(":root");
    // Other initializations
    const defaultGridCellSize = getComputedStyle(r).getPropertyValue("--default-gridItem-size");
    rows = Math.floor($container.height() / defaultGridCellSize);
    cols = Math.floor($container.width() / defaultGridCellSize);
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
        $container.append(row);
    }
    $("table, table *").attr("draggable", false);
    $("#source-node, #target-node").attr("draggable", true);
    $("td").mousedown(function() 
    {
        if(!checkCell($(this))) {
            creatingCells = true;
            makeElement($(this));
        }
    })
    .mouseover(function ()
    {
        if(creatingCells)
        {
            makeElement($(this));
        }
    })
    .mouseup(function() 
    {
        creatingCells = false;
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
}

function selectGridPlacementElement($element) 
{
    $element.siblings().removeClass("selected");
    currentCell = $element.attr("id");
    $element.addClass("selected");
}

function selectionMenuButtonClick()
{
    $("#menu .errorMessage").addClass("hidden");
    const $algorithmDescription = $("#algorithm-description");
    $algorithmDescription.removeClass("noSelection");
    $("#selection-menu button").removeClass("selected");
    $(this).addClass("selected");
    selectedAlgorithm = $(this).attr("algo");
    const data = algorithmDescription[selectedAlgorithm];
    const weightedMessage = ` This algorithm is <b>${data["weighted"] ? "weighted" : "unweighted"}</b> and `;
    const shortestMessage = `<b>${data["shortest"] ? "guarantees" : "does not guarantee"}</b> the shortest path.`
    $algorithmDescription.html(`
        <h1>${data.title}</h1>
        <p>${data.description + weightedMessage + shortestMessage}</p>
        <button id="visualize" class="buttonPrimary"><p>Visualize</p></button>
    `);
    $("#visualize").click(function() 
    {
        $("reset-walls").attr("disabled", true);
        $("reset-weights").attr("disabled", true);
        if(!data.weighted && $("td[weight]").length)
        {
            $("#menu .errorMessage").removeClass("hidden");
            $(this).addClass("shakingAnimation").on("animationend", () => { $(this).removeClass("shakingAnimation")});
            return;
        }
        $("td").removeClass("visited").removeClass("path");
        let {path, totalQueue, table, found} = data.algorithm(coordinates.source, coordinates.target);
        $("td").addClass("animating");
        animationRunning = true;
        if(!path && found)
        {
            path = getPath(table, totalQueue);
        }
        animateAlgorithm(totalQueue, animatePath.bind(null, path ? path : [], found));
    });
}
