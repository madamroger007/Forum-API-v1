const LikeUnlikeCommentUseCase = require("../../like/LikeUnlikeCommentUseCase");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const LikeRepository = require("../../../../Domains/likes/LikeRepository");

describe("LikeUnlikeCommentUseCase", () => {
  const useCasePayload = {
    threadId: "thread-123",
    commentId: "comment-123",
    userId: "user-123",
  };

  const setupMocks = (likeStatus) => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyAvailableCommentInThread = jest
      .fn()
      .mockResolvedValue();
    mockLikeRepository.checkLikeComment = jest
      .fn()
      .mockResolvedValue(likeStatus);
    mockLikeRepository.likeComment = jest.fn().mockResolvedValue(1);
    mockLikeRepository.unlikeComment = jest.fn().mockResolvedValue(1);

    return {
      mockThreadRepository,
      mockCommentRepository,
      mockLikeRepository,
    };
  };

  it("should orchestrate the unlike comment action correctly", async () => {
    // Arrange
    const { mockThreadRepository, mockCommentRepository, mockLikeRepository } =
      setupMocks(1);

    const likeUnlikeComment = new LikeUnlikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const isLike = await likeUnlikeComment.execute(useCasePayload);

    // Assert
    expect(isLike).toEqual(1);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyAvailableCommentInThread).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockLikeRepository.checkLikeComment).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.unlikeComment).toBeCalledWith(useCasePayload);
  });

  it("should orchestrate the like comment action correctly", async () => {
    // Arrange
    const { mockThreadRepository, mockCommentRepository, mockLikeRepository } =
      setupMocks(0);

    const likeUnlikeComment = new LikeUnlikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const isUnlike = await likeUnlikeComment.execute(useCasePayload);

    // Assert
    expect(isUnlike).toEqual(1);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyAvailableCommentInThread).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockLikeRepository.checkLikeComment).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.likeComment).toBeCalledWith(useCasePayload);
  });
});
