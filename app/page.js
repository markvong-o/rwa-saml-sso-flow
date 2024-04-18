"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Auth0Client } from "@auth0/auth0-spa-js";

export default function Home() {
  const { user, error, isLoading } = useUser();

  const auth0 = new Auth0Client({
    domain: "dev-b4nlzp3r.us.auth0.com",
    clientId: "Ibev1cSnPxSBcGZY2ivBgIWEgesAgLMp",
    authorizationParams: {
      redirect_uri: "http://localhost:3000",
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  const code = searchParams.get("code");

  if (code) {
    // handle the login redirect
    (async () => {
      try {
        let res = await auth0.handleRedirectCallback();
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    })();
  }

  if (user) {
    (async () => {
      if (!(await auth0.checkSession())) {
        await auth0.loginWithPopup({
          authorizationParams: { prompt: "none" },
        });
      }
    })();
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
        <section>
          <a
            href="https://dev-b4nlzp3r.us.auth0.com/samlp/5aYhrBvsra0Q4qgID9mCdVR5SfSsz2FB?connection=dev-users"
            target="_blank"
          >
            SAML SSO
          </a>
        </section>
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
}
