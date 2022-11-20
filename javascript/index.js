$(document).ready(function() {
    $(".toolFeatureBox").click(function() {
        const fileName = $(this).attr("id").split("-")[0];
        if(fileName !== "sorting")
            window.location.href += fileName;
    });
});