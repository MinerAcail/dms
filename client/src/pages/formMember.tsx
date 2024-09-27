import "../assets/styles/style.scss";
import "../App.scss";
import MemberForm from "@/components/forms/memberForm";

function CreateMemberForm() {
 ///okay
  return (
    <div className="section">
      <div className="_divLg py-10">
        <MemberForm />
      </div>
    </div>
  );
}

export default CreateMemberForm;
