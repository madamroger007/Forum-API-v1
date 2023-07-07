const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../../Domains/threads/entities/AddThread");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist add thread and return added thread correctly", async () => {
      // Arrange
      //* register User
      const regisUserPayload = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });

      // stub
      const fakeIdGenerator = () => "123";
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const registeredUser = await userRepositoryPostgres.addUser(
        regisUserPayload
      );

      const thread = {
        title: "title",
        body: "body",
        owner: registeredUser.id,
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threadHelper = await ThreadsTableTestHelper.findThreadsById(
        "thread-123"
      );
      expect(threadHelper).toHaveLength(1);
    });

    it("should return added thread correctyly", async () => {
      // Arrange
      //* user
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding_Indonesia",
      });

      // stub
      const fakeIdGenerator = () => "123";
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      
      const thread = {
        title: 'title',
        body:'body',
        owner: registeredUser.id
      }

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
      
      // Action
      const addThread = await threadRepositoryPostgres.addThread(thread); 
    
      // Assert
      expect(addThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: thread.title,
        owner: thread.owner
      }))
    });
  });

  describe('verifyFoundThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyFoundThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyFoundThreadById('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

});
