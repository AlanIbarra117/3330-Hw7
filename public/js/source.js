$(function () {
    // jQuery UI buttons
    $("button").button();

    // Dashboard tabs
    $("#dashboardTabs").tabs();

    // Date picker
    $("#customerDate").datepicker();

    // Accordion
    $("#accordion").accordion({
        collapsible: true,
        heightStyle: "content"
    });

    // Customer dialog
    $("#customerDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 450,
        buttons: {
            "Create Customer": function () {
                const name = $("#customerName").val();
                const email = $("#customerEmail").val();

                if (!name || !email) {
                    alert("Please enter a name and email.");
                    return;
                }

                alert("Customer created: " + name);
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });

    // Open customer dialog
    $("#newCustomerButton").on("click", function () {
        $("#customerDialog").dialog("open");
    });
});
