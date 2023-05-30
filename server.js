const webSocket = require('ws');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

const client = new MongoClient("mongodb+srv://mnhyg_hzwxlyM:KzWBz2GTBCCtMO9k@memchiki.2iwaqos.mongodb.net/?retryWrites=true&w=majority");
let start = async () =>
{
	await client.connect();
	console.log("Listening...")
	
	const db = client.db('game');



	// create rooms

	const collRooms = db.collection('rooms');
	collRooms.deleteMany({})
	let arrRoomsId = [];
	
	for(let i = 0; i < 5; i++)
	{
		let roomObj = {
			name: "Комната " + (i + 1),
			arrUsers: [],
			currentUser: 0,
			state: "prompt",	// prompt / comments / reactions
		}
		await collRooms.insertOne(roomObj);
		arrRoomsId.push(roomObj._id);
	}
  // 	collRooms.updateOne({_id: arrRoomsId[1]}, { "$set": {"state": "comments"}});
  //
	// let cursor = await collRooms.find({})
	//
	// let arrRooms = [];
	//
	// for await (const doc of cursor) {
  //     arrRooms.push(doc)
  // }
	// console.log("Rooms:")
  // console.log(arrRooms);

	// create users
	
	const collUsers = db.collection('users');
	collUsers.deleteMany({})
	// collUsers.insertOne(obj);
	
	// for(let i = 0; i < 3; i++)
	// {
	// 	let obj = {
	// 		name: "Пользователь " + (i + 1),
	// 		chatId: arrRooms[0]._id,
	// 		score: 0,
	// 	}
	//
	// 	await collUsers.insertOne(obj);
	// }
	// cursor = await collUsers.find({_id: {"$gt" : new ObjectId("6470b9ced15516f6a5597c9b")}})
	//
	// let arrUsers = [];
	//
	// for await (const doc of cursor) {
  //     arrUsers.push(doc)
  // }
	// console.log("Users:")
  // console.log(arrUsers);

	// create messages

	const collMessages = db.collection('messages');
	collMessages.deleteMany({})
	let arrMsgId = [];

	// for(let i = 0; i < 5; i++)
	// {
	// 	let obj = {
	// 		name: "Сообщение " + (i + 1),
	// 		userId: arrUsers[0]._id,
	// 		//reactions: [{userId: arrUsers[1]._id, reaction: -2}, {userId: arrUsers[2]._id, reaction: 1}],
	// 		reactions: [],
	// 	}
	//
	// 	await collMessages.insertOne(obj);
	// 	console.log("Сообщение добавлено: ", obj._id)
	// 	arrMsgId.push(obj._id);
	// }

  // add reactions
  //
  // collMessages.updateOne({_id: arrMsgId[0]}, { "$push": {"reactions": {userId: arrUsers[1]._id, reaction: -2}}})
  // collMessages.updateOne({_id: arrMsgId[0]}, { "$push": {"reactions": {userId: arrUsers[2]._id, reaction: -1}}})
  //
	// cursor = await collMessages.find({})
  //
	// let arrMessages = [];
	//
	// for await (const doc of cursor) {
  //     arrMessages.push(doc)
  // }

	// console.log("Messages:")
  // console.log(arrMessages);
  // console.log(JSON.stringify(arrMessages));

}

start();

const wsServer = new webSocket.Server({port: 9000});

let arrClients = []

wsServer.on('connection', (wsClient) =>
{
	//console.log("WS Connected!")

	arrClients.push({
		ws: wsClient,
		name: "",
	})

	//wsClient.send("Contact!")

	wsClient.on('message', (msg) => {
		let _json = JSON.parse(msg);
		console.log("WS message ", JSON.stringify(_json,null,2))
		collUsers.insertOne(_json);
	});

	wsClient.on('close', () => {
		//console.log("Client closed ", wsClient)
	});
});