export const endpoint = `http://localhost:4000`;
export const prodEndpoint = `https://api.up4.life`;
export const appUrl = `http://localhost:3000`;
export const prodAppUrl = `https://app.up4.life`;
export const wsEndpoint = "ws://localhost:4000";
export const wsProdEndpoint = "wss://api.up4.life";

// export default withApollo(
//   ({ ctx, headers, initialState }) => {
//     return new ApolloClient({
//       uri: "http://localhost:8080/api/graphql",
//       request: async operation => {
//         const authData = process.browser
//           ? getUserFromLocalCookie()
//           : getUserFromServerCookie(ctx.req);
//         let token = null;
//         if (authData) {
//           token = authData.extra.payload.token;
//         }
//         operation.setContext({
//           headers: {
//             bearer: token ? `${token}` : ''
//           }
//         });
//       }
//     });
//   },
// );

// import cookie from "cookie";

// function parseCookies(req, options = {}) {
//   return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options)
// }
