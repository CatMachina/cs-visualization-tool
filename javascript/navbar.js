$(document).ready(function() {
    $.get("../navbar.html", function (data) {
        $("#navbar-location").html(data);

        $("#visualization-tool-home, #home-navbar-button").click(function() {
            const urlBreadcrumbs = window.location.href.split("/");
            urlBreadcrumbs.pop();
            window.location.href = urlBreadcrumbs.join("/");
        });
    });
});