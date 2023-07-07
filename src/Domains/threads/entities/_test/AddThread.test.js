const addThread = require('../AddThread');


describe('an addThread entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // arrange
    const payload = {
      id: 'thread-1234',
      title: 'title',
    };

    // action and assert
    expect(() => new addThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // arrange
    const payload = {
      id: 'thread-1234',
      title: 1984,
      owner: true,
    };

    // action and assert
    expect(() => new addThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'title',
      owner: 'user',
    };

    // Action
    const {id,title,owner}= new addThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});