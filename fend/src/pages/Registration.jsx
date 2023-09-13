import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Registration() {
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyeOn, setEyeOn] = useState(false);
  const navigate = useNavigate();

  function handleRegis(e) {
    e.preventDefault();
    navigate("/login");
  }

  function toHome(e) {
    e.preventDefault();
    navigate("/");
  }

  function toggleBtn(e) {
    e.preventDefault();
    setEyeOn(eyeOn ? false : true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.error); // Response from the server
        if (data.ok) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err + "error");
      });
  }

  return (
    <section class="bg-gray-50 dark:bg-gray-900" onSubmit={handleSubmit}>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <button onClick={toHome} class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          KMM
        </button>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up
            </h1>
            <form class="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name=""
                  id="userEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required="true" />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={eyeOn ? "text" : "password"}
                    name=""
                    id="userPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    class="inline mb-5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required="true" />
                  <button
                    className="absolute inline right-3 top-2"
                    onClick={toggleBtn}
                  >
                    {"👁️"}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign up
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={handleRegis}
                  className="text-primary-400 text-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
