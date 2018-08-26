function Column(id, name) {
  var self = this;

  this.id = id;
  this.name = name || "No name given";
  this.element = createColumn();

  function createColumn() {
    // TWORZENIE NOWYCH WĘZŁÓW
    var column = $(
      '<div id = "' +
        id +
        '" class="column ' +
        self.name
          .toLowerCase()
          .trim()
          .replace(" ", "") +
        '"></div>'
    );
    var columnTitle = $('<h2 class="column-title">' + self.name + "</h2>");
    var columnButtons = $('<div class ="column-buttons"</div>');
    var columnCardList = $('<ul class="card-list column-card-list"></ul>');
    var columnDelete = $('<button class="btn-delete">x</button>');
    var columnAddCard = $(
      '<button class="column add-card">+ Add a card</button>'
    );

    //MOJA FUNCKJA MODYFIKACJI KOLUMNY

    columnTitle.click(function() {
      self.renameColumn();
    });

    // PODPINANIE ODPOWIEDNICH ZDARZEŃ POD WĘZŁY
    columnDelete.click(function() {
      self.deleteColumn();
    });

    columnAddCard.click(function(event) {
      var cardName = prompt("Enter the name of the card");
      event.preventDefault();
      $.ajax({
        url: baseUrl + "/card",
        method: "POST",
        data: {
          name: cardName,
          bootcamp_kanban_column_id: self.id
        },
        success: function(response) {
          var card = new Card(response.id, cardName);
          self.createCard(card);
        }
      });
    });

    // KONSTRUOWANIE ELEMENTU KOLUMNY

    columnButtons.append(columnAddCard).append(columnDelete);
    columnTitle.append(columnRename());

    column
      .append(columnTitle)
      .append(columnButtons)
      .append(columnCardList);
    return column;
  }
}
Column.prototype = {
  createCard: function(card) {
    this.element.children("ul").append(card.element);
  },

  deleteColumn: function() {
    var self = this;
    //alert(this.id);
    $.ajax({
      url: baseUrl + "/column/" + self.id,
      method: "DELETE",
      success: function(response) {
        self.element.remove();
      }
    });
  },

  //MOJA FUNKCJA MODYFIKACJI KOLUMNY
  renameColumn: function() {
    var self = this;
    //alert(this.id);
    var cardName = prompt("Enter new name of the card");
    $.ajax({
      url: baseUrl + "/column/" + self.id,
      method: "PUT",
      data: {
        name: cardName
      },
      success: function(response) {
        var oldClass = self.name
          .toLowerCase()
          .trim()
          .replace(" ", "");
        self.name = cardName;
        var newClass = self.name
          .toLowerCase()
          .trim()
          .replace(" ", "");
        self.element
          .children(".column-title")
          .html(cardName)
          .append(columnRename());
        self.element.removeClass(oldClass).addClass(newClass);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert(
          "An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!"
        );

        $("#result").html(
          "<p>status code: " +
            jqXHR.status +
            "</p><p>errorThrown: " +
            errorThrown +
            "</p><p>jqXHR.responseText:</p><div>" +
            jqXHR.responseText +
            "</div>"
        );
        console.log("jqXHR:");
        console.log(jqXHR);
        console.log("textStatus:");
        console.log(textStatus);
        console.log("errorThrown:");
        console.log(errorThrown);
      }
    });
  }
};

function columnRename() {
  var columnRename = $('<span class="tooltiptext"> rename Me</span>');
  return columnRename;
}
