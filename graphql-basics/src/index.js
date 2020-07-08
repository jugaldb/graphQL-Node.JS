import { GraphQLServer } from "graphql-yoga";


//demo user data

const users = [
    {
        id:'123',
        name:"Jugal",
        email:"jugal@example.com",
        age:19
    },
    {
        id:124,
        name:"Rajat",
        email:"rajat@example.com",
    },
    {
        id:125,
        name:"Shivam",
        email:"shivam@kaloory.com",
        age:19
    }
]


const posts = [
    {
        id:"1",
        title:"Node.Js oauth",
        body:"Great",
        published:true
    },
    {
        id:"2",
        title:"Js engine",
        body:"good",
        published:true
    },
    {
        id:"3",
        title:"Node.Js graphql",
        body:"Great",
        published:false
    }
]

//Type defs
const typeDefs = `
    type Query {
        
        me: User!
        users(query: String):[User!]!
        post: Post!
        posts(query: String):[Post!]!
    }
    type User{
        name: String!
        email: String!
        id: ID!
        age: Int
    }
    type Post{
        id:ID!
        title: String!
        body:String!
        published:Boolean!
    }
`;

//Resolvers
const resolvers = {
	Query: {
        me(){
            return {
                id:`123098`,
                name:`Jugal`,
                email:`jugal@exmaple.com`,
                age:19
            }
        },
        post(){
            return {
                id:`helq23`,
                title:`google oauth node.js`,
                body:`The best article`,
                published:true
            }
        },
        users(parent,args,ctx,info){
            if(!args.query){
                return users
            }
            return users.filter((user)=>{
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent,args,ctx,info){
            if(!args.query){
                return posts
            }
            return posts.filter((post)=>{
                return post.title.toLowerCase().includes(args.query.toLowerCase())||post.body.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
 
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => {
	console.log("The server is up");
});
