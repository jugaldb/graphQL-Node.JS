

const shortid = require("shortid");

const Mutation= {
    createUser(parent, args, {db}, info) {
        const emailTaken = db.users.some((user) => {
            return user.email == args.data.email;
        });
        if (emailTaken) {
            throw new Error("Email Taken");
        }
        const id = shortid.generate();
        const user = {
            id,
            ...args.data
        };
        db.users.push(user);
        return user;
    },
    deleteUser(parent,args,{db},info){
        const userIndex = db.users.findIndex((user)=>{
            return user.id ==args.id
        })

        if(userIndex===-1){
            throw new Error('User Not found!')
        }
        const deletedUser = db.users.splice(userIndex,1)
        
        db.posts = db.posts.filter((post)=>{
            const match = post.author===args.id
            
            if(match){
                db.comments= db.comments.filter((comment)=> comment.post!==post.id)
            }
     

            return !match
        })

        db.comments = db.comments.filter((comment)=>comment.author!==args.id)

        return deletedUser[0]
    },
    updateUser(parent,args,{db},info){
        const {id,data}=args
        const user = db.users.find((user)=>{
            return user.id === id
        })
        if(!user){
            throw new Error('Not found-')
        }

        if(typeof data.email === 'string'){
            const emailTaken = db.users.some((user)=>user.email ===data.email)
            if(emailTaken){
                throw new Error('Email already taken')
            }
            user.email =data.email
        }
        if(typeof data.name === 'string'){
           user.name = data.name 
        }
        if(typeof data.age!==undefined){
            user.age =data.age
        }

        return user
    },

    createPost(parent, args, {db}, info) {
        const id= shortid.generate()
        const authorExist =db.users.find((user)=>{
            return user.id == args.data.author
        })
        if(!authorExist){
            throw new Error('The author doesnt exist')
        }
        const post = {
            id,
            ...args.data,
        }

        db.posts.push(post)

        return post
    },

    deletePost(parent,args,{db},info){
        const postIndex = db.posts.findIndex((post)=>post.id==args.id)

        if(postIndex===-1){
            throw new Error('Post not found')
        }

        const deletedPost = db.posts.splice(postIndex,1)

        db.comments = db.comments.filter((comment)=>{
            return comment.post !== args.id

        })
        return deletedPost[0]
    },
    updatePost(parent,args,{db},info){
        const {id,data}=args
        const post = db.posts.find((post)=>{
            return post.id === id
        })
        if(!post){
            throw new Error('Not found-')
        }

        if(typeof data.title === 'string'){
            const titleTaken = db.posts.some((post)=>post.email ===data.email)
            if(titleTaken){
                throw new Error('Title already taken')
            }
            post.title =data.title
        }
        if(typeof data.body === 'string'){
           post.body = data.body 
        }
        if(typeof data.published === 'boolean'){
            post.published =data.published
        }
        if(typeof data.author ==='string'){
            post.author = data.author
        }

        return post
    },
    createComment(parent,args,{db},info){
        const authorExist = db.users.find((user)=>{
            return user.id == args.data.author
        })
        if(!authorExist){
            throw new Error('The author doesnt exist')
        }
        const postExist = db.posts.find((post)=>{
            return post.id == args.data.post
        })
        if(!postExist){
            throw new Error('The post doesnt exist')
        }

        const id = shortid.generate()

        const comment={
            id,
            ...args.data,
        }
        db.comments.push(comment)
        return comment

    },
    deleteComment(parent,args,{db},info){
        const commentIndex = db.comments.findIndex((comment)=>comment.id===args.id)
        if(commentIndex===-1){
            throw new Error('Comment not found')
        }

        const deletedComment = db.comments.splice(commentIndex,1)

        return  deletedComment[0]
    },
    updatePost(parent,args,{db},info){
        const {id,data}=args
        const comment = db.comments.find((comment)=>{
            return comment.id === id
        })
        if(!comment){
            throw new Error('Not found-')
        }


        if(typeof data.text === 'string'){
           comment.text = data.text 
        }
        return comment
    },
    
}

export{Mutation as default}