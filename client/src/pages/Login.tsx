import { Button } from "antd";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { useAppDispatch } from "../redux/hook";
import { setUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";

const Login = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      id: "A-0001",
      password: "admin",
    },
  });
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();

  const onSubmit = async (data: any) => {
    const userInfo = {
      id: data.id,
      password: data.password,
    };

    const res = await login(userInfo).unwrap();
    const user = verifyToken(res.data.accessToken);

    dispatch(
      setUser({
        user: user,
        token: res.data.accessToken,
      })
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="id">ID: </label>
          <input type="text" id="id" {...register("id")} />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="text" id="password" {...register("password")} />
        </div>
        <Button htmlType="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
