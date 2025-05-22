import { useState } from "react";

//ASSETS
import { IMAGES } from "../assets";

//COMPONENT
import { LAView } from ".";

interface LATextImputProps {
  name: string | undefined;
  type: string | undefined;
  left: JSX.Element | undefined;
  placeholder: string | undefined;
  value: Number | String | "";
  id: string | undefined;
  disable: Boolean | undefined;
}

function LATextInput(props: LATextImputProps) {
  const [isPasswordHide, setPasswordHide] = useState(true);

  return (
    <LAView
      flex="row"
      className="flex h-[40px] sm:h-[45px] md:h-[50px] lg:h-[56px] rounded-[12px] px-4 bg-[#F6FAFF] dark:bg-[#222] items-center"
    >
      {props.left && (
        <img className="aspect-square h-[50%] mr-4" src={props.left} />
      )}
      <input
        autoComplete="off"
        type={
          props.type == "password"
            ? isPasswordHide
              ? "password"
              : "text"
            : props.type
        }
        id={props.id}
        name={props?.name}
        value={props?.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        disabled={props?.disable}
        className="
                bg-transparent 
                w-full 
                font-manrope-400
                text-[#000] dark:text-[#fff]
                placeholder:font-manrope-400
                placeholder:text-[#ADBACC] placeholder:dark:text-[#ffffff80]
                outline-none 
                border-none 
                focus:ring-0"
        placeholder={props.placeholder}
      />
      {props.type == "password" && (
        <>
          {isPasswordHide ? (
            <img
              className="aspect-square h-[50%] ml-4"
              src={IMAGES.ic_hide}
              onClick={() => setPasswordHide(!isPasswordHide)}
            />
          ) : (
            <img
              className="aspect-square h-[50%] ml-4"
              src={IMAGES.ic_view}
              onClick={() => setPasswordHide(!isPasswordHide)}
            />
          )}
        </>
      )}
    </LAView>
  );
}

export default LATextInput;
