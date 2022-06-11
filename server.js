import { ApolloServer, gql } from "apollo-server";
import { isNullableType } from "graphql";

const tweets = [
    {
        id : "1",
        text : "first one",
    },
    {
        id : "2",
        text : "second one",
    }

]

const typeDefs = gql`

    type User {
        id: ID!
        username: String!
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
    }
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        ping: String!
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!) : Boolean!
    }

`;

const resolvers = {

    Query : {
        allTweets() {
            return tweets;
        },
        tweet(__, {id}){
            return tweets.find((tweet) => tweet.id === id);
        },
    }
}

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});

// type Query = GET Request; required
// Mutation = POST, DELETE, PUT 요청, 서버 측에서 무언가 해주고 싶은 경우(db저장, 캐시처리 등등) => 사용차 측에서 mutation이라고 적어줘야함