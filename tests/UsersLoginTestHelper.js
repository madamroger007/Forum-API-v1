// istanbul ignore file
const UsersLoginTestHelper = {
    async getUserIdAndAccessTokenObject({ server }) {

      // payload
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      }


      // user registration
      const userLogin = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      
  
      // user login
      const userAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload:{
          username: userPayload.username,
          password: userPayload.password
        }
      });
      
      const { id: userId } = JSON.parse(userLogin.payload).data.addedUser;
      const { accessToken  } = JSON.parse(userAuth.payload).data;
  
      return {
        userId,
        accessToken,
      };
    },
  };
  
  module.exports = UsersLoginTestHelper;