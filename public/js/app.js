const socket = io();

//use moment.js to get current day, date, year, time
const dayDateYearTime = moment().format('llll');
const day = dayDateYearTime.slice(0,3).toUpperCase();
const date = dayDateYearTime.slice(5,11).toUpperCase();
const year = dayDateYearTime.slice(13,17);
$('#moment-day').append(day);
$('#moment-date').append(date);
$('#moment-year').append(year);


/////////-----UTILITY FUNCTIONS-----/////////////
const render = function(outputElement, dataList) {
  dataList.forEach(e => {
    $(outputElement).append(`
            <div id='item-${e.task}' class="toDoItem">
            <span class='todo'>${e.task}</span>
            <a href="#"><span id='deleteBtn-${
              e.task
            }' class="finish far fa-circle fa-lg" value='${e.task}'></span></a>
            </div>`);
  });
};

const getTodoList = function(){
  $.ajax({ url: "/api/todolist", method: "GET" }).then(function(data) {
    render("#content", data);
  });
};
/////////-----END UTILITY FUNCTIONS-----/////////////

getTodoList();

/////////-----EVENT LISTENERS-----/////////////
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
  $.ajax({ url: "/api/todolist", method: "POST", data: newInput }).then(
    function(data) {
      if (data.success === true) {
        $("#newInput").val("");
      } else {
        alert("Enter a unique input");
      }
    }
  );
  //send to all sockets
  socket.emit("add-todo", newInputList);
});

$(document).ready(function() {
  $(document).on("click", ".finish", function(event) {
    event.preventDefault();
    const deleteId = $(this).attr("value");
    $(`#item-${deleteId}`).toggleClass('opacity');
    $(this).toggleClass('fa-circle').toggleClass('fa-times-circle').toggleClass('finish').toggleClass('delete');
  });
});

$(document).ready(function() {
  $(document).on("click", ".delete", function(event) {
    //extract from value property of clicked button
    const deleteTodo = $(this).attr("value");
    $.ajax({ url: `/api/todolist/${deleteTodo}`, method: "DELETE" });
    socket.emit('delete-todo', deleteTodo)
  });
});
/////////-----END EVENT LISTENERS-----/////////////

/////////-----SOCKET.IO LISTENERS-----/////////////
socket.on("emit-add", function(data) {
  render("#content", data);
});

socket.on("emit-edit", function(data) {
  const dataList = [data];
  render("#content", dataList);
});

socket.on("emit-delete", function(data) {
  $(`#item-${data}`).remove();
});
/////////-----END SOCKET.IO LISTENERS-----/////////////