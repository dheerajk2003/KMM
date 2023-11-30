import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Registration() {
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [eyeOn, setEyeOn] = useState(false);
  const [notConfirmed, setNotConfirmed] = useState(false);
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

  async function checkConf(e){
    e.preventDefault();
    if(confirmPassword != password){
      setNotConfirmed(true);
    }
    else{
      
      handleSubmit();
    }
  }

  async function handleSubmit() {
    await fetch(`${import.meta.env.VITE_BAD}/register`, {
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
    <section class="bg-gray-50 h-screen" onSubmit={checkConf}>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <button onClick={toHome} class="flex items-center mb-3 text-4xl font-semibold text-gray-600 ">
          KMM
        </button>
        <div class="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0  ">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl ">
              Sign up
            </h1>
            <form class="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your email
                </label>
                <input
                  type="email"
                  name=""
                  id="userEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5  "
                  placeholder="name@company.com"
                  required="true" />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 "
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
                    class="inline mb-5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2.5"
                    required="true" />
                  <button
                    className="absolute inline right-3 top-2"
                    onClick={toggleBtn}
                  >
                    {"👁️"}
                  </button>
                </div>
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={eyeOn ? "text" : "password"}
                    name=""
                    id="userConfPassword"
                    value={confirmPassword}
                    onChange={(e) => {setConfirmPassword(e.target.value)}}
                    placeholder="••••••••"
                    class="inline mb-5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2.5"
                    required="true" />
                  <button
                    className="absolute inline right-3 top-2"
                    onClick={toggleBtn}
                  >
                    {"👁️"}
                  </button>
                </div>
                <p className="text-red-600" style={{display: notConfirmed ? "block" : "none"}}>Both Passwords should be same</p>
              </div>
              <button
                type="submit"
                class="w-full text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign up
              </button>
              <p class="text-sm font-light text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={handleRegis}
                  className="text-rose-400 text-bold hover:underline"
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
