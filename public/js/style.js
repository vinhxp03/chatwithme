var socket = io("https://chatwithmenow.herokuapp.com");

//login thất bại
socket.on("server-logon-fail", function (data) {
	alert("Nickname đã tồn tại! Vui lòng chọn tên khác.");
});

//login thất bại
socket.on("server-logon-fail-null", function (data) {
	alert("Nickname không được bỏ trống.");
});

//login thất bại
socket.on("server-logon-fail-maxlegth", function (data) {
	alert("Nickname không được dài quá 12 ký tự.");
});

// đăng nhập thành công
socket.on("server-logon-success", function (data) {
	$("#curUser").html(data);
	$("#login-chat").hide();
	$("#frame").show(1000);
});

// nhận mảng user về client
socket.on("server-list-data", function (data) {
	$("#userOnline").html("");
	data.forEach(function (i) {
		$("#userOnline").append("<li class='contact'><div class='wrap'><span class='contact-status online'></span><img src='pic/user.png'/><div class='meta'><p class='name'>"+i+"</p><p class='preview'>...</p></div></div></li>");
	})
});

// client nhận dữ liệu chat
socket.on("server-send-message-client", function (data) {
	$("#messages").append("<li class='sent'><img src='pic/user.png'/><p><b>"+data.uname+": </b>"+data.mess+"</p></li>");
	//$('.preview').html(data.mess);
	$('#txtmessage').val(null);
	$(".messages").scrollTop($(".messages")[0].scrollHeight);
	//$(".messages").animate({ scrollTop: $(document).height() }, "fast");
});

// broadcast nhận dữ liệu chat
socket.on("server-send-message-broad", function (data) {
	$("#messages").append("<li class='replies'><img src='pic/user.png'/><p><b>"+data.uname+": </b>"+data.mess+"</p></li>");
	$('#txtmessage').val(null);
	$(".messages").scrollTop($(".messages")[0].scrollHeight);
	//$(".messages").animate({ scrollTop: $(document).height() }, "fast");
});

$(document).ready(function () {
	$("#login-chat").show();
	$("#frame").hide();

	// Đăng nhập
	$("#btnLogin").click(function () {
		socket.emit("client-sent-username",$("#txtUser").val());
	});

	// Đăng xuất
	$("#btnLogout").click(function () {
		socket.emit("logout");
		$("#login-chat").show();
		$("#frame").hide();
	});

	$(".messages").animate({ scrollTop: $(document).height() }, "fast");

	// gửi nội dung chat lên server
	$("#btnSend").click(function () {
		message = $("#txtmessage").val();
		if(message.trim() == '') {
			return false;
		}
		socket.emit("client-send-message",message);
	});

	$(window).on('keydown', function(e) {
	  if (e.which == 13) {
	  	message = $("#txtmessage").val();
		if(message.trim() == '') {
			return false;
		}
	    socket.emit("client-send-message",message);
	    return false;
	  }
	});
});
