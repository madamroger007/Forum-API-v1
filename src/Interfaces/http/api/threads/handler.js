const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase")

class ThreadsHandler {
  constructor(container) {
   this._container = container;

   this.postThreadsHandler = this.postThreadsHandler.bind(this);
  }
  async postThreadsHandler(request, h) {
    const { user: owner} = request.auth.credentials.user;
    const addThreadUseCase = this_container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute({...request.payload ,owner})
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}


module.exports = ThreadsHandler