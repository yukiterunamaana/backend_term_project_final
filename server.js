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

	//await collUsers.insertOne(obj);
	const collRooms = db.collection('rooms');
	collRooms.deleteMany({})
	let arrRoomsId = [];

	const collUsers = db.collection('users');
	collUsers.deleteMany({})
	let arrUsers = [];

	const collMessages = db.collection('messages');
	collMessages.deleteMany({})
	let arrMsgId = [];

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
	const wsServer = new webSocket.Server({port: 9000});
	wsServer.on('connection', (wsClient) =>
	{
		console.log("WS Connected!")
		wsClient.send("Contact!")

		wsClient.on('message', async (msg) => {
			let _json = JSON.parse(msg);
			console.log("WS message ", JSON.stringify(_json,null,2))
			await processJSON(_json, collUsers, collMessages);
		});

		wsClient.on('close', () => {
			console.log("Client closed ", wsClient)
		});

		let processJSON = async (_json, collUsers, collMessages) => {
			if (_json.hasOwnProperty('room_id')) {
				if (_json.hasOwnProperty('player_id')) {
					if (_json.hasOwnProperty('msg_id')) {
						processReaction(_json);
					}
					else if (_json.hasOwnProperty('body') || _json.hasOwnProperty('image')) {
						processMessage(_json);
					}
				} else processUser(_json);
			}
		}
		let processUser = async (_json, collUsers) => {
			collUsers.insertOne(_json);
			console.log(_json);
			wsClient.send("user connected!");
		}
		//TODO process user exit
		let userExit = async () => {}
		let processMessage = async (_json, collMessages) => {
			let newJSON = {..._json, "likes": []};
			collMessages.insertOne(newJSON);
			console.log(newJSON);
			wsClient.send("message sent!");
		}
		//TODO process reactions
		let processReaction = async (_json, collMessages) => {
			wsClient.send("user liked!");
		}

	});

}

start();

