export const authConfig = {
  clientId: 'oauth2-pkce-client', 
  authorizationEndpoint: 'http://127.0.0.1:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: 'http://127.0.0.1:8181/realms/fitness-oauth2/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173/',
  scope: 'openid profile email offline_access', 
  
  // FIX: Add this line to stop the instant redirect!
  autoLogin: false, 
  
  onRefreshTokenExpire: (event) => event.logIn(),
}