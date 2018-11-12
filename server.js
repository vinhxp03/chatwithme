var express = require("express");
var app = express();
app.use(express.static("public")); // cho phép user truy cập vào thư mục public
app.set("view engine","ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

// Mongo
/*var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  	var dbo = db.db("shop");
  	var myobj = { name: "Company Inc", address: "Highway 37" };
  	dbo.collection("book").insertOne(myobj, function(err, res) {
    	if (err) throw err;
    	console.log("1 document inserted");
    	db.close();
  	});
});*/

/*var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://vinhphan:admin@cluster0-1fqex.gcp.mongodb.net/chatwithme?retryWrites=true";
MongoClient.connect(uri, function(err, db) {
	if (err) throw err;
	var dbo = db.db("chatwithme");
	var myobj = { name: "Company Inc", address: "Highway 37" };
	dbo.collection("messages").insertOne(myobj, function(err, res) {
		if (err) throw err;
		console.log("1 document inserted");
		db.close();
	});
});*/

var arrUser=[]; // mảng user

io.on("connection", function (socket) {	
	console.log("Connected " + socket.id);

	socket.on("disconnect", function () {	
		console.log(socket.id + " Disconnected");

		arrUser.splice(arrUser.indexOf(socket.username),1);// xóa user logout
		socket.broadcast.emit("server-list-data", arrUser);
	})

	//xử lý đăng nhập
	socket.on("client-sent-username", function (data) {
		data = data.trim();
		if (arrUser.indexOf(data)>=0) {
			// kết nối thất bại
			socket.emit("server-login-fail",data);
		}else if(data.length > 8){
			socket.emit("server-login-fail-maxlegth",data);
		}else if(data==""){
			socket.emit("server-login-fail-null",data);
		}else{
			// kết nối thành công
			arrUser.push(data);
			socket.username = data; // gán cho client 1 cái username
			socket.emit("server-login-success", data);
			io.sockets.emit("server-list-data", arrUser); // gửi dữ liệu user về
		}
	})
	// đăng xuất
	socket.on("logout",function () {
		arrUser.splice(arrUser.indexOf(socket.username),1); // xóa user logout
		socket.broadcast.emit("server-list-data", arrUser);
	})

	// xử lý chat
	socket.on("client-send-message",function (data) {
		console.log(data);
		socket.emit("server-send-message-client", {uname:socket.username,mess:data}); // truyền JSON về client
		socket.broadcast.emit("server-send-message-broad", {uname:socket.username,mess:data});
	})
})

/*app.get("/", function(req,res) {
	res.render("layout");
})*/

app.get("/", function(req,res) {
	res.render("index");
})

app.get("/dang-nhap", function(req,res) {
	res.render("login");
})

