/* @flow strict-local */
import {
  getAccountDetailsUserForEmail,
  getActiveUsersByEmail,
  getAllUsersByEmail,
  getUsersById,
  getUsersSansMe,
} from '../userSelectors';
import { eg } from '../../__tests__/exampleData';

describe('getAccountDetailsUserForEmail', () => {
  test('return user for the account details screen', () => {
    const state = eg.reduxState({
      users: [eg.selfUser, eg.otherUser],
    });
    expect(getAccountDetailsUserForEmail(state, eg.otherUser.email)).toEqual(eg.otherUser);
  });

  test('if user does not exist return a user with the same email and no details', () => {
    const state = eg.reduxState();
    expect(getAccountDetailsUserForEmail(state, 'b@a.com')).toEqual({
      email: 'b@a.com',
      full_name: 'b@a.com',
      avatar_url: '',
      timezone: '',
      user_id: -1,
      is_admin: false,
      is_bot: false,
    });
  });
});

describe('getActiveUsers', () => {
  test('return users, bots, map by email and do not include inactive users', () => {
    const state = eg.reduxState({
      users: [eg.selfUser],
      realm: {
        ...eg.baseReduxState.realm,
        crossRealmBots: [eg.crossRealmBot],
        nonActiveUsers: [eg.otherUser],
      },
    });
    expect(getActiveUsersByEmail(state)).toEqual(
      new Map([[eg.selfUser.email, eg.selfUser], [eg.crossRealmBot.email, eg.crossRealmBot]]),
    );
  });
});

describe('getAllUsersByEmail', () => {
  test('return users mapped by their email', () => {
    const users = [eg.makeUser(), eg.makeUser(), eg.makeUser()];
    const state = eg.reduxState({ users });
    expect(getAllUsersByEmail(state)).toEqual(new Map(users.map(u => [u.email, u])));
  });

  test('return users, bots, and inactive users mapped by their email', () => {
    const state = eg.reduxState({
      users: [eg.selfUser],
      realm: {
        ...eg.baseReduxState.realm,
        crossRealmBots: [eg.crossRealmBot],
        nonActiveUsers: [eg.otherUser],
      },
    });
    expect(getAllUsersByEmail(state)).toEqual(
      new Map([
        [eg.selfUser.email, eg.selfUser],
        [eg.crossRealmBot.email, eg.crossRealmBot],
        [eg.otherUser.email, eg.otherUser],
      ]),
    );
  });

  test('empty state does not cause an exception, returns an empty object', () => {
    expect(getAllUsersByEmail(eg.reduxState())).toEqual(new Map());
  });
});

describe('getUsersById', () => {
  test('return users mapped by their Id', () => {
    const users = [eg.makeUser(), eg.makeUser(), eg.makeUser()];
    const state = eg.reduxState({ users });
    expect(getUsersById(state)).toEqual(new Map(users.map(u => [u.user_id, u])));
  });
});

describe('getUsersSansMe', () => {
  test('returns all users except current user', () => {
    const state = eg.reduxState({
      users: [eg.selfUser, eg.otherUser],
      realm: eg.realmState({ email: eg.selfUser.email }),
    });
    expect(getUsersSansMe(state)).toEqual([eg.otherUser]);
  });
});
