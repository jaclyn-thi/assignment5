import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { FocusScore, Friend, Post, Room, Status, Task, TimedResource, User, WebSession } from "./app";
import { TimedResourceDoc } from "./concepts/TimedResource";
import { NotAllowedError, NotFoundError } from "./concepts/errors";
import { PostDoc, PostOptions } from "./concepts/post";
import { TaskDoc } from "./concepts/task";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  //added to get username from user id in components
  // @Router.get("/users/username/:_id")
  // async getUsername(_id: ObjectId) {
  //   const username = User.getUserById(_id);
  //   return username;
  // }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  //Room routes
  @Router.post("/rooms")
  async createRoom(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Room.create(user);
  }

  @Router.get("/rooms/:hostName")
  async getRoom(hostName: string) {
    const host = await User.getUserByUsername(hostName);
    return await Room.getRoom(host._id);
  }

  @Router.get("/room/occupants/:hostName")
  async getOccupants(hostName: string) {
    //get occupants for the room with host name host
    const occupantUsernames = [];
    const host = await User.getUserByUsername(hostName);
    const occupantResult = await Room.getOccupants(host._id);
    for (const occupantId of occupantResult.occupants) {
      const occupant = await User.getUserById(occupantId);
      occupantUsernames.push(occupant.username);
    }
    return { msg: "Occupant names found!", occupants: occupantUsernames };
  }

  @Router.put("/room/occupants/:hostName")
  //add user to current session user's room
  async addUser(username: string, hostName: string) {
    const user = await User.getUserByUsername(username);
    //const host = WebSession.getUser(session);
    const hostUser = await User.getUserByUsername(hostName);
    return await Room.addUser(user._id, hostUser._id);
  }

  @Router.delete("/room/occupants/:hostName")
  async removeUser(username: string, hostName: string) {
    // remove user from room.occupants
    const user = await User.getUserByUsername(username);
    const hostUser = await User.getUserByUsername(hostName);
    console.log("Removing a user from a room (routes)");
    return await Room.removeUser(user._id, hostUser._id);
  }

  //FocusScore routes
  @Router.post("/FocusScores")
  async createFocusScore(session: WebSessionDoc) {
    // for a user in current session without a score, instantiate FocusScore associated with user to 0
    const user = WebSession.getUser(session);
    return await FocusScore.create(user);
  }

  @Router.get("/FocusScore")
  async getFocusScore(username: string) {
    const user = await User.getUserByUsername(username);
    return await FocusScore.getFocusScore(user._id);
    // increase the FocusScore associated with User by the specified amount of points
  }

  @Router.put("/FocusScore/set")
  async setScore(session: WebSessionDoc, points: number) {
    if (points == null) {
      throw new NotAllowedError("Invalid score!");
    }
    const user = WebSession.getUser(session);
    //const currentPoints = await FocusScore.getFocusScore(user);
    return await FocusScore.updateScore(user, { score: Number(points) });
    // increase the FocusScore associated with User by the specified amount of points
  }

  @Router.put("/FocusScore/update")
  async updateScore(username: string, points: number) {
    if (points == null) {
      throw new NotAllowedError("Invalid score!");
    }
    const user = await User.getUserByUsername(username);
    const currentPoints = await FocusScore.getFocusScore(user._id);
    return await FocusScore.updateScore(user._id, { score: Number(currentPoints.score) + Number(points) });
    // increase the FocusScore associated with User by the specified amount of points
  }

  //routes for everything else lol
  @Router.post("/Timers/:_id")
  async createTimedResource(_id: ObjectId, duration: number) {
    return await TimedResource.create(_id, duration);
  }

  @Router.put("/Timers/startTimer/:_id")
  async startTimer(_id: ObjectId) {
    // returns the duration of the timer tied to the object with _id to be displayed and decremented on the front end
    return await TimedResource.startTimer(_id);
  }

  @Router.get("/Timers")
  async getTimer(_id: ObjectId) {
    return await TimedResource.getTimer(_id);
  }

  @Router.patch("/Timers/updateTimer/:_id")
  async updateTimer(_id: ObjectId, update: Partial<TimedResourceDoc>) {
    return await TimedResource.updateTimer(_id, update);
  }

  @Router.put("/Timers/reset/:_id")
  async resetTimer(_id: ObjectId) {
    return await TimedResource.resetTimer(_id);
  }

  @Router.get("/tasks")
  async getTasks(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Task.getTasks({ author: user });
  }

  @Router.post("/tasks/create/:user")
  async createTask(session: WebSessionDoc, title: string, due: Date) {
    const user = WebSession.getUser(session);
    return await Task.create(user, title, due);
  }

  @Router.patch("/task/update/:_id")
  async updateTask(_id: ObjectId, update: Partial<TaskDoc>) {
    return await Task.updateTask(_id, update);
  }

  @Router.post("/status")
  async createStatus(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const ret = await Status.create(user);
    return ret;
  }

  @Router.get("/status")
  async getStatus(username: string) {
    const user = await User.getUserByUsername(username);
    const stat = await Status.getStatus(user._id);
    return { msg: "Status found!", status: stat };
  }

  @Router.put("/status")
  async updateStatus(session: WebSessionDoc, newStatus: string) {
    const user = WebSession.getUser(session);
    if (newStatus !== "Online" && newStatus !== "Offline" && newStatus !== "Away" && newStatus !== "Focus") {
      throw new NotAllowedError("Invalid status type!");
    } else {
      await Status.updateStatus(user, { statusType: newStatus });
    }
    return { msg: "Status updated!", status: await Status.getStatus(user) };
  }

  // // !!!!!!!!synchronizations!!!!!!!
  // a FocusRoom will be created on the front end when a user registers. First it will create a room for the user and then create
  // timedresource tied to that room.

  @Router.put("/focusroom/:username")
  async addToFocusRoom(username: string, host: string) {
    // for a user with username, add user to FocusRoom if they are friends with the host of the focusroom
    const user = await User.getUserByUsername(username);
    const hostUser = await User.getUserByUsername(host);
    const friendArray = await Friend.getFriends(hostUser._id);

    for (const friend of friendArray) {
      if (String(user._id) === String(friend)) {
        return await Room.addUser(user._id, hostUser._id);
      }
    }
    throw new NotFoundError("Can only add friends of host!");
  }

  @Router.delete("/focusroom/:username")
  async removeFromFocusRoom(username: string, host: string) {
    // for a user with given username, remove user from FocusRoom if they are an occupant of that room
    //return await this.removeUser(username, session);
    const user = await User.getUserByUsername(username);
    //const host = WebSession.getUser(session);
    const hostUser = await User.getUserByUsername(host);
    return await Room.removeUser(user._id, hostUser._id);
  }

  //note to self: adjust this to account for occupants list being of username strings rather than ids
  @Router.put("/focusroom/reward/:hostName")
  async rewardFocusRoom(hostName: string, duration: number) {
    // should be called by front end when focusroom timer has completed
    const hostUser = await User.getUserByUsername(hostName);
    // const room = await Room.rooms.readOne({ hostId: hostUser._id });
    const room = await Room.getRoom(hostUser._id);
    if (room === null) {
      throw new NotFoundError("Room not found!");
    }

    const occupants = room.occupants;
    for (const person of occupants) {
      //update score for everyone in room acccording to status of timer
      // console.log("occupants", occupants);
      // console.log("duration", duration);
      // console.log("occupants.length", occupants.length);
      // console.log(duration * (1 + occupants.length / 10));
      const occupantScore = await FocusScore.getFocusScore(person);
      // console.log("occupantScore", occupantScore.score);
      // console.log("testing", occupantScore.score + duration * (1 + occupants.length / 10));
      await FocusScore.updateScore(person, { score: occupantScore.score + duration * (1 + occupants.length / 10) });
    }
    return { msg: "All users rewarded!", room: await Room.rooms.readOne({ hostId: hostUser._id }) };
  }

  @Router.get("/leaderboard")
  async getLeaderboard(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const userFocusScore = await FocusScore.getFocusScore(user);

    const friends = await Friend.getFriends(user);

    const scoresArray = [];
    scoresArray.push({ user: user, score: userFocusScore.score }); //add current session user's score to leaderboard

    for (const friend of friends) {
      //add current session user's friend's scores to leaderboard
      const score = await FocusScore.getFocusScore(friend);
      scoresArray.push({ user: friend, score: score.score });
    }

    const leaderboard = scoresArray.sort((n1, n2) => {
      // returns a list of {user: ObjectId, score: number} enums sorted by score
      //https://copyprogramming.com/howto/typescript-sorting-based-on-enum-constants
      if (n1.score > n2.score) {
        return -1;
      }
      if (n1.score < n2.score) {
        return 1;
      }
      return 0;
    });

    return leaderboard;
  }
}

export default getExpressRouter(new Routes());
