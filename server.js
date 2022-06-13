import { ApolloServer, gql } from "apollo-server";
import { isNullableType } from "graphql";

let tweets = [
    {
        id : "1",
        text : "first one",
        userId : "2",
    },
    {
        id : "2",
        text : "second one",
        userId : "1",
    }

]

let users = [
    {
        id : "1",
        firstName : "Ethan",
        lastName : "Yu",
    },
    {
        id : "2",
        firstName : "Manbo",
        lastName : "Sham",
    }
]

const typeDefs = gql`

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
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
        allUsers: [User!]!
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
        allUsers() {
            console.log("allUsers called");
            return users;
        }
    },
    Mutation : {
        postTweet(__, { text, userId }) {
            const newTweet = {
                id : tweets.length+1,
                text,
                userId
            };
            if(!users.find((user)=>user.id === userId)) throw new Error("userId not exsists"); 
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(__, { id }) {
            const tweet = tweets.find((tweet) => tweet.id === id);
            if(!tweet) return false;
            tweets = tweets.filter(tweet=> tweet.id !== id);
            return true;
        },
    },
    User : {
        fullName({ firstName, lastName }) {
            // param = "root" = __ (User 타입의 객체, type resolver 거치지 않은, 정제되지 않은 기본 데이터)
            console.log("fullname called");
            return `${firstName} ${lastName}`;
        }
    },
    Tweet : {
        author({ userId }) {
            return users.find((user)=>user.id === userId);
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});

// type Query = GET Request; required
// Mutation = POST, DELETE, PUT 요청, 서버 측에서 무언가 해주고 싶은 경우(db저장, 캐시처리 등등) => 사용차 측에서 mutation이라고 적어줘야함
// dynamic field(calculated field) : fullName / resolver for "fullname" is found & called! / 쿼리-뮤테이션 / query => type 순으로 진행되며 resolver 찾고 호출