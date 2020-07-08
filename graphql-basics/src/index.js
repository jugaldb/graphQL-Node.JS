import { GraphQLServer } from "graphql-yoga";


//demo user data

const users = [
    {
        id:'123',
        name:"Jugal",
        email:"jugal@example.com",
        age:19,
    },
    {
        id:'124',
        name:"Rajat",
        email:"rajat@example.com",
    },
    {
        id:'125',
        name:"Shivam",
        email:"shivam@kaloory.com",
        age:19,
    }
]


const posts = [
    {
        id:"1",
        title:"Node.Js oauth",
        body:"Great",
        published:true,
        author:'123'
    },
    {
        id:"2",
        title:"Js engine",
        body:"good",
        published:true,
        author:'123'
    },
    {
        id:"3",
        title:"Node.Js graphql",
        body:"Great",
        published:false,
        author:"125"
    }
]



const comments =[
    {
        id:'10',
        text:'Hello',
        author:'124',
        post:'1'
    },
    {
        id:'11',
        text:'BYE',
        author:'125',
        post:'1'
    },
    {
        id:'12',
        text:'GraphQL???',
        author:"123",
        post:'3'
    },
    {
        id:'13',
        text:'Working well',
        author:"124",
        post:'2'
    }
]

//Type defs
const typeDefs = `
    type Query {
        
        me: User!
        users(query: String):[User!]!
        post: Post!
        posts(query: String):[Post!]!
        comments(query: String):[Comment!]!
    }
    type User{
        name: String!
        email: String!
        id: ID!
        age: Int
        posts(query: String):[Post]!
        comments:[Comment]!
    }
    type Post{
        id:ID!
        title: String!
        body:String!
        published:Boolean!
        author: User!
        comments:[Comment!]
    }
    type Comment{
        id:ID!
        text:String!
        author: User!
        post:Post!
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
        },
        comments(parent,args,ctx,info){
            if(!args.query){
                return comments
            }
            return comments.filter((comment)=>{
                return comment.title.toLowerCase().includes(args.query.toLowerCase())||post.body.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
    Post:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id == parent.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return comment.post ==parent.id
            })
        }

    },
    User:{
        posts(parent,args,ctx,info){
            return posts.filter((post)=>{
                return post.author==parent.id
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return comment.author==parent.id
            })
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id == parent.author
            })
        },
        post(parent,args,ctx,info){
            return posts.find((post)=>{
                return post.id==parent.post
            })
        }
    }
 
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => {
	console.log("The server is up");
});
