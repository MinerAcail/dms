import "./style.scss" 

interface RadioInputProps {
  value?: string;
  name?: string;
  isChecked: boolean; 
  onChange: () => void;
}

function RadioInput({
  value,
  name = "Fifiei Aseson",
  isChecked, 
  onChange,
}: RadioInputProps) {
  return (
    <div className="cantainer flex  rounded-md justify-around items-center mt-6 px-11">
      <h2 className="mr-10 py-5 text-xl font-bold">{name}</h2>
      <input
        className="h-8 w- checkbox"
        type="checkbox"
        value={value}
        name={name}
        checked={isChecked} // Ensure that isChecked is defined
        onChange={onChange}
      />
    </div>
  );
}

export default RadioInput;
