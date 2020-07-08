const Query = {
    me(parent,args,{db},info) {
        return {
            id: `123098`,
            name: `Jugal`,
            email: `jugal@exmaple.com`,
            age: 19,
        };
    },
    post(parent,args,{db},info) {
        return {
            id: `helq23`,
            title: `google oauth node.js`,
            body: `The best article`,
            published: true,
        };
    },
    users(parent, args, {db}, info) {
        if (!args.query) {
            return db.users;
        }
        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        });
    },
    posts(parent, args, {db}, info) {
        if (!args.query) {
            return db.posts;
        }
        return db.posts.filter((post) => {
            return (
                post.title.toLowerCase().includes(args.query.toLowerCase()) ||
                post.body.toLowerCase().includes(args.query.toLowerCase())
            );
        });
    },
    comments(parent, args, {db}, info) {
        if (!args.query) {
            return db.comments;
        }
        return db.comments.filter((comment) => {
            return (
                comment.title.toLowerCase().includes(args.query.toLowerCase()) ||
                post.body.toLowerCase().includes(args.query.toLowerCase())
            );
        });
    },
}


export{Query as default}