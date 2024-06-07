import React, { useRef } from "react";

interface Props {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>
}

const LocationForm = ({location, setLocation}: Props): React.JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newLocation = inputRef.current?.value || '';
    setLocation(newLocation);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        ref={inputRef}
        name="location"
        defaultValue={location}
      />
      <button type="submit">찾기</button>
    </form>
  )
}

export default LocationForm;