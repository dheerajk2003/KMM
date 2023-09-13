import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { takeToken } from "./globalFuncs";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyeOn, setEyeOn] = useState(false);
  // const history = useHistory();
  const navigate = useNavigate();

  function handleRegis(e) {
    e.preventDefault();
    navigate("/register");
  }

  function toHome(e){
    e.preventDefault();
    navigate("/");
  }

  function toggleBtn(e){
    e.preventDefault();
    setEyeOn(eyeOn ? false : true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          const accToken = data.accessToken;
          if (accToken) {
            localStorage.setItem("KMMtoken", accToken);
            alert(data.error);
            navigate("/");
          } else {
            alert(data.error);
          }
        });
    } catch (error) {
      alert("error occured in login" + error);
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <button onClick={toHome} className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          KMM
        </button>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>

              <div>
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name=""
                  id="userEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required="true"
                />
              </div>
              <div>
                <label
                  for="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    className="mb-5 inline bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <button type="button"
                    className="absolute inline right-3 top-2"
                    onClick={toggleBtn}
                  >
                    {"👁️"}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <button type="button"
                  onClick={handleRegis}
                  className="text-primary-400 text-bold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}