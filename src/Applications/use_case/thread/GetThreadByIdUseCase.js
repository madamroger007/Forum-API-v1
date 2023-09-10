class GetThreadByIdUseCase {
  constructor({ commentRepository, threadRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const [thread, comments, replies, likesCount] = await Promise.all([
      this._threadRepository.getThreadById(threadId),
      this._commentRepository.getCommentsByThreadId(threadId),
      this._threadRepository.getRepliesByThreadId(threadId),
      this._likeRepository.getLikeCountComment(threadId),
    ]);

    const processedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted
        ? "**komentar telah dihapus**"
        : comment.content,
      likeCount: likesCount.filter((like) => like.comment_id === comment.id)
        .length,
      replies: replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_deleted
            ? "**balasan telah dihapus**"
            : reply.content,
          date: reply.date,
          username: reply.username,
        })),
    }));

    return {
      ...thread,
      comments: processedComments,
    };
  }
}

module.exports = GetThreadByIdUseCase;
