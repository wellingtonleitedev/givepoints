import client from "../../../../../config/twitter.config";
import createSessionService from "../../common/services/createSession.service";

interface IRequest {
  userId: string;
  twitchToken?: string;
  state: string;
  code: string;
  codeVerifier: string;
  sessionState: string;
}

const createSession = async ({
  userId,
  twitchToken,
  state,
  code,
  codeVerifier,
  sessionState,
}: IRequest) => {
  if (!codeVerifier || !state || !sessionState || !code) {
    throw new Error("You denied the app or your session expired!");
  }

  if (state !== sessionState) {
    throw new Error("Stored tokens didnt match!");
  }

  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL!,
    });

    const { data: twitterUser } = await loggedClient.v2.me();

    const { user, token } = await createSessionService({
      userId,
      data: {
        twitterId: twitterUser.id,
        twitterUsername: twitterUser.username,
        name: twitterUser.name,
        twitterToken: accessToken,
        twitchToken,
      },
    });

    return { user, token };
  } catch (error) {
    throw new Error("Invalid verifier or access tokens!");
  }
};

export default createSession;
