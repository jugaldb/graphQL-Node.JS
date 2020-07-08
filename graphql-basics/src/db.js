let users = [
	{
		id: "123",
		name: "Jugal",
		email: "jugal@example.com",
		age: 19,
	},
	{
		id: "124",
		name: "Rajat",
		email: "rajat@example.com",
	},
	{
		id: "125",
		name: "Shivam",
		email: "shivam@kaloory.com",
		age: 19,
	},
];

let posts = [
	{
		id: "1",
		title: "Node.Js oauth",
		body: "Great",
		published: true,
		author: "123",
	},
	{
		id: "2",
		title: "Js engine",
		body: "good",
		published: true,
		author: "123",
	},
	{
		id: "3",
		title: "Node.Js graphql",
		body: "Great",
		published: false,
		author: "125",
	},
];

let comments = [
	{
		id: "10",
		text: "Hello",
		author: "124",
		post: "1",
	},
	{
		id: "11",
		text: "BYE",
		author: "125",
		post: "1",
	},
	{
		id: "12",
		text: "GraphQL???",
		author: "123",
		post: "3",
	},
	{
		id: "13",
		text: "Working well",
		author: "124",
		post: "2",
	},
];


const db = {
    users,comments,posts
}

export{db as default}