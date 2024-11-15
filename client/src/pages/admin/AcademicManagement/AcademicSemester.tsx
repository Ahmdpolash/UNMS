import { useGetAllSemesterQuery } from "../../../redux/features/admin/academicManagement.api";

const AcademicSemester = () => {
  const { data } = useGetAllSemesterQuery(undefined);

  console.log(data);
  return (
    <div>
      <h1>hi{data?.data.length}</h1>
    </div>
  );
};

export default AcademicSemester;
