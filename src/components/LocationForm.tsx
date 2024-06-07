import React, { useRef } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useData } from "../hooks/useData";

interface Props {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>
}

const LocationForm = (): React.JSX.Element => {
  const { location, setLocation } = useData();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newLocation = inputRef.current?.value || '';
    setLocation(newLocation);
  }
  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control 
          type="text" 
          ref={inputRef}
          name="location"
          defaultValue={location}
        />
        <Button type="submit">찾기</Button>
      </InputGroup>
    </Form>
  )
}

export default LocationForm;