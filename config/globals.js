/**
 * @Author: Justin Schieck
 * @Date:   2017-03-27T12:42:06-04:00
 * @Email:  schieck91@gmail.com
 * @Last modified by:   Justin Schieck
 * @Last modified time: 2017-04-05T12:23:17-04:00
 */


// array of global variables
module.exports = {
      //mongo database string
      db:'mongodb://JustinSchieck:Kiraanne1@ds137760.mlab.com:37760/directory',

      //Facebook login strings
      facebook:{
        clientID: '1888027564815127',
        clientSecret:'db14241e519fab31c1d24a8bbf839059',
        callbackURL:'http://localhost:3000/facebook/callback'
      },
      google:{
        clientID: '701719418551-c76m09cqsut235sa2eis732kpaf8mjb0.apps.googleusercontent.com',
        clientSecret:'8KFYd137koFYzEKyDvIH9UX6',
        callbackURL:'http://localhost:3000/google/callback'
      },
      outlook:{
        clientId: '3b53e8a1-f96c-4b8b-97d7-4538d538caea', //This is your client ID
        clientSecret:'MjcuT3fkq53hf5RPDOiDFg3',
        redirectUri: 'http://localhost:3000/outlook/callback'
      }
      };
