const socket = io();
let index = 0;

const render = function(outputElement, dataList) {
  dataList.forEach(e => {
    $(outputElement).append(`
            <div id='item-${e.task}' class="toDoItem">
            <input class="finishedBtn" type="checkbox">
            <span>${e.task}</span>
            <a href="#"><span id='deleteBtn-${
              e.task
            }' class="finish far fa-circle fa-lg" value='${e.task}'></span></a>
            </div>`);
    index++;
  });
};

$("#submit-form").on("submit", function(event) {
  event.preventDefault();
  //display in front-end make an array of 1 element
  const newInput = {
    task: $("#newInput")
      .val()
      .trim(),
    done: false
  };
  const newInputList = [newInput];
  console.log(newInput);
  //post data to server
  $.ajax({ url: "/api/todolist", method: "POST", data: newInput }).then(
    function(data) {
      if (data.success === true) {
        render("#content", newInputList);
        $("#newInput").val("");
        index++;
      } else {
        alert("Enter a unique input");
      }
    }
  );
  //send to all sockets
  socket.emit("add-todo", newInput);
});

$(document).ready(function() {
  $(document).on("click", ".finish", function(event) {
    event.preventDefault();
    const deleteId = $(this).attr("value");
    console.log(deleteId);
    $(this).toggleClass('fa-circle').toggleClass('fa-times-circle');
    $(`#item-${deleteId}`).toggleClass('opacity');
  });
});

$(document).ready(function() {
  $(document).on("click", ".delete", function(event) {
    // event.preventDefault();
    //extract number from value property of clicked button
    const deleteId = $(this).attr("value");
    $(`#item-${deleteId}`).remove();
    $.ajax({ url: `/api/todolist/${deleteId}`, method: "DELETE" });
    $("#content").html("");
    $.ajax({ url: "/api/todolist", method: "GET" }).then(function(data) {
      render("#content", data);
    });
  });
});

const getTodoList = function(){
  $.ajax({ url: "/api/todolist", method: "GET" }).then(function(data) {
    render("#content", data);
  });
};

socket.on("emit-add", function(data) {
  const dataList = [data];
  render("#content", dataList);
});

socket.on("emit-edit", function(data) {
  const dataList = [data];
  render("#content", dataList);
});

getTodoList();