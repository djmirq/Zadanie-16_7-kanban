var board = {
  name: "Tablica Kanban",
  createColumn: function(column) {
    this.element.append(column.element);
    initSortable();
  },
  element: $("#board .column-container")
};

$(".create-column").click(function() {
  var columnName = prompt("Enter a column name");
  $.ajax({
    url: baseUrl + "/column",
    method: "POST",
    data: {
      name: columnName
    },
    success: function(response) {
      var column = new Column(response.id, columnName);
      board.createColumn(column);
    }
  });
});

function initSortable(event, ui) {
  $(".card-list")
    .sortable({
      group: "card-list",
      revert: true,
      connectWith: ".card-list",
      placeholder: "card-placeholder",
      pullPlaceholder: false,
      cursor: "pointer",
      helper: "clone",
      update: function() {
        var self = this;
        // alert(
        //   $(self)
        //     .parents()
        //     .attr("id")
        // );
      },
      receive: function(ev, ui) {
        var self = this;
        var cardId = $(ui.item).attr("id");
        var colId = $(self)
          .parents()
          .attr("id");
        // alert(cardId);
        // alert(colId);
        var d = $(cardId).text();

        $.ajax({
          url: baseUrl + "/card/" + cardId,
          method: "PUT",
          data: {
            name: $(ui.item)
              .children(".card-description")
              .text(),
            bootcamp_kanban_column_id: colId
          },
          success: function(response) {
            //alert("OK");
          }
        });
      }
    })
    .disableSelection();
}
