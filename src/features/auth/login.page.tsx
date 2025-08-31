import { Link } from "react-router";
import AuthLayout from "./ui/auth-layout";
import { ROUTES } from "@/shared/model/routes";
import { LoginForm } from "./ui/login-form";

function LoginPage() {
  return (
    <AuthLayout
      title="Вход в систему"
      description="Введите ваш email и пароль для входа в систему"
      footerText={
        <>
          Нет аккаунта?
          <Link className="p-5" to={ROUTES.REGISTER}>
            Зарегистрироваться
          </Link>
        </>
      }
      form={<LoginForm />}
    />
  );
}

export const Component = LoginPage;
