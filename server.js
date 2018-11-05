var express = require("express")
var app = express()
app.use(express.static("public")) // cho phép user truy cập vào thư mục public
app.set("view engine","ejs")
app.set("views","./views")

var server = require("http").Server(app)
var io = require("socket.io")(server)
server.listen(process.env.PORT || 3000)

/*var pg = require('pg')
var config = {
  	user: 'ec2-23-23-153-145.compute-1.amazonaws.com',
  	host: 'database.server.com',
  	database: 'deqrqo9tjpmoee',
  	password: 'ae21229656e51b7bff76399ee85d6402e5f8b881e7b55a3eba94389e9463f4b7',
  	port: 5432,
  	max: 10,
  	idleTimeoutMillis: 30000
}

var pool = new pg.pool(config)

// callback - checkout a client
pool.connect((err, client, done) => {
	const sql = 'CREATE TABLE Messages (\
	    msg_id IDENTITY(1,1) PRIMARY KEY,\
	    msg_name varchar(255),\
	    msg_content varchar(255),\
	    msg_created_at datetime,\
	    msg_update_at datetime,\
	)'
  	if (err) throw err
  	client.query(sql, [1], (err, res) => {
    	done()

    	if (err) {
      	console.log(err.stack)
    	} else {
      	console.log(res.rows[0])
    	}
  	})
})*/

var arrUser=[] // mảng user

io.on("connection", function (socket) {	
	console.log("Connected " + socket.id)

	socket.on("disconnect", function () {	
		console.log(socket.id + " Disconnected")

		arrUser.splice(arrUser.indexOf(socket.username),1) // xóa user logout
		socket.broadcast.emit("server-list-data", arrUser)
	})

	//xử lý đăng nhập
	socket.on("client-sent-username", function (data) {
		data = data.trim()
		if (arrUser.indexOf(data)>=0) {
			// kết nối thất bại
			socket.emit("server-logon-fail",data)
		}else if(data.length>12){
			socket.emit("server-logon-fail-maxlegth",data)
		}else if(data==""){
			socket.emit("server-logon-fail-null",data)
		}else{
			// kết nối thành công
			arrUser.push(data)
			socket.username = data // gán cho client 1 cái username
			socket.emit("server-logon-success",data)
			io.sockets.emit("server-list-data", arrUser) // gửi dữ liệu user về
		}
	})
	// đăng xuất
	socket.on("logout",function () {
		arrUser.splice(arrUser.indexOf(socket.username),1) // xóa user logout
		socket.broadcast.emit("server-list-data", arrUser)
	})

	// xử lý chat
	socket.on("client-send-message",function (data) {
		socket.emit("server-send-message-client", {uname:socket.username,mess:data}) // truyền JSON về client
		socket.broadcast.emit("server-send-message-broad", {uname:socket.username,mess:data})
	})
})

app.get("/", function(req,res) {
	res.render("layout")
})
