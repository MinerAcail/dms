import "./style.scss" 

interface CheckRadioInputProps {
  value?: string;
  name?: string;
  isChecked: boolean; // Define isChecked as a boolean prop
  onChange: (isChecked: boolean) => void;
}

function CheckRadioInput({
  value,
  name = "Fifiei Aseson",
  isChecked, // Ensure that isChecked is always defined and controlled
  onChange,
}: CheckRadioInputProps) {
  // Removed the unused setIsChecked state

  const toggleCheckbox = () => {
    const newValue = !isChecked;
    onChange(newValue);
  };

  return (
    <div className="cantainer flex  rounded-md justify-around items-center mt-6 px-11">
      <h2 className="mr-10 py-5 text-xl font-bold">{name}</h2>
      <input
        className="h-8 w- checkbox"
        type="checkbox"
        value={value}
        name={name}
        checked={isChecked || false} // Ensure that isChecked is defined
        onChange={toggleCheckbox}
      />
    </div>
  );
}

export default CheckRadioInput;
