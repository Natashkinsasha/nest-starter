import { ObjectId } from 'mongodb';

export default class User {
  _id: ObjectId;
  roles: string[];
}
