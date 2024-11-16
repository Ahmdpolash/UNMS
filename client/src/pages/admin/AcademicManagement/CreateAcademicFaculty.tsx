import { Button, Col, Flex } from "antd";
import PHForm from "../../../components/form/PHForm";
import PHInput from "../../../components/form/PHInput";
import { useAddAcademicFacultyMutation } from "../../../redux/features/admin/academicManagement.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateAcademicFaculty = () => {
  const navigate = useNavigate();
  const [addAcademicFaculty, {}] = useAddAcademicFacultyMutation();

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Creating...");

    const academicFacultyInfo = {
      name: data.academicFaculty,
    };

    try {
      const res = await addAcademicFaculty(academicFacultyInfo);

      if (res.error) {
        toast.error(res?.error?.data?.message, { id: toastId });
      } else {
        toast.success("Academic Faculty created Successfully", { id: toastId });
        navigate("/admin/academic-faculty");
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  return (
    <div>
      <Flex justify="center" align="center">
        <Col span={6}>
          <PHForm
            onSubmit={onSubmit}
            // resolver={zodResolver(academicSemeserSchema)}
          >
            <PHInput
              type="text"
              label="Academic Faculty"
              name="academicFaculty"
            />

            <Button htmlType="submit">Submit</Button>
          </PHForm>
        </Col>
      </Flex>
    </div>
  );
};
export default CreateAcademicFaculty;
