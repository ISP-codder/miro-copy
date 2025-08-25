import { Link } from "react-router";
import AuthLayout from "./ui/auth-layout";
import { ROUTES } from "@/shared/model/routes";
import { RegisterForm } from "./ui/register-form";

function RegisterPage() {
  return (
    <AuthLayout
      title="Регистрация"
      description="Введите ваш email и пароль для регистрации в системе"
      footerText={
        <>
          Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link>
        </>
      }
      form={<RegisterForm />}
    />
  );
}

export const Component = RegisterPage;
