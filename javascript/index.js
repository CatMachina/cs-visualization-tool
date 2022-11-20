$(document).ready(function() {
    // Little scuffed but will do for now
    const urlBreadcrumbs = window.location.href.split("/");
    if(urlBreadcrumbs[urlBreadcrumbs.length - 1] === "index")
    {
        urlBreadcrumbs.pop();
        window.location.href = urlBreadcrumbs.join("/");
    }
    $(".toolFeatureBox").click(function() {
        const fileName = $(this).attr("id").split("-")[0];
        if(fileName !== "sorting")
            window.location.href += fileName;
    });
});