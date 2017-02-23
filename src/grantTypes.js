/**
 * Created by daniele on 23/02/17.
 * @type {{PASSWORD: string, AUTH_CODE: string, RFS_TOKEN: string}}
 */
/**
 * String constants for /auth/token API
 */
const GRANT_TYPE = {
  PASSWORD : "password",
  AUTH_CODE : "authorization_code",
  RFS_TOKEN : "refresh_code"
}

module.exports = GRANT_TYPE;