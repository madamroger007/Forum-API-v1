const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const user = {
      id: "user-123",
      username: "username",
    };
    const useCasePayload = {
      title: "title",
      body: "body",
      owner: user.id,
    };

    const mockAddThread = new AddThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: user.username,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddThread))
    const getThreadUseCase = new AddedThreadUseCase({
        threadRepository: mockThreadRepository
    })

    // Action
    const AddedThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(AddedThread).toStrictEqual(new AddThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: user.username,
    }))
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload));
  });
});
