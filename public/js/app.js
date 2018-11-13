$(function () {
    let index = 0;
    const render = function (outputElement, dataList) {
        dataList.forEach(e => {
            $(outputElement).append(`
            <div id='item-${e.task}' class="toDoItem">
            <input class="finishedBtn" type="checkbox">
            <span>${e.task}</span>
            <a href="#"><span id='deleteBtn-${e.task}' class="delete fas fa-times" value='${e.task}'></span></a>
            </div>`);
            index++;
        });
    };

    $('.fa-share').on('click', function (event) {
        event.preventDefault();
        //display in front-end make an array of 1 element
        const newInput = { task: $('#newInput').val().trim(), done: false };
        const newInputList = [newInput];
        //post data to server
        $.ajax({ url: '/api/todolist', method: 'POST', data: newInput })
            .then(function (data) {
                if (data.success === true) {
                    render('#content', newInputList);
                    $('#newInput').val('');
                    index++;
                }
                else {
                    alert('Enter a unique input');
                }
            });
    });

    $(document).ready(function () {
        $(document).on('click', '.delete', function (event) {
            event.preventDefault();
            //extract number from value property of clicked button
            const deleteId = $(this).attr('value');
            $(`#item-${deleteId}`).remove();
            $.ajax({ url: `/api/todolist/${deleteId}`, method: "DELETE" });
            $('#content').html('');
            $.ajax({ url: "/api/todolist", method: "GET" })
                .then(function (data) {
                    render('#content', data);
                });
        });
    });


    $.ajax({ url: "/api/todolist", method: "GET" })
        .then(function (data) {
            render('#content', data);
        });
});