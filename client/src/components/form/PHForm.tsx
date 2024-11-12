import { useForm } from "react-hook-form";

const PHForm = ({ onsubmit,children }) => {
  const { handleSubmit } = useForm();
  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>{children}</form>
    </div>
  );
};

export default PHForm;
