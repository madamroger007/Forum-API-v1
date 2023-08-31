const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersLoginTestHelper = require('../../../../tests/UsersLoginTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should respond 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await UsersLoginTestHelper.getUserIdAndAccessTokenObject({ server });

      const threadPayload = {
        title: 'title',
        body: 'body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        
      });
      console.log(response)
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addThread).toBeDefined();
    });

    it('should throw error code 400 when bad payload', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await UsersLoginTestHelper.getUserIdAndAccessTokenObject({ server });

      const threadPayload = {
        body: 'body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBe('gagal membuat thread karena properti yang dibutuhkan tidak ada');
    });

    it('should throw error code 401 when adding thread with no authentication', async () => {
      // Arrange
      const server = await createServer(container);

      const threadPayload = {
        title: 'title',
        body: 'body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBe('Missing authentication');
    });
  });

});