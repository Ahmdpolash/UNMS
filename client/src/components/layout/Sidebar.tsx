import { Layout, Menu } from "antd";
import { SidebarItemGenerator } from "../../utils/sideBarItemGenerator";
import adminPaths from "../../routes/Admin.routes";
import { facultyPaths } from "../../routes/faculty.routes";
import { studentPaths } from "../../routes/student.routes";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const userRole = {
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
};

const Sidebar = () => {
  const role = "faculty";
  let sidebarItems;

  switch (role) {
    case userRole.ADMIN:
      sidebarItems = SidebarItemGenerator(adminPaths, userRole.ADMIN);
      break;
    case userRole.FACULTY:
      sidebarItems = SidebarItemGenerator(facultyPaths, userRole.FACULTY);
      break;
    case userRole.STUDENT:
      sidebarItems = SidebarItemGenerator(studentPaths, userRole.STUDENT);
      break;

    default:
      break;
  }

  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div
        style={{
          color: "white",
          height: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link to={`/${role}/dashboard`}>
          <h1>UNMS</h1>
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={sidebarItems}
      />
    </Sider>
  );
};

export default Sidebar;

