const autoBind = require("auto-bind");
const AddedThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase")

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }
  async postThreadsHandler(request, h) {
    const addedThreadUseCase = await this_container.getInstance(AddedThreadUseCase.name)
    const { id: credentialId} = request.auth.credentials;
    const addedThread = await addedThreadUseCase.execute({...request.payload ,owner:credentialId})
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