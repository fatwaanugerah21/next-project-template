import React from "react";

interface IFormComponentProps extends React.HTMLAttributes<HTMLFormElement> {}

const FormComponent: React.FC<IFormComponentProps> = ({
  onSubmit,
  children,
  ...rest
}) => {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit && onSubmit(e);
  }

  return (
    <form onSubmit={handleSubmit} {...rest}>
      {children}
    </form>
  );
};
export default FormComponent;
