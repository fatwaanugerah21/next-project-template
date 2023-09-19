import React from "react";
import { IIConProps } from "./interface.icon";
import { COLORS } from "../constants/colors.contant";

const ExampleIcon: React.FC<IIConProps> = ({ isActive, fill, ...props }) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <g clip-path="url(#clip0_639_5637)">
        <path
          d="M13.088 5.084C14.153 4.388 16 2.883 16 0.8V0H8V0.8C8 2.883 9.847 4.388 10.912 5.084C5.548 5.908 1 12.63 1 18C1 21.309 3.691 24 7 24H17C20.309 24 23 21.309 23 18C23 12.63 18.452 5.908 13.088 5.084ZM10.643 13.76L13.685 14.267C15.026 14.49 16 15.64 16 17C16 18.654 14.654 20 13 20V21H11V20C9.346 20 8 18.654 8 17H10C10 17.551 10.449 18 11 18H13C13.551 18 14 17.551 14 17C14 16.622 13.729 16.302 13.356 16.24L10.314 15.733C8.973 15.51 7.999 14.36 7.999 13C7.999 11.346 9.345 10 10.999 10V9H12.999V10C14.653 10 15.999 11.346 15.999 13H13.999C13.999 12.449 13.55 12 12.999 12H10.999C10.448 12 9.999 12.449 9.999 13C9.999 13.378 10.27 13.698 10.643 13.76Z"
          fill={isActive ? COLORS.PRIMARY : fill || "#00AA5A"}
        />
      </g>
      <defs>
        <clipPath id="clip0_639_5637">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default ExampleIcon;
