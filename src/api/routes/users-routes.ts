import { Router } from 'express';
import { StatusType, User } from '../../data/models/user';
import { generateSnowflake } from '../../data/snowflake-entity';
import Users from '../../data/users';
import Deps from '../../utils/deps';
import jwt from 'jsonwebtoken';
import { updateUser } from '../modules/middleware';

export const router = Router();

const users = Deps.get<Users>(Users);

router.get('/', updateUser, async (req, res) => res.json(res.locals.user));

router.get('/:id', async (req, res) => {
  const user = await users.get({ id: req.params.id });
  res.json(user);
});

router.post('/', async (req, res) => {
  try {    
    const user = await (User as any).register({
      _id: generateSnowflake(),
      username: req.body.username,
      avatarURL: `${process.env.API_URL}/avatars/default0.png`,
      createdAt: new Date(),
      friends: [],
      status: StatusType.Online
    }, req.body.password);

    const token = jwt.sign({ _id: user._id }, 'secret' , { expiresIn : '7d' });
    
    res.status(201).json(token);
  } catch (err) {
    res.json({ code: 400, message: err?.message });
  }
});
