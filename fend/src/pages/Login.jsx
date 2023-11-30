import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { takeToken } from "./globalFuncs";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vCode, setVCode] = useState("");
  const [eyeOn, setEyeOn] = useState(false);
  const [codeOn, setCodeOn] = useState(false);
  // const history = useHistory();
  const navigate = useNavigate();

  function handleRegis(e) {
    e.preventDefault();
    navigate("/register");
  }

  function toHome(e) {
    e.preventDefault();
    navigate("/");
  }

  function toggleBtn(e) {
    e.preventDefault();
    setEyeOn(eyeOn ? false : true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("called the func");
    try {
      fetch(`http://localhost:4000/${codeOn ? "verify" : "login"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:email, password: password, vCode:vCode }),
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.ok){
            if (data.verified) {
              console.log("inside if login");
              localStorage.setItem("KMMtoken", data.accessToken);
              //props.setLogin(true);
              //window.location.reload(false);
              navigate("/feed");
            } else {
              setCodeOn(true);
            }
          }
          alert(data.error);
        });
    } catch (error) {
      alert("error occured in login" + error);
    }
  }

  return (
    <section className="bg-gray-50 h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <button onClick={toHome} className="flex items-center mb-3 text-4xl font-semibold text-gray-600 ">
          KMM
        </button>
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl">
              Sign in to your account
            </h1>
            {/* <form className="space-y-4 md:space-y-6"> */}
            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="userEmail"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name=""
                  id="userEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5"
                  placeholder="name@company.com"
                  required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="userPassword"
                  className="block mb-2 text-sm font-medium text-gray-900"
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
                    className="mb-5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 "
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

              {codeOn ? <div >
                <label
                  htmlFor="userEmail"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Verification Code
                </label>
                <input
                  type="number"
                  name="vCode"
                  id="vCode"
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5"
                  placeholder="* * * *"
                  required="true"
                />
              </div>
              : ""}

              <button
                type="submit"
                className="w-full text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >Sign In</button>
              <p className="text-sm font-light text-gray-500 ">
                Don’t have an account yet?{" "}
                <button type="button"
                  onClick={handleRegis}
                  className="text-rose-400 text-bold hover:underline"
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