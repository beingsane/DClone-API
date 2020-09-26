import DBWrapper from './db-wrapper';
import SnowflakeEntity from './snowflake-entity';
import { User, UserDocument } from './models/user';

export default class Users extends DBWrapper<SnowflakeEntity, UserDocument> {
    protected async getOrCreate({ id }: SnowflakeEntity) {
        return (await User.findById(id)
          ?? await this.create({ id }))
          .populate('user');
    }

    protected create({ id }: SnowflakeEntity) {
        return new User({ _id: id }).save();
    }
}