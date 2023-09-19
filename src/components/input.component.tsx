import { Input, InputProps } from "@mantine/core";
import React from "react";
import { COLORS } from "../constants/colors.contant";

interface IInputComponentProps extends InputProps {
  ref?: any;
  label?: string;
  description?: string;
  error?: string;
  color?: string;
}

const InputComponent: React.FC<IInputComponentProps> = React.forwardRef(
  ({ label, description, error, ...props }, ref) => {
    return (
      <Input.Wrapper error={error} ref={ref as any}>
        {label && (
          <Input.Label color={error ? COLORS.DANGER : props.color}>
            {label}
          </Input.Label>
        )}
        {description && <Input.Description>{description}</Input.Description>}
        <Input error={error} {...props} />
      </Input.Wrapper>
    );
  }
);

InputComponent.displayName = "InputComponent";

export default InputComponent;
