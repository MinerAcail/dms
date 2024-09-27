import "../assets/styles/style.scss";
import "../App.scss";

import SignInForm from "@/components/forms/signIn";


function SignIn() {
 
  return (
    <div className="section">
      <div className="_divLg  ">
        <SignInForm />
      </div>
    </div>
  );
}

export default SignIn;
