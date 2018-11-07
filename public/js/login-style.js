var socket = io("http://localhost:3000")

$(document).ready(function () {
	$("#btnLogin").click(function () {
		socket.emit("client-send-username", $("#txtUser").val());
	});
});