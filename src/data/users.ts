import DBWrapper from './db-wrapper';
import SnowflakeEntity from './snowflake-entity';
import { User, UserDocument } from './models/user';

export default class Users extends DBWrapper<SnowflakeEntity, UserDocument> {
    protected async getOrCreate({ id }: SnowflakeEntity) {
        return (await User.findById(id))
            ?.populate('user')
            .execPopulate();
    }
}