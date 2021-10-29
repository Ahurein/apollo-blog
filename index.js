const { ApolloServer, gql } = require("apollo-server");
const { v4: uuid } = require("uuid");

const blogsData = [
  {
    id: 1,
    title: "how to cook",
    content: "this blog teaches you how to cook in a very simple way",
    image: "1.jpg",
    date: "10/11/2021",
    author: 1,
  },
  {
    id: 2,
    title: "how to dance",
    content: "this blog teaches you how to dance like allo danny",
    image: "2.jpg",
    date: "1/01/2021",
    author: 2,
  },
  {
    id: 3,
    title: "playing football",
    content: "watch this fooball match",
    image: "3.jpg",
    date: "05/03/2021",
    author: 2,
  },
  {
    id: 1,
    title: "learning graphql",
    content: "A simple step by step tutorial to learn graphql",
    image: "4.jpg",
    date: "15/04/2021",
    author: 3,
  },
];

const authorsData = [
  {
    id: 1,
    name: "Ahurein",
    image: "1.img",
    author: 1,
  },
  {
    id: 2,
    name: "Ebenezer",
    image: "2.img",
  },
  {
    id: 3,
    name: "Sammy",
    image: "3.img",
  },
];

const commentsData = [
  {
    id: 1,
    body: "this tutorial is great",
    author: 10,
    blogId: 1,
  },
  {
    id: 2,
    body: "I need more time to learn this",
    author: 10,
    blogId: 2,
  },
  {
    id: 3,
    body: "Graphql is perfect for me",
    author: 3,
    blogId: 3,
  },
];

const typeDefs = gql`
  type Query {
    readBlog(id: ID!): Blog!
    readBlogs: [Blog]!
    readComments(id: ID!): [Comment!]!
  }

  type Blog {
    id: ID!
    title: String!
    body: String!
    image: String
    author: Author!
    comments: [Comment]
  }

  type Author {
    id: ID!
    name: String!
    image: String!
  }

  type Comment {
    id: ID!
    body: String!
    author: Author!
    blog: Blog!
  }

  type Mutation {
    createBlog(
      id: ID!
      title: String!
      body: String!
      Image: String!
      author: Int
    ): Blog!

    updateBlog(
      id: ID!
      title: String!
      body: String!
      Image: String!
      author: Int
    ): Blog!

    deleteBlog(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    readBlog: (parent, args, context) => {
      const blogID = args.id;
      const blog = blogsData.find((blogel) => blogel.id == blogID);

      const authorDetails = authorsData.find(
        (authorel) => authorel.id == blog.author
      );

      let newBlog = {
        ...blog,
        author: authorDetails,
      };
      return newBlog;
    },
    readBlogs: (parent, args, context) => blogsData,

    // Accept post id to query all the comments related to it
    readComments: (parent, args, context) => {
      const blogID = args.id;
      if (blogID) {
        const newComments = commentsData.find(
          (comment) => comment.blogId == blogID
        );
        return [newComments];
      }
    },
  },

  Mutation: {
    createBlog: (parent, args) => {
      console.log(args);
      const inputData = {
        ...args,
        id: uuid(),
      };
      const newBlogData = [inputData, ...blogsData];
      console.log(newBlogData);
      return inputData;
    },

    updateBlog: (parent, args) => {
      const updateId = args.id;
      const currentBlog = blogsData.filter((blog) => blog.id == args.id);
      const updatedBlog = {
        ...currentBlog,
        id: uuid(),
      };

      const newBlogData = [updatedBlog, ...blogsData];
      return updatedBlog;
    },

    deleteBlog: (parent, args) => {
      const currentBlogS = blogsData.filter((blog) => blog.id != args.id);
      return "Blog deleted";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at at ${url}`);
});
