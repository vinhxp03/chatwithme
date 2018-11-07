var socket = io("http://localhost:3000");

//login thất bại
socket.on("server-login-fail", function (data) {
    alert("Nickname đã tồn tại! Vui lòng chọn tên khác.");
})

//login thất bại
socket.on("server-login-fail-null", function (data) {
    alert("Nickname không được bỏ trống.");
})

//login thất bại
socket.on("server-login-fail-maxlegth", function (data) {
    alert("Nickname không được dài quá 8 ký tự.");
})

// đăng nhập thành công
socket.on("server-login-success", function (data) {
    $("#curUser").html(data);
    $('#box-user-title').html(data);
    $("#login").hide();
    $("#frame").show(1000);
})

// nhận mảng user về client
socket.on("server-list-data", function (data) {
    $("#userOnline").html("");
    data.forEach(function (i) {
        $("#userOnline").append('<li class="contact">\
                        <div class="wrap">\
                            <span class="contact-status online"></span>\
                            <img src="pic/mikeross.png" alt="" />\
                            <div class="meta">\
                                <p class="name">'+i+'</p>\
                                <p class="preview">Nothing to tell.</p>\
                            </div>\
                        </div>\
                    </li>');
    })
})

// client nhận dữ liệu chat
socket.on("server-send-message-client", function (data) {
    $("#messages").append('<li class="sent">\
                        <img src="pic/mikeross.png" alt="" />\
                        <p><b style="color: #31ff00">'+data.uname+': </b>'+data.mess+'</p>');
    //$('.preview').html(data.mess);
    $('#txtmessage').val(null);
    $(".messages").scrollTop($(".messages")[0].scrollHeight);
    //$(".messages").animate({ scrollTop: $(document).height() }, "fast");
})

// broadcast nhận dữ liệu chat
socket.on("server-send-message-broad", function (data) {
    $("#messages").append('<li class="replies">\
                        <img src="pic/harveyspecter.png" alt="" />\
                        <p><b style="color: #004cff">'+data.uname+': </b>'+data.mess+'</p>\
                    </li>');
    $('#txtmessage').val(null);
    $(".messages").scrollTop($(".messages")[0].scrollHeight);
    //$(".messages").animate({ scrollTop: $(document).height() }, "fast");
})

$(document).ready(function () {
    $("#profile-img").click(function() {
        $("#status-options").toggleClass("active");
    });

    $(".expand-button").click(function() {
        $("#profile").toggleClass("expanded")
        $("#contacts").toggleClass("expanded")
    });

    $("#status-options ul li").click(function() {
        $("#profile-img").removeClass();
        $("#status-online").removeClass("active");
        $("#status-away").removeClass("active");
        $("#status-busy").removeClass("active");
        $("#status-offline").removeClass("active");
        $(this).addClass("active");

        if ($("#status-online").hasClass("active")) {
            $("#profile-img").addClass("online");
        } else if ($("#status-away").hasClass("active")) {
            $("#profile-img").addClass("away");
        } else if ($("#status-busy").hasClass("active")) {
            $("#profile-img").addClass("busy");
        } else if ($("#status-offline").hasClass("active")) {
            $("#profile-img").addClass("offline");
        } else {
            $("#profile-img").removeClass();
        }

        $("#status-options").removeClass("active");
    });

    $("#frame").hide();
    $("#login").show(500);

    // Đăng nhập
    $("#btnLogin").click(function () {
        socket.emit("client-sent-username",$("#txtUser").val());
    })

    // Đăng xuất
    $("#btnLogout").click(function () {
        socket.emit("logout");
        $("#login").show(1000);
        $("#frame").hide(500);
    })

    $(".messages").scrollTop($(".messages")[0].scrollHeight);

    function newMessage() {
        var message = $(".message-input input").val();
        
        var msg_arr = message.split(" ");
        var len = msg_arr.length;
        for (var i = 0; i < len; i++) {
        	if (msg_arr[i].length > 22) {
        		alert("Tin nhắn quá dài. Vui lòng thử lại!");
        		return false;
        	}
        }

        if ($.trim(message) == '') {
        	// $('#exampleModal').modal();
            return false;
        }
        socket.emit("client-send-message",message);
        // $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
        // $('.message-input input').val(null);
        // $('.contact.active .preview').html('<span>You: </span>' + message);
        // $(".messages").scrollTop($(".messages")[0].scrollHeight);
    }

    $('.submit').click(function() {
        newMessage();
    });

    $(window).on('keydown', function(e) {
        if (e.which == 13) {
            newMessage();
            return false;
        }
    });
});