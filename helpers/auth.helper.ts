import { APIRequestContext } from "@playwright/test";

/**
 * Helper function to authenticate user and get access token
 * @param request - Playwright API request context
 * @returns Access token string
 */
export async function getAccessToken(request: APIRequestContext) {
  const responseLogin = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
    data: {
      user: {
        email: "useremail45645654@mail.com",
        password: "username45645654",
      },
    },
  });

  const responseBodyLogin = await responseLogin.json();
  return responseBodyLogin.user.token;
}
