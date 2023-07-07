const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async addThread(thread) {
    const { title, body, owner } = thread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner",
      values: [id, title, body, owner],
    };
    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async verifyFoundThreadById(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan ");
    }
  }
}

module.exports = ThreadRepositoryPostgres