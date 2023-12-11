import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

function LoginButton(loggedIn = false, logoutFunction) {
  console.log(loggedIn);
  if (loggedIn) {
    return (
      <form action={logoutFunction}>
        <button
          className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
          type="submit"
        >
          Logout
        </button>
      </form>
    );
  } else {
    return (
      <div>
        {" "}
        <Link
          href={"/login"}
          className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
          type="button"
        >
          Login
        </Link>
      </div>
    );
  }
}

export default function Home() {
  var loggedIn = false;
  async function logout() {
    "use server";
    cookies().delete("userdata");
  }

  const cookiesList = cookies();
  if (cookiesList.has("userdata")) {
    var userdata = cookiesList.get("userdata");
    console.log("Login page");
    console.log(userdata);
    if (userdata.value) {
      var user = JSON.parse(userdata.value);
      var username = user.name;
      loggedIn = true;
    } else {
      username = "Guest";
      loggedIn = false;
    }
  } else {
    username = "Guest";
    loggedIn = false;
  }

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Welcome, {username}!
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              {(loggedIn && "") || "Login to access the features"}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            {LoginButton(loggedIn, logout)}
          </div>
        </div>
      </div>
    </header>
  );
}
